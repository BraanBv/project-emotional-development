let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;
let alias = '';

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    slug: params.get('slug'),
    alias: params.get('alias')
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = getUrlParams();
  alias = params.alias || localStorage.getItem('quiz_alias') || 'Usuario';

  if (!params.slug) {
    showError('No se encontró el quiz solicitado');
    setTimeout(() => goBack(), 2000);
    return;
  }

  await loadQuiz(params.slug);
});

async function loadQuiz(slug) {
  try {
    showLoading();
    currentQuiz = await API.getQuizBySlug(slug);

    if (!currentQuiz) {
      throw new Error('Quiz no encontrado');
    }

    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    quizStartTime = new Date();

    updateQuizInfo();
    loadQuestion(0);

    hideLoading();
  } catch (error) {
    hideLoading();
    showError('Error al cargar el quiz: ' + error.message);
    console.error('Error loading quiz:', error);
  }
}

function updateQuizInfo() {
  document.getElementById('quizCategory').textContent = capitalize(currentQuiz.category);
  document.getElementById('quizTitle').textContent = currentQuiz.title;
  document.getElementById('quizDescription').textContent = currentQuiz.description || '';
  document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
}

function loadQuestion(index) {
  const question = currentQuiz.questions[index];
  if (!question) return;

  document.getElementById('currentQuestion').textContent = index + 1;
  document.getElementById('questionText').textContent = question.text;

  const progress = ((index + 1) / currentQuiz.questions.length) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;

  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';

  question.options.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.className = `option ${userAnswers[index] === option.id ? 'selected' : ''}`;
    optionDiv.onclick = () => selectOption(index, option.id);

    const radioDiv = document.createElement('div');
    radioDiv.className = 'option-radio';

    const textDiv = document.createElement('div');
    textDiv.className = 'option-text';
    textDiv.textContent = option.text;

    optionDiv.appendChild(radioDiv);
    optionDiv.appendChild(textDiv);
    optionsContainer.appendChild(optionDiv);
  });

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn.disabled = index === 0;

  if (index === currentQuiz.questions.length - 1) {
    nextBtn.textContent = 'Finalizar';
  } else {
    nextBtn.textContent = 'Siguiente →';
  }
}

function selectOption(questionIndex, optionId) {
  userAnswers[questionIndex] = optionId;

  const options = document.querySelectorAll('.option');
  options.forEach(opt => {
    opt.classList.remove('selected');
  });

  const clickedOption = event.currentTarget;
  clickedOption.classList.add('selected');
}

function nextQuestion() {
  if (userAnswers[currentQuestionIndex] === null) {
    showToast('Por favor, selecciona una respuesta antes de continuar', 'warning');
    return;
  }

  if (currentQuestionIndex === currentQuiz.questions.length - 1) {
    finishQuiz();
  } else {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion(currentQuestionIndex);
  }
}

async function finishQuiz() {
  const unanswered = userAnswers.filter(a => a === null).length;
  if (unanswered > 0) {
    showToast(`Te faltan responder ${unanswered} pregunta(s)`, 'warning');
    return;
  }

  const answers = userAnswers.map((answer, index) => ({
    questionId: currentQuiz.questions[index].id,
    selectedOption: answer
  }));

  try {
    showLoading();

    const result = await API.submitQuiz(
      currentQuiz.slug,
      alias,
      answers,
      quizStartTime.toISOString()
    );

    localStorage.setItem('quiz_result', JSON.stringify({
      result: result.result,
      scores: result.scores,
      alias: result.alias,
      quizTitle: currentQuiz.title
    }));

    window.location.href = '/results';

    hideLoading();
  } catch (error) {
    hideLoading();
    showError('Error al enviar respuestas: ' + error.message);
    console.error('Error submitting quiz:', error);
  }
}

function goBack() {
  if (confirm('¿Estás seguro de que quieres salir? Perderás tu progreso.')) {
    window.location.href = '/';
  }
}

window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.goBack = goBack;
window.selectOption = selectOption;