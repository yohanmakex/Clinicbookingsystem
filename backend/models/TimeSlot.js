import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  branch: {
    type: String,
    default: 'Main Branch',
    trim: true
  },
  dayOfWeek: {
    type: Number, // 0 = Sunday, 1 = Monday, etc.
    required: true,
    min: 0,
    max: 6
  },
  startTime: {
    type: String, // Format: "HH:MM" (24-hour)
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('TimeSlot', timeSlotSchema);
