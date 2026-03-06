import express from 'express';
import TimeSlot from '../models/TimeSlot.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// Get all active time slots (public)
router.get('/', async (req, res) => {
  try {
    const { branch } = req.query;
    const query = { isActive: true };
    if (branch) query.branch = branch;

    const timeSlots = await TimeSlot.find(query).sort({ dayOfWeek: 1, startTime: 1 });
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available time slots for a specific date (excludes booked slots)
router.get('/available', async (req, res) => {
  try {
    const { date, branch } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    // Get current time in clinic's timezone (default: Asia/Kolkata for India)
    const clinicTimezone = process.env.CLINIC_TIMEZONE || 'Asia/Kolkata';
    const now = new Date();
    const clinicTime = new Date(now.toLocaleString("en-US", {timeZone: clinicTimezone}));
    const isToday = selectedDate.toDateString() === clinicTime.toDateString();
    
    // Get all time slots for this day
    const query = { isActive: true, dayOfWeek };
    if (branch) query.branch = branch;
    
    const allTimeSlots = await TimeSlot.find(query).sort({ startTime: 1 });

    // Get booked appointments for this date with service details
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      branch: branch || 'Main Branch',
      status: { $nin: ['cancelled'] } // Exclude cancelled appointments
    }).populate('service');

    // Helper function to convert time string to minutes
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Helper function to check if a time slot overlaps with any booking
    const hasOverlap = (slotStart, slotEnd) => {
      const slotStartMin = timeToMinutes(slotStart);
      const slotEndMin = timeToMinutes(slotEnd);

      return bookedAppointments.some(apt => {
        const aptStartMin = timeToMinutes(apt.startTime);
        const aptEndMin = timeToMinutes(apt.endTime);
        
        // Check for any overlap
        return (slotStartMin < aptEndMin && slotEndMin > aptStartMin);
      });
    };

    // Filter available slots
    const availableSlots = allTimeSlots.filter(slot => {
      // If it's today, check if the slot time has passed
      if (isToday) {
        const currentTime = clinicTime.getHours() * 60 + clinicTime.getMinutes();
        const slotTime = timeToMinutes(slot.startTime);
        
        // Skip slots that have already passed (with 30-minute buffer)
        if (slotTime <= currentTime + 30) {
          return false;
        }
      }

      // Check for overlaps with existing bookings
      return !hasOverlap(slot.startTime, slot.endTime);
    });

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
