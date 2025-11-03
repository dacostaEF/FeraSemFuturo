// Lista de artigos disponíveis
const articlesConfig = [
    { id: 'artigo-gerente', title: 'Seu gerente ganha comissão' },
    { id: 'artigo-poupanca', title: 'Poupança vs Tesouro Direto' },
    { id: 'artigo-reserva', title: 'Reserva de emergência' }
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    updateArticleStatuses();
});

// Atualizar progresso geral
function updateProgress() {
    const completed = articlesConfig.filter(article => 
        localStorage.getItem(article.id) === 'completed'
    ).length;

    const total = articlesConfig.length;
    const percentage = Math.round((completed / total) * 100);

    // Atualizar UI
    document.querySelector('.progress-percentage').textContent = `${percentage}%`;
    document.querySelector('.progress-fill').style.width = `${percentage}%`;
    document.querySelector('.progress-text').textContent = `${completed} de ${total} artigos completos`;
}

// Atualizar status dos artigos
function updateArticleStatuses() {
    articlesConfig.forEach(article => {
        const isCompleted = localStorage.getItem(article.id) === 'completed';
        
        // Encontrar o elemento do artigo pelo onclick
        const articleElements = document.querySelectorAll('.article-item:not(.coming-soon)');
        
        articleElements.forEach(elem => {
            const onclick = elem.getAttribute('onclick');
            if (onclick && onclick.includes(article.id)) {
                const statusBadge = elem.querySelector('.article-status');
                
                if (isCompleted) {
                    statusBadge.textContent = '✓ Completo';
                    statusBadge.classList.remove('incomplete');
                    statusBadge.classList.add('complete');
                } else {
                    statusBadge.textContent = 'Iniciar';
                    statusBadge.classList.remove('complete');
                    statusBadge.classList.add('incomplete');
                }
            }
        });
    });
}

// Função para marcar artigo como completo (chamada pelos artigos)
function markArticleComplete(articleId) {
    localStorage.setItem(articleId, 'completed');
    updateProgress();
    updateArticleStatuses();
}

// Verificar se o artigo foi completo
function isArticleComplete(articleId) {
    return localStorage.getItem(articleId) === 'completed';
}
