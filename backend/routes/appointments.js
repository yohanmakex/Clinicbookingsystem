import express from 'express';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import { appointmentValidation, validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Book appointment (public)
router.post('/', appointmentValidation, validateRequest, async (req, res) => {
  try {
    const { clientName, clientPhone, clientEmail, service, branch, appointmentDate, startTime } = req.body;

    // Check if service exists
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Calculate end time based on service duration
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + serviceDoc.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    // Validate booking time (not in the past for today)
    const selectedDate = new Date(appointmentDate);
    
    // Get current time in clinic's timezone
    const clinicTimezone = process.env.CLINIC_TIMEZONE || 'Asia/Kolkata';
    const now = new Date();
    const clinicTime = new Date(now.toLocaleString("en-US", {timeZone: clinicTimezone}));
    const isToday = selectedDate.toDateString() === clinicTime.toDateString();
    
    if (isToday) {
      const currentTime = clinicTime.getHours() * 60 + clinicTime.getMinutes();
      const bookingTime = hours * 60 + minutes;
      
      if (bookingTime <= currentTime + 30) { // 30-minute buffer
        return res.status(400).json({ 
          message: 'Cannot book appointments in the past. Please select a future time slot.' 
        });
      }
    }

    // Helper function to convert time to minutes
    const timeToMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    // Check for overlapping appointments (considering service duration)
    const newStartMin = timeToMinutes(startTime);
    const newEndMin = timeToMinutes(endTime);

    const overlappingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
      branch: branch || 'Main Branch',
      status: { $nin: ['cancelled'] }
    }).populate('service');

    if (overlappingAppointment) {
      const existingStartMin = timeToMinutes(overlappingAppointment.startTime);
      const existingEndMin = timeToMinutes(overlappingAppointment.endTime);
      
      // Check for any time overlap
      const hasOverlap = (newStartMin < existingEndMin && newEndMin > existingStartMin);
      
      if (hasOverlap) {
        return res.status(409).json({ 
          message: `Time slot conflicts with existing appointment (${overlappingAppointment.startTime} - ${overlappingAppointment.endTime}). Please choose a different time.` 
        });
      }
    }

    // Additional check: Find ALL appointments for the day and check overlaps
    const allAppointments = await Appointment.find({
      appointmentDate: new Date(appointmentDate),
      branch: branch || 'Main Branch',
      status: { $nin: ['cancelled'] }
    }).populate('service');

    for (const apt of allAppointments) {
      const aptStartMin = timeToMinutes(apt.startTime);
      const aptEndMin = timeToMinutes(apt.endTime);
      
      // Check for overlap
      if (newStartMin < aptEndMin && newEndMin > aptStartMin) {
        return res.status(409).json({ 
          message: `Time slot conflicts with existing ${apt.service?.name || 'appointment'} (${apt.startTime} - ${apt.endTime}). Please choose a different time.` 
        });
      }
    }

    const appointment = new Appointment({
      clientName,
      clientPhone,
      clientEmail,
      service,
      branch: branch || 'Main Branch',
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      status: 'pending'
    });

    await appointment.save();
    await appointment.populate('service');

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
