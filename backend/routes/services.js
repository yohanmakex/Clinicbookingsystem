import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// Get all active services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
