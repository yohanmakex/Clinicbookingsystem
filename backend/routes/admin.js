import express from 'express';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import TimeSlot from '../models/TimeSlot.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { serviceValidation, timeSlotValidation, validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication to all admin routes
router.use(authenticateToken, isAdmin);

// ===== APPOINTMENTS =====

// Get all appointments with filters
router.get('/appointments', async (req, res) => {
  try {
    const { date, branch, status } = req.query;
    const query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }
    if (branch) query.branch = branch;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('service')
      .sort({ appointmentDate: -1, startTime: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment status
router.patch('/appointments/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes !== undefined && { notes }) },
      { new: true }
    ).populate('service');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get client history
router.get('/clients/:email', async (req, res) => {
  try {
    const appointments = await Appointment.find({ clientEmail: req.params.email })
      .populate('service')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== SERVICES =====

// Get all services (including inactive)
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add service
router.post('/services', serviceValidation, validateRequest, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service
router.put('/services/:id', serviceValidation, validateRequest, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete service (soft delete by setting isActive to false)
router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== TIME SLOTS =====

// Get all time slots
router.get('/timeslots', async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find().sort({ dayOfWeek: 1, startTime: 1 });
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add time slot
router.post('/timeslots', timeSlotValidation, validateRequest, async (req, res) => {
  try {
    const timeSlot = new TimeSlot(req.body);
    await timeSlot.save();
    res.status(201).json(timeSlot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete time slot
router.delete('/timeslots/:id', async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndDelete(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    res.json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== ANALYTICS =====

// Get monthly analytics
router.get('/analytics/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    
    // Default to current month if not provided
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    
    // Calculate date range
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);
    
    // Get all appointments for the month
    const appointments = await Appointment.find({
      appointmentDate: { $gte: startDate, $lte: endDate }
    }).populate('service');
    
    // Calculate statistics
    const totalBookings = appointments.length;
    const completedBookings = appointments.filter(apt => apt.status === 'completed').length;
    const cancelledBookings = appointments.filter(apt => apt.status === 'cancelled').length;
    const pendingBookings = appointments.filter(apt => apt.status === 'pending').length;
    const confirmedBookings = appointments.filter(apt => apt.status === 'confirmed').length;
    
    // Calculate revenue (from completed appointments)
    const totalRevenue = appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + (apt.service?.price || 0), 0);
    
    // Service popularity
    const serviceStats = {};
    appointments.forEach(apt => {
      if (apt.service) {
        const serviceName = apt.service.name;
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { count: 0, revenue: 0 };
        }
        serviceStats[serviceName].count++;
        if (apt.status === 'completed') {
          serviceStats[serviceName].revenue += apt.service.price;
        }
      }
    });
    
    const popularServices = Object.entries(serviceStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count);
    
    // Daily bookings
    const dailyBookings = {};
    appointments.forEach(apt => {
      const day = new Date(apt.appointmentDate).getDate();
      dailyBookings[day] = (dailyBookings[day] || 0) + 1;
    });
    
    // Status breakdown
    const statusBreakdown = {
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings
    };
    
    // Peak hours
    const hourlyBookings = {};
    appointments.forEach(apt => {
      const hour = apt.startTime.split(':')[0];
      hourlyBookings[hour] = (hourlyBookings[hour] || 0) + 1;
    });
    
    const peakHours = Object.entries(hourlyBookings)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    res.json({
      period: {
        year: targetYear,
        month: targetMonth,
        monthName: new Date(targetYear, targetMonth - 1).toLocaleString('default', { month: 'long' })
      },
      summary: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue,
        averageRevenuePerBooking: completedBookings > 0 ? Math.round(totalRevenue / completedBookings) : 0,
        completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
        cancellationRate: totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0
      },
      statusBreakdown,
      popularServices,
      dailyBookings,
      peakHours
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
