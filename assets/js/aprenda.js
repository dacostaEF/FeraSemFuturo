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
    initializeModules();
});

// Inicializar estados dos módulos (primeiro aberto, outros fechados)
function initializeModules() {
    const moduleHeaders = document.querySelectorAll('.module-header');
    
    moduleHeaders.forEach((header, index) => {
        const articles = header.nextElementSibling;
        
        if (index === 0) {
            // Primeiro módulo (Fundamentos) começa aberto
            header.classList.add('open');
            articles.classList.remove('collapsed');
        } else {
            // Outros módulos começam fechados
            header.classList.add('closed');
            if (!articles.classList.contains('collapsed')) {
                articles.classList.add('collapsed');
            }
        }
    });
}

// Toggle (abrir/fechar) módulo
function toggleModule(headerElement) {
    const articles = headerElement.nextElementSibling;
    const isOpen = headerElement.classList.contains('open');
    
    if (isOpen) {
        // Fechar
        headerElement.classList.remove('open');
        headerElement.classList.add('closed');
        articles.classList.add('collapsed');
    } else {
        // Abrir
        headerElement.classList.remove('closed');
        headerElement.classList.add('open');
        articles.classList.remove('collapsed');
    }
}

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
