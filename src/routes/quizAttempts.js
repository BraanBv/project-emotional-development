import express from 'express';
import { getStatisticsQuizAttempt } from '../models/QuizAttempt.js';

export const quizAttemptsRouter = express.Router();

quizAttemptsRouter.get('/quiz/:quizId/stats', getStatisticsQuizAttempt);

