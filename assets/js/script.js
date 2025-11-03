// ============================================
// SISTEMA DE ABAS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initTabLinks();
});

// Inicializa o sistema de abas
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

// Troca de aba
function switchTab(tabId) {
    // Remove active de todos os botões e conteúdos
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Adiciona active no botão e conteúdo selecionados
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);
    
    if (activeButton && activeContent) {
        activeButton.classList.add('active');
        activeContent.classList.add('active');
        
        // Scroll suave para o topo
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Inicializa links que mudam de aba (data-tab-link)
function initTabLinks() {
    const tabLinks = document.querySelectorAll('[data-tab-link]');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab-link');
            switchTab(targetTab);
        });
    });
}

// Função para trocar aba via JavaScript (para uso futuro)
window.changeTab = switchTab;
