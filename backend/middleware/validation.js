import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const appointmentValidation = [
  body('clientName').trim().notEmpty().withMessage('Name is required'),
  body('clientPhone').trim().notEmpty().withMessage('Phone is required'),
  body('clientEmail').isEmail().withMessage('Valid email is required'),
  body('service').notEmpty().withMessage('Service is required'),
  body('appointmentDate').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)')
];

export const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be positive'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative')
];

export const timeSlotValidation = [
  body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0-6'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required')
];
