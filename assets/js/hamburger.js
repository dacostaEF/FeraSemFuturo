(function () {
    /* ─── CSS ─── */
    var style = document.createElement('style');
    style.textContent = [
        '.mobile-menu-btn{display:none;position:fixed;top:60px;left:20px;z-index:2000;',
        'background:rgba(26,26,26,0.95);border:2px solid rgba(212,175,55,0.4);',
        'border-radius:12px;width:50px;height:50px;cursor:pointer;transition:all 0.3s ease;',
        'font-size:1.8rem;color:#D4AF37;}',
        '.mobile-menu-btn:hover{border-color:#D4AF37;box-shadow:0 4px 12px rgba(212,175,55,0.3);transform:scale(1.05);}',
        '.mobile-drawer{position:fixed;top:0;left:-100%;width:280px;height:100vh;',
        'background:rgba(13,13,13,0.98);border-right:2px solid rgba(212,175,55,0.3);',
        'z-index:2001;transition:left 0.4s ease;overflow-y:auto;padding:80px 0 40px 0;backdrop-filter:blur(10px);}',
        '.mobile-drawer.active{left:0;}',
        '.mobile-backdrop{position:fixed;top:0;left:0;width:100%;height:100vh;',
        'background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:1999;',
        'opacity:0;visibility:hidden;transition:all 0.3s ease;}',
        '.mobile-backdrop.active{opacity:1;visibility:visible;}',
        '.mobile-drawer-close{position:absolute;top:20px;right:20px;background:transparent;',
        'border:2px solid rgba(212,175,55,0.3);border-radius:8px;width:40px;height:40px;',
        'color:#D4AF37;font-size:1.5rem;cursor:pointer;transition:all 0.3s ease;}',
        '.mobile-drawer-close:hover{border-color:#D4AF37;background:rgba(212,175,55,0.1);}',
        '.mobile-menu-list{list-style:none;padding:0;margin:0;}',
        '.mobile-menu-list li{border-bottom:1px solid rgba(255,255,255,0.05);}',
        '.mobile-menu-list a{display:block;padding:9px 22px;color:#E4E4E4;text-decoration:none;',
        'font-family:"Inter",sans-serif;font-size:0.85rem;font-weight:500;transition:all 0.3s ease;}',
        '.mobile-menu-list a:hover{background:rgba(212,175,55,0.1);color:#D4AF37;padding-left:32px;}',
        '.mobile-menu-separator{height:1px;background:rgba(212,175,55,0.2);margin:20px 30px;}',
        '@media(max-width:768px){',
        '.mobile-menu-btn{display:flex;align-items:center;justify-content:center;}',
        '}'
    ].join('');
    document.head.appendChild(style);

    /* ─── Paths ─── */
    var inPages = window.location.pathname.replace(/\\/g, '/').indexOf('/pages/') !== -1;
    var r = inPages ? '../' : '';       // prefixo para root/index
    var p = inPages ? '' : 'pages/';   // prefixo para páginas internas

    /* ─── HTML ─── */
    var btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.id = 'mobileMenuBtn';
    btn.setAttribute('aria-label', 'Menu');
    btn.textContent = '☰';

    var backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    backdrop.id = 'mobileBackdrop';

    var drawer = document.createElement('nav');
    drawer.className = 'mobile-drawer';
    drawer.id = 'mobileDrawer';
    /* No root (index.html) usa #hash puro para disparar hashchange sem recarregar.
       Em /pages/ usa ../index.html#hash para forçar navegação completa. */
    var inicio       = inPages ? r + 'index.html'                   : '#inicio';
    var primPassos   = inPages ? r + 'index.html#primeiros-passos'  : '#primeiros-passos';
    var rendaFixa    = inPages ? r + 'index.html#renda-fixa'        : '#renda-fixa';
    var rendaVar     = inPages ? r + 'index.html#renda-variavel'    : '#renda-variavel';
    var sobre        = inPages ? r + 'index.html#sobre'             : '#sobre';
    var avisoLegal   = inPages ? r + 'index.html#aviso-legal'       : '#aviso-legal';

    drawer.innerHTML =
        '<button class="mobile-drawer-close" id="mobileDrawerClose">×</button>' +
        '<ul class="mobile-menu-list">' +
        '<li><a href="' + inicio     + '">🏠 Início</a></li>' +
        '<li><a href="' + primPassos + '">📚 Primeiros Passos</a></li>' +
        '<li><a href="' + rendaFixa  + '">💰 Renda Fixa</a></li>' +
        '<li><a href="' + rendaVar   + '">📈 Renda Variável</a></li>' +
        '<li><a href="' + p + 'cripto.html">🌐 Economia Digital</a></li>' +
        '<li><a href="' + p + 'instrumentos-avancados.html">🧬 Instrumentos Avançados</a></li>' +
        '<li><a href="' + p + 'defesa-investidor.html">🛡 Defesa do Investidor</a></li>' +
        '<div class="mobile-menu-separator"></div>' +
        '<li><a href="' + sobre      + '">ℹ️ Sobre o INVLAB</a></li>' +
        '<li><a href="' + p + 'metodologia.html">🔬 Metodologia</a></li>' +
        '<li><a href="' + avisoLegal + '">⚠️ Aviso Legal</a></li>' +
        '</ul>';

    /* Injeta antes de qualquer outro filho do body */
    var firstChild = document.body.firstChild;
    document.body.insertBefore(drawer, firstChild);
    document.body.insertBefore(backdrop, firstChild);
    document.body.insertBefore(btn, firstChild);

    /* ─── JS ─── */
    function abrirMenuMobile() {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function fecharMenuMobile() {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', abrirMenuMobile);
    backdrop.addEventListener('click', fecharMenuMobile);

    var closeBtn = document.getElementById('mobileDrawerClose');
    if (closeBtn) closeBtn.addEventListener('click', fecharMenuMobile);

    /* Fecha ao clicar em qualquer link do drawer */
    drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', fecharMenuMobile);
    });
})();
