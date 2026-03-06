import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientPhone: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  branch: {
    type: String,
    default: 'Main Branch',
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for preventing double booking
appointmentSchema.index({ appointmentDate: 1, startTime: 1, branch: 1 });

export default mongoose.model('Appointment', appointmentSchema);
