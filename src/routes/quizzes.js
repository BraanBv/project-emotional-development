import express from 'express';
import { getQuizById, getQuizBySlug, submitQuiz } from '../controllers/quizController.js';
import { quizValidation } from '../middleware/validation.js';

export const quizRouter = express.Router();

quizRouter.get('/id/:id', getQuizById);
quizRouter.get('/slug/:slug', getQuizBySlug);
quizRouter.post('/:slug/submit', quizValidation.submit, submitQuiz);
