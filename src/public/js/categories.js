let selectedQuiz = null;
let currentAlias = '';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();

  const modal = document.getElementById('aliasModal');
  const closeBtn = document.querySelector('.modal-close');

  if (closeBtn) {
    closeBtn.onclick = () => closeModal();
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal();
    }
  };
});

function scrollToCategories() {
  document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
}

async function loadCategories() {
  const categoriesGrid = document.getElementById('categoriesGrid');

  try {
    showLoading();
    const categories = await API.getCategories();

    if (!categories || categories.length === 0) {
      categoriesGrid.innerHTML = '<p style="text-align: center;">No hay categorías disponibles por el momento.</p>';
      hideLoading();
      return;
    }

    categoriesGrid.innerHTML = categories.map(category => createCategoryCard(category)).join('');

    document.querySelectorAll('.quiz-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const quizId = item.dataset.quizId;
        const quizTitle = item.dataset.quizTitle;
        const quizSlug = item.dataset.quizSlug;
        openAliasModal(quizId, quizTitle, quizSlug);
      });
    });

    hideLoading();
  } catch (error) {
    hideLoading();
    categoriesGrid.innerHTML = '<p style="text-align: center; color: red;">Error al cargar las categorías. Por favor, intenta más tarde.</p>';
    console.error('Error loading categories:', error);
  }
}

function createCategoryCard(category) {
  return `
        <div class="category-card">
            <div class="category-header">
                <h3>${capitalize(category.category)}</h3>
                <div class="quiz-count">${category.quizCount} quizzes disponibles</div>
            </div>
            <div class="category-body">
                <div class="quiz-list">
                    ${category.quizzes.map(quiz => `
                        <div class="quiz-item" 
                             data-quiz-id="${quiz._id}" 
                             data-quiz-title="${escapeHtml(quiz.title)}"
                             data-quiz-slug="${quiz.slug}">
                            <div class="quiz-info">
                                <h4>${escapeHtml(quiz.title)}</h4>
                                <p>${escapeHtml(quiz.description || 'Descubre tu resultado')}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function openAliasModal(quizId, quizTitle, quizSlug) {
  selectedQuiz = {
    id: quizId,
    title: quizTitle,
    slug: quizSlug
  };

  const modal = document.getElementById('aliasModal');
  const input = document.getElementById('aliasInput');
  if (input) {
    input.value = '';
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
  }
}

function closeModal() {
  const modal = document.getElementById('aliasModal');
  modal.classList.remove('active');
}

function startQuiz() {
  const alias = document.getElementById('aliasInput').value.trim();

  if (!alias) {
    showToast('Por favor, ingresa un nombre para continuar', 'warning');
    return;
  }

  if (alias.length < 3) {
    showToast('El nombre debe tener al menos 3 caracteres', 'warning');
    return;
  }

  localStorage.setItem('quiz_alias', alias);

  closeModal();

  const quizUrl = `/quiz?slug=${encodeURIComponent(selectedQuiz.slug)}&alias=${encodeURIComponent(alias)}`;
  console.log('Redirigiendo a:', quizUrl);
  window.location.href = quizUrl;
}

document.getElementById('aliasInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    startQuiz();
  }
});

window.scrollToCategories = scrollToCategories;
window.startQuiz = startQuiz;
window.closeModal = closeModal;