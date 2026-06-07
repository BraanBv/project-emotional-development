import { getStatisticsQuizAttempt } from '../models/QuizAttempt.js';

export async function getQuizStatistics(req, res) {
  try {
    const { quizId } = req.params;
    const stats = await getStatisticsQuizAttempt(quizId);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

