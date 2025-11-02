// Identifica qual artigo é esse pela URL
function getArticleId() {
    const path = window.location.pathname;
    if (path.includes('gerente')) return 'gerente';
    if (path.includes('poupanca')) return 'poupanca';
    if (path.includes('reserva')) return 'reserva';
    if (path.includes('calculadora')) return 'calculator';
    return null;
}

// Verifica se o artigo já foi completado
function checkIfCompleted() {
    const articleId = getArticleId();
    if (!articleId) return;

    const progress = window.FacaSeuFuturo.getProgress();
    let isCompleted = false;

    if (articleId === 'calculator') {
        isCompleted = progress.calculator;
    } else {
        isCompleted = progress.articles[articleId];
    }

    if (isCompleted) {
        const btnComplete = document.querySelector('.btn-complete');
        if (btnComplete) {
            btnComplete.textContent = '✓ Já Completo';
            btnComplete.classList.add('completed');
            btnComplete.disabled = true;
        }
    }
}

// Marca artigo como completo
function completeArticle() {
    const articleId = getArticleId();
    if (!articleId) return;

    const btnComplete = document.querySelector('.btn-complete');
    
    // Marca como completo
    window.FacaSeuFuturo.markArticleComplete(articleId);
    
    // Atualiza o botão
    if (btnComplete) {
        btnComplete.textContent = '✓ Completo!';
        btnComplete.classList.add('completed');
        btnComplete.disabled = true;
    }

    // Mensagem de parabéns
    showSuccessMessage();
}

// Mostra mensagem de sucesso
function showSuccessMessage() {
    // Cria um toast simples
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(90deg, #10B981, #4ADE80);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideDown 0.3s ease;
    `;
    toast.textContent = '🎉 Parabéns! Artigo completo!';
    
    document.body.appendChild(toast);
    
    // Remove após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Verifica respostas do quiz
function checkQuiz() {
    const questions = document.querySelectorAll('.quiz-question');
    let correctCount = 0;
    let totalQuestions = questions.length;

    questions.forEach(question => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        const correctOption = question.querySelector('input[data-correct="true"]');
        
        if (selectedOption) {
            if (selectedOption.getAttribute('data-correct') === 'true') {
                correctCount++;
                selectedOption.parentElement.style.background = '#D1FAE5';
                selectedOption.parentElement.style.borderColor = '#10B981';
            } else {
                selectedOption.parentElement.style.background = '#FEE2E2';
                selectedOption.parentElement.style.borderColor = '#DC2626';
                
                // Mostra a resposta correta
                if (correctOption) {
                    correctOption.parentElement.style.background = '#D1FAE5';
                    correctOption.parentElement.style.borderColor = '#10B981';
                }
            }
        }
    });

    // Mostra resultado
    const resultDiv = document.getElementById('quiz-result');
    if (resultDiv) {
        resultDiv.classList.add('show');
        
        if (correctCount === totalQuestions) {
            resultDiv.classList.remove('incorrect');
            resultDiv.classList.add('correct');
            resultDiv.textContent = `🎉 Perfeito! ${correctCount}/${totalQuestions} corretas!`;
        } else {
            resultDiv.classList.remove('correct');
            resultDiv.classList.add('incorrect');
            resultDiv.textContent = `😅 ${correctCount}/${totalQuestions} corretas. Revise o conteúdo!`;
        }
    }

    // Se acertou tudo, habilita o botão de completar
    if (correctCount === totalQuestions) {
        const btnComplete = document.querySelector('.btn-complete');
        if (btnComplete && !btnComplete.classList.contains('completed')) {
            btnComplete.style.animation = 'pulse 1s infinite';
        }
    }
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(style);

// Inicializa ao carregar
document.addEventListener('DOMContentLoaded', () => {
    checkIfCompleted();
    console.log('Artigo carregado:', getArticleId());
});

