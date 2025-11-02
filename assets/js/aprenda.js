// Sistema de progresso local (localStorage)
const PROGRESS_KEY = 'facaseufuturo_progress';

// Estrutura de progresso
const defaultProgress = {
    articles: {
        gerente: false,
        poupanca: false,
        reserva: false
    },
    calculator: false
};

// Carrega progresso do localStorage
function loadProgress() {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : defaultProgress;
}

// Salva progresso no localStorage
function saveProgress(progress) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

// Calcula percentual de conclusão
function calculatePercentage(progress) {
    const total = 4; // 3 artigos + 1 calculadora
    let completed = 0;
    
    if (progress.articles.gerente) completed++;
    if (progress.articles.poupanca) completed++;
    if (progress.articles.reserva) completed++;
    if (progress.calculator) completed++;
    
    return {
        percentage: Math.round((completed / total) * 100),
        completed: completed,
        total: total
    };
}

// Atualiza a UI com o progresso
function updateProgressUI() {
    const progress = loadProgress();
    const stats = calculatePercentage(progress);
    
    // Atualiza barra de progresso
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = stats.percentage + '%';
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = stats.percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${stats.completed} de ${stats.total} completos`;
    }
    
    // Atualiza status dos artigos
    updateArticleStatus('gerente', progress.articles.gerente);
    updateArticleStatus('poupanca', progress.articles.poupanca);
    updateArticleStatus('reserva', progress.articles.reserva);
    updateArticleStatus('calculator', progress.calculator);
}

// Atualiza status individual do artigo
function updateArticleStatus(articleId, completed) {
    // Mapeamento de IDs para índices dos cards
    const cardMapping = {
        'gerente': 0,
        'poupanca': 1,
        'reserva': 2,
        'calculator': 3
    };
    
    const cards = document.querySelectorAll('.article-card');
    const cardIndex = cardMapping[articleId];
    
    if (cards[cardIndex]) {
        const statusElement = cards[cardIndex].querySelector('.article-status');
        if (statusElement && !statusElement.classList.contains('tool')) {
            if (completed) {
                statusElement.textContent = '✓ Completo';
                statusElement.classList.remove('incomplete');
                statusElement.classList.add('complete');
            } else {
                statusElement.textContent = 'Iniciar';
                statusElement.classList.remove('complete');
                statusElement.classList.add('incomplete');
            }
        }
    }
}

// Marca artigo como completo
function markArticleComplete(articleId) {
    const progress = loadProgress();
    
    if (articleId === 'calculator') {
        progress.calculator = true;
    } else if (progress.articles[articleId] !== undefined) {
        progress.articles[articleId] = true;
    }
    
    saveProgress(progress);
    updateProgressUI();
    
    // Mostra mensagem de parabéns
    showCompletionMessage();
}

// Mostra mensagem de conclusão
function showCompletionMessage() {
    const progress = loadProgress();
    const stats = calculatePercentage(progress);
    
    if (stats.percentage === 100) {
        alert('🎉 Parabéns! Você completou o Módulo Bancos!\n\nAgora você já sabe mais que 90% dos brasileiros sobre investimentos seguros!');
    }
}

// Reseta progresso (para testes)
function resetProgress() {
    if (confirm('Tem certeza que deseja resetar seu progresso?')) {
        localStorage.removeItem(PROGRESS_KEY);
        location.reload();
    }
}

// Inicializa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateProgressUI();
    
    // Log para debug
    console.log('Faça Seu Futuro - Módulo Aprendizado carregado!');
    console.log('Progresso atual:', loadProgress());
});

// Exporta funções para uso nas páginas de artigos
window.FacaSeuFuturo = {
    markArticleComplete: markArticleComplete,
    resetProgress: resetProgress,
    getProgress: loadProgress
};

