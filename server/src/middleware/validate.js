import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    req.body = value;
    next();
  };
};

// Common validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain: uppercase, lowercase, number, special char (@$!%*?&)',
      'string.min': 'Password must be at least 8 characters',
    }),
  role: Joi.string().valid('admin', 'doctor', 'receptionist', 'patient'),
  phone: Joi.string().length(10),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const patientSchema = Joi.object({
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid('male', 'female', 'other'),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  allergies: Joi.array().items(Joi.string()),
  chronicDiseases: Joi.array().items(Joi.string()),
});

export const appointmentSchema = Joi.object({
  doctorId: Joi.string().required(),
  date: Joi.date().required(),
  timeSlot: Joi.object({
    start: Joi.string().required(),
    end: Joi.string().required(),
  }),
  reason: Joi.string(),
  type: Joi.string().valid('consultation', 'follow-up', 'emergency', 'routine'),
});
