const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';


const API = {
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cargar categorías');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error (getCategories):', error);
      throw error;
    }
  },

  async getQuizzesByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cargar quizzes');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error (getQuizzesByCategory):', error);
      throw error;
    }
  },

  async getQuizBySlug(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/slug/${encodeURIComponent(slug)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cargar el quiz');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error (getQuizBySlug):', error);
      throw error;
    }
  },

  async submitQuiz(slug, alias, answers, startedAt) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(slug)}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alias: alias,
          answers: answers,
          startedAt: startedAt
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al enviar respuestas');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error (submitQuiz):', error);
      throw error;
    }
  },

  async getQuizStats(quizId) {
    try {
      const response = await fetch(`${API_BASE_URL}/attempts/quiz/${quizId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cargar estadísticas');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error (getQuizStats):', error);
      throw error;
    }
  }
};