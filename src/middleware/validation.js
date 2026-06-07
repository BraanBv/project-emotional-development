import { body, param, validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const quizValidation = {
  create: [
    body('title').notEmpty().withMessage('El título es requerido'),
    body('slug').notEmpty().withMessage('El slug es requerido'),
    body('category').notEmpty().withMessage('La categoría es requerida'),
    body('questions').isArray({ min: 1 }).withMessage('Debe tener al menos una pregunta'),
    body('results').isArray({ min: 1 }).withMessage('Debe tener al menos un resultado'),
    validate
  ],
  submit: [
    param('slug').notEmpty().withMessage('Slug requerido'),
    body('alias').notEmpty().withMessage('Alias requerido'),
    body('answers').isArray().withMessage('Answers debe ser un array'),
    validate
  ]
};


