// ============================================
// SISTEMA DE ABAS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initTabLinks();
    checkURLHash(); // Verifica se há uma aba especificada na URL
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
        
        // Reinicializa os tab links (para botões dentro das abas)
        setTimeout(() => {
            reinitTabLinks();
        }, 100);
        
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

// Reinicializa os tab links após trocar de aba (para botões criados dinamicamente)
function reinitTabLinks() {
    const tabLinks = document.querySelectorAll('[data-tab-link]');
    
    tabLinks.forEach(link => {
        // Remove listener antigo (se houver) e adiciona novo
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab-link');
            switchTab(targetTab);
        });
    });
}

// Verifica hash na URL e abre a aba correspondente
function checkURLHash() {
    const hash = window.location.hash.substring(1); // Remove o '#'
    
    if (hash) {
        const targetTab = document.getElementById(hash);
        if (targetTab) {
            switchTab(hash);
        }
    }
}

// Função para trocar aba via JavaScript (para uso futuro)
window.changeTab = switchTab;

// ============================================
// DEBUG: Verifica se cards são clicáveis
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const allCards = document.querySelectorAll('.learning-card, .tool-card');
    
    console.log('🔍 Total de cards encontrados:', allCards.length);
    
    allCards.forEach((card, index) => {
        const onclick = card.getAttribute('onclick');
        console.log(`📦 Card ${index + 1}: onclick =`, onclick ? 'SIM' : 'NÃO');
        
        // Testa se clique funciona
        card.addEventListener('click', function(e) {
            console.log('🖱️ CLIQUE DETECTADO no card:', this);
            console.log('🎯 Target:', e.target);
            console.log('📍 Onclick:', this.getAttribute('onclick'));
        }, true); // useCapture = true para capturar primeiro
    });
});

// ============================================
// DROPDOWNS NAS ABAS (Clique + Hover)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initTabDropdowns();
});

function initTabDropdowns() {
    const tabDropdowns = document.querySelectorAll('.tab-with-dropdown');
    
    tabDropdowns.forEach(dropdown => {
        const tabBtn = dropdown.querySelector('.tab-btn');
        if (!tabBtn) return;
        
        // Clique no botão abre/fecha
        tabBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = dropdown.classList.contains('open');
            
            // Fecha todos os outros dropdowns
            document.querySelectorAll('.tab-with-dropdown').forEach(d => {
                d.classList.remove('open');
            });
            
            // Alterna o atual
            if (!isOpen) {
                dropdown.classList.add('open');
            }
        });
    });
    
    // Fecha dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tab-with-dropdown')) {
            document.querySelectorAll('.tab-with-dropdown').forEach(d => {
                d.classList.remove('open');
            });
        }
    });
}

// ============================================
// PREVENIR SCROLL INDESEJADO NO MENU
// ============================================

// Previne scroll horizontal quando rodinha do mouse está sobre dropdown aberto
function preventMenuScroll() {
    const navWrapper = document.querySelector('.tabs-nav-wrapper');
    
    if (navWrapper) {
        // Previne scroll horizontal com rodinha do mouse
        navWrapper.addEventListener('wheel', function(e) {
            // Se há dropdown aberto, previne qualquer scroll
            const openDropdown = document.querySelector('.tab-with-dropdown.open');
            
            if (openDropdown) {
                e.preventDefault();
                return false;
            }
            
            // Se não há scroll horizontal necessário, previne
            if (this.scrollWidth <= this.clientWidth) {
                e.preventDefault();
                return false;
            }
        }, { passive: false });
    }
    
    // Previne scroll quando mouse está sobre o dropdown
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.addEventListener('wheel', function(e) {
            e.stopPropagation(); // Não propaga para o wrapper
        }, { passive: true });
    });
}

// Inicializa prevenção de scroll
document.addEventListener('DOMContentLoaded', function() {
    preventMenuScroll();
});

// ============================================
// SUB-DROPDOWNS - REMOVIDO (Agora usa estrutura simples)
// ============================================

// Código removido - Sub-dropdowns laterais não são mais necessários.
// Todos os itens são sempre visíveis em estrutura simples.

// ============================================
// SETA DE SCROLL HORIZONTAL (Menu de Abas)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initScrollArrow();
});

function initScrollArrow() {
    const tabsNavWrapper = document.querySelector('.tabs-nav-wrapper');
    const tabsNav = tabsNavWrapper || document.getElementById('tabsNav');
    const scrollArrowBtn = document.getElementById('scrollArrowBtn');
    
    if (!tabsNav || !scrollArrowBtn) return;
    
    let scrollDirection = 'right'; // 'right' ou 'left'
    
    // Função para rolar o menu quando clicar na seta
    scrollArrowBtn.addEventListener('click', function() {
        const scrollAmount = 300; // Pixels para rolar
        
        if (scrollDirection === 'right') {
            tabsNav.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        } else {
            tabsNav.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Aguarda scroll terminar para atualizar seta
        setTimeout(checkScrollPosition, 400);
    });
    
    // Verificar posição do scroll e atualizar seta
    function checkScrollPosition() {
        const hasScroll = tabsNav.scrollWidth > tabsNav.clientWidth;
        
        if (!hasScroll) {
            // Não há scroll necessário, esconde seta
            scrollArrowBtn.classList.add('hidden');
            return;
        }
        
        const scrollLeft = tabsNav.scrollLeft;
        const maxScroll = tabsNav.scrollWidth - tabsNav.clientWidth;
        const isAtStart = scrollLeft <= 5;
        const isAtEnd = scrollLeft >= maxScroll - 5;
        
        // Sempre mostra a seta (nunca esconde)
        scrollArrowBtn.classList.remove('hidden');
        
        // Determina direção baseado na posição
        if (isAtEnd) {
            // Está no final, seta aponta para ESQUERDA
            scrollDirection = 'left';
            scrollArrowBtn.textContent = '←';
            scrollArrowBtn.classList.add('arrow-left');
            scrollArrowBtn.classList.remove('arrow-right');
        } else {
            // Está no início ou meio, seta aponta para DIREITA
            scrollDirection = 'right';
            scrollArrowBtn.textContent = '→';
            scrollArrowBtn.classList.add('arrow-right');
            scrollArrowBtn.classList.remove('arrow-left');
        }
        
        // Esconde apenas se estiver no início e a direção for esquerda
        if (isAtStart && scrollDirection === 'left') {
            scrollArrowBtn.classList.add('hidden');
        }
    }
    
    // Verifica inicialmente
    checkScrollPosition();
    
    // Verifica ao redimensionar janela
    window.addEventListener('resize', checkScrollPosition);
    
    // Verifica ao rolar o menu (manual)
    tabsNav.addEventListener('scroll', checkScrollPosition);
}