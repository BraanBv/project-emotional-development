let resultData = null;

document.addEventListener('DOMContentLoaded', () => {
  loadResults();
  createConfetti();
});

function loadResults() {
  const storedResult = localStorage.getItem('quiz_result');

  if (!storedResult) {
    showError('No se encontraron resultados. Por favor, completa un quiz primero.');
    setTimeout(() => goToHome(), 3000);
    return;
  }

  resultData = JSON.parse(storedResult);
  displayResults();
}

function displayResults() {
  const result = resultData.result;
  const scores = resultData.scores;
  const alias = resultData.alias;
  const quizTitle = resultData.quizTitle;

  document.getElementById('resultTitle').textContent = result.title;
  document.getElementById('resultMessage').textContent = `${alias}, ${result.description.substring(0, 50)}...`;

  const resultImg = document.getElementById('resultImg');
  if (result.imageUrl && resultImg) {
    resultImg.src = result.imageUrl;
    resultImg.alt = result.title;
  }

  const resultDescription = document.getElementById('resultDescription');
  if (resultDescription) {
    resultDescription.innerHTML = `
            <strong>Tu resultado: ${result.title}</strong><br><br>
            ${result.description}
        `;
  }

  if (result.traits && result.traits.length > 0) {
    const traitsContainer = document.getElementById('personalityTraits');
    if (traitsContainer) {
      traitsContainer.innerHTML = result.traits.map(trait =>
        `<span class="trait">${escapeHtml(trait)}</span>`
      ).join('');
    }
  }

  displayScores(scores);
}

function displayScores(scores) {
  const scoresContainer = document.getElementById('scoresContainer');
  const scoresGrid = document.getElementById('scoresGrid');

  if (!scores || Object.keys(scores).length === 0) {
    if (scoresContainer) scoresContainer.style.display = 'none';
    return;
  }

  const maxScore = Math.max(...Object.values(scores));

  if (scoresGrid) {
    scoresGrid.innerHTML = Object.entries(scores).map(([type, score]) => {
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      return `
                <div class="score-card">
                    <div class="score-label">${capitalize(type)}</div>
                    <div class="score-value">${score}</div>
                    <div class="score-bar">
                        <div class="score-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
    }).join('');
  }
}

function createConfetti() {
  const confettiContainer = document.getElementById('confetti');
  if (!confettiContainer) return;

  const colors = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444'];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.opacity = Math.random() * 0.8 + 0.2;
    confetti.style.pointerEvents = 'none';
    confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;

    confettiContainer.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
  }
}

function shareResult() {
  if (!resultData) return;

  const text = `Acabo de completar el quiz "${resultData.quizTitle}" y obtuve: ${resultData.result.title} \n\n${resultData.result.description}`;

  if (navigator.share) {
    navigator.share({
      title: 'Mi resultado en QuizMaster',
      text: text,
      url: window.location.origin
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Resultado copiado al portapapeles', 'success');
    }).catch(() => {
      showToast('No se pudo compartir el resultado', 'error');
    });
  }
}

function goToHome() {
  localStorage.removeItem('quiz_result');
  window.location.href = '/';
}

function tryAnotherQuiz() {
  localStorage.removeItem('quiz_result');
  window.location.href = '/';
}

window.shareResult = shareResult;
window.goToHome = goToHome;
window.tryAnotherQuiz = tryAnotherQuiz;

const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
if (!document.querySelector('#confetti-styles')) {
  style.id = 'confetti-styles';
  document.head.appendChild(style);
}