import { findQuizById, findQuizBySlug, incrementCompletedQuiz, incrementViewsQuiz } from '../models/Quiz.js';
import { createQuizAttempt } from '../models/QuizAttempt.js';
import { calculate } from '../utils/quizCalculator.js';


export async function getQuizById(req, res) {
  try {
    const { id } = req.params;
    const quiz = await findQuizById(id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    await incrementViewsQuiz(id);

    const quizForClient = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        options: q.options.map(opt => ({
          id: opt.id,
          text: opt.text
        }))
      }))
    };

    res.json(quizForClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getQuizBySlug(req, res) {
  try {
    const { slug } = req.params;
    const quiz = await findQuizBySlug(slug);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    await incrementViewsQuiz(quiz._id);

    const quizForClient = {
      _id: quiz._id,
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description,
      category: quiz.category,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options.map(opt => ({
          id: opt.id,
          text: opt.text
        }))
      })),
      metadata: quiz.metadata
    };

    res.json(quizForClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function submitQuiz(req, res) {
  try {
    const { slug } = req.params;
    const { alias, answers } = req.body;

    if (!alias || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Alias y respuestas son requeridos' });
    }

    const quiz = await findQuizBySlug(slug);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: 'Debes responder todas las preguntas' });
    }

    const { scores, result } = calculate(quiz, answers);

    const attempt = {
      quizId: quiz._id.toString(),
      alias: alias,
      answers: answers,
      scores: scores,
      resultType: result.type,
      result: result,
    };

    await createQuizAttempt(attempt);
    await incrementCompletedQuiz(quiz._id);

    res.json({
      success: true,
      result: result,
      scores: scores,
      alias: alias,
      message: `¡${alias}, ${result.title}!`
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
}