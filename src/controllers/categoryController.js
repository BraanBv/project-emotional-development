import { findQuizByCategory, getCategoriesQuiz } from '../models/Quiz.js';

export async function getAllCategories(req, res) {
  try {
    const categories = await getCategoriesQuiz();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCategory(req, res) {
  try {
    const { category } = req.params;
    const quizzes = await findQuizByCategory(category);

    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({
      category,
      quizzes: quizzes.map(q => ({
        _id: q._id,
        title: q.title,
        slug: q.slug,
        description: q.description,
        metadata: q.metadata
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
