import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';
import TimeSlot from '../models/TimeSlot.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await TimeSlot.deleteMany({});

    // Create admin user
    const admin = new User({
      email: 'admin@clinic.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');

    // Create services
    const services = [
      {
        name: 'Basic Facial',
        description: 'Deep cleansing facial with steam and extraction',
        duration: 60,
        price: 1500
      },
      {
        name: 'Anti-Aging Treatment',
        description: 'Advanced anti-aging facial with collagen boost',
        duration: 90,
        price: 3500
      },
      {
        name: 'Acne Treatment',
        description: 'Specialized treatment for acne-prone skin',
        duration: 75,
        price: 2500
      },
      {
        name: 'Hydra Facial',
        description: 'Deep hydration and skin rejuvenation',
        duration: 60,
        price: 2800
      },
      {
        name: 'Chemical Peel',
        description: 'Professional chemical peel for skin renewal',
        duration: 45,
        price: 2000
      }
    ];

    await Service.insertMany(services);
    console.log('Services created');

    // Create time slots (Mon-Sat, 9 AM - 6 PM)
    const timeSlots = [];
    const times = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
      { start: '17:00', end: '18:00' }
    ];

    for (let day = 1; day <= 6; day++) { // Monday to Saturday
      for (const time of times) {
        timeSlots.push({
          branch: 'Main Branch',
          dayOfWeek: day,
          startTime: time.start,
          endTime: time.end,
          isActive: true
        });
      }
    }

    await TimeSlot.insertMany(timeSlots);
    console.log('Time slots created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@clinic.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
