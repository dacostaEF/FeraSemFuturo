// ============================================
// SISTEMA DE ABAS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa tudo de uma vez para melhor performance
    initTabs();
    initTabLinks();
    checkURLHash(); // Verifica se há uma aba especificada na URL
    initTabDropdowns();
    initCollapsibleCategories();
    preventMenuScroll();
    initScrollArrow();
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

// Cards são clicáveis via onclick inline no HTML

// ============================================
// DROPDOWNS NAS ABAS (Clique + Hover)
// ============================================

function initTabDropdowns() {
    const tabDropdowns = document.querySelectorAll('.tab-with-dropdown');
    
    tabDropdowns.forEach(dropdown => {
        const tabBtn = dropdown.querySelector('.tab-btn');
        const arrow = tabBtn ? tabBtn.querySelector('.arrow') : null;
        if (!tabBtn) return;
        
        // Se o botão tem onclick (navega para página), só a SETINHA abre o dropdown
        if (tabBtn.hasAttribute('onclick')) {
            // Clique na SETINHA abre/fecha dropdown
            if (arrow) {
                arrow.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isOpen = dropdown.classList.contains('open');
                    
                    // Fecha todos os outros dropdowns
                    document.querySelectorAll('.tab-with-dropdown').forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('open');
                        }
                    });
                    
                    // Alterna o atual (toggle)
                    if (isOpen) {
                        dropdown.classList.remove('open');
                    } else {
                        dropdown.classList.add('open');
                    }
                });
            }
        } else {
            // Botão SEM onclick: clique em qualquer lugar abre/fecha
            tabBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = dropdown.classList.contains('open');
                
                // Fecha todos os outros dropdowns
                document.querySelectorAll('.tab-with-dropdown').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('open');
                    }
                });
                
                // Alterna o atual (toggle)
                if (isOpen) {
                    dropdown.classList.remove('open');
                } else {
                    dropdown.classList.add('open');
                }
            });
        }
        
        // Fecha dropdown ao clicar em um link dentro dele
        const dropdownLinks = dropdown.querySelectorAll('.dropdown-menu a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                dropdown.classList.remove('open');
            });
        });
    });
    
    // Fecha dropdowns ao clicar FORA de qualquer dropdown
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tab-with-dropdown')) {
            document.querySelectorAll('.tab-with-dropdown').forEach(d => {
                d.classList.remove('open');
            });
        }
    });
}

// ============================================
// MENU COLAPSÁVEL - Renda Variável (FIIs, Ações, ETFs)
// ============================================

function initCollapsibleCategories() {
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.stopPropagation(); // Não fecha o dropdown pai
            
            const category = this.getAttribute('data-category');
            const submenu = document.getElementById(`submenu-${category}`);
            
            if (!submenu) return;
            
            // Toggle da classe 'open'
            const isOpen = this.classList.contains('open');
            
            if (isOpen) {
                // Fechar
                this.classList.remove('open');
                submenu.classList.remove('open');
            } else {
                // Abrir
                this.classList.add('open');
                submenu.classList.add('open');
            }
        });
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

// Prevenção de scroll inicializada no DOMContentLoaded principal

// ============================================
// SUB-DROPDOWNS - REMOVIDO (Agora usa estrutura simples)
// ============================================

// Código removido - Sub-dropdowns laterais não são mais necessários.
// Todos os itens são sempre visíveis em estrutura simples.

// ============================================
// SETA DE SCROLL HORIZONTAL (Menu de Abas)
// ============================================

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