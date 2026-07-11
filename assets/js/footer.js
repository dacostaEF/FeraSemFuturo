(function () {
    const container = document.getElementById('invlab-footer');
    if (!container) return;

    const inPages = window.location.pathname.includes('/pages/');
    const p = inPages ? '' : 'pages/';
    const r = inPages ? '../' : '';

    // ─── CSS ──────────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        .invlab-footer-desktop { display: block; }
        .invlab-footer-mobile  { display: none;  }
        @media (max-width: 768px) {
            .invlab-footer-desktop { display: none;  }
            .invlab-footer-mobile  { display: block; }
        }

        /* Botão Sobre */
        .invlab-sobre-btn {
            background: none;
            border: none;
            color: #D4AF37;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            padding: 0;
            text-align: left;
            font-family: inherit;
        }
        .invlab-sobre-btn:hover { opacity: 0.8; }

        /* Modal Sobre */
        .invlab-sobre-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            z-index: 99999;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
        }
        .invlab-sobre-overlay.open { display: flex; }
        .invlab-sobre-box {
            background: #0D1620;
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 16px;
            width: 100%;
            max-width: 680px;
            max-height: 88vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 0 40px rgba(0,0,0,0.6);
            animation: sobreFadeIn 0.25s ease;
        }
        @keyframes sobreFadeIn {
            from { opacity:0; transform: scale(0.97); }
            to   { opacity:1; transform: scale(1); }
        }
        .invlab-sobre-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px 18px;
            background: rgba(30,45,45,0.7);
            border-bottom: 1px solid rgba(212,175,55,0.1);
        }
        .invlab-sobre-header h2 {
            margin: 0;
            font-size: 1.3rem;
            color: #fff;
            font-family: 'Playfair Display', Georgia, serif;
            font-weight: 700;
        }
        .invlab-sobre-close {
            background: none;
            border: none;
            color: #D4AF37;
            font-size: 1.6rem;
            cursor: pointer;
            line-height: 1;
            padding: 0 4px;
        }
        .invlab-sobre-body {
            padding: 28px 28px 32px;
            color: rgba(255,255,255,0.85);
            line-height: 1.75;
            font-size: 0.95rem;
            overflow-y: auto;
            flex: 1;
        }
        .invlab-sobre-body::-webkit-scrollbar { width: 6px; }
        .invlab-sobre-body::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
        .invlab-sobre-body::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 3px; }
        .invlab-sobre-body::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.5); }
        .invlab-sobre-body h3 {
            color: #D4AF37;
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin: 24px 0 10px;
        }
        .invlab-sobre-body p { margin: 0 0 12px; }
        .invlab-sobre-body ul {
            list-style: none;
            padding: 0;
            margin: 0 0 12px;
        }
        .invlab-sobre-body ul li { margin-bottom: 6px; }
        .invlab-sobre-divider {
            border: none;
            border-top: 1px solid rgba(255,255,255,0.07);
            margin: 24px 0;
        }
        .invlab-social-icons {
            display: flex;
            gap: 16px;
            margin-top: 14px;
            align-items: center;
        }
        .invlab-social-icons a {
            color: #94A3B8;
            transition: color 0.2s;
            display: flex;
            align-items: center;
        }
        .invlab-social-icons a:hover { color: #D4AF37; }

        @media (max-width: 480px) {
            .invlab-sobre-body { padding: 20px 18px 24px; }
            .invlab-sobre-header { padding: 16px 18px 14px; }
            .invlab-sobre-header h2 { font-size: 1.1rem; }
        }
    `;
    document.head.appendChild(style);

    // ─── FOOTER DESKTOP ───────────────────────────────────────────────────────
    const desktopHTML = `
    <footer class="invlab-footer-desktop" style="background:rgba(13,13,13,0.97);border-top:1px solid rgba(212,175,55,0.2);margin-top:60px;padding:40px 20px 20px;">
        <div class="content-wrapper-wide">
            <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:25px;margin-bottom:30px;">
                <div>
                    <h4 style="color:#D4AF37;margin-bottom:12px;font-size:0.9rem;font-weight:600;">INVLAB</h4>
                    <p style="font-size:0.85rem;line-height:1.6;color:#94A3B8;margin-bottom:14px;">Laboratório de educação financeira. Conteúdos, simuladores e ferramentas para decisões mais conscientes.</p>
                    <button class="invlab-sobre-btn" id="invlabSobreBtn">Sobre o INVLAB →</button>
                </div>
                <div>
                    <h4 style="color:#D4AF37;margin-bottom:12px;font-size:0.9rem;font-weight:600;">Renda Fixa</h4>
                    <ul style="list-style:none;padding:0;font-size:0.85rem;line-height:2;">
                        <li><a href="${p}simulador-cdbs.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🏦 CDBs</a></li>
                        <li><a href="${p}simulador-tesouro-direto.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🇧🇷 Tesouro Direto</a></li>
                        <li><a href="${p}simulador-lci-lca.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🏛️ LCI/LCA</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:#D4AF37;margin-bottom:12px;font-size:0.9rem;font-weight:600;">Renda Variável</h4>
                    <ul style="list-style:none;padding:0;font-size:0.85rem;line-height:2;">
                        <li><a href="${p}acoes.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">📈 Ações</a></li>
                        <li><a href="${p}etfs.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">💵 ETFs</a></li>
                        <li><a href="${p}fiis.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🏢 FIIs</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:#D4AF37;margin-bottom:12px;font-size:0.9rem;font-weight:600;">Economia Digital</h4>
                    <ul style="list-style:none;padding:0;font-size:0.85rem;line-height:2;">
                        <li><a href="${p}cripto.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🌐 Economia Digital</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:#D4AF37;margin-bottom:12px;font-size:0.9rem;font-weight:600;">Instrumentos Avançados</h4>
                    <ul style="list-style:none;padding:0;font-size:0.85rem;line-height:2;">
                        <li><a href="${p}fundos-investimento.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">💼 Fundos de Investimentos</a></li>
                        <li><a href="${p}bdrs.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🌍 BDRs</a></li>
                        <li><a href="${p}fi-infra.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🏗️ FI-Infra</a></li>
                        <li><a href="${p}ouro.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🥇 Ouro</a></li>
                        <li><a href="${p}derivativos.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">⚡ Derivativos</a></li>
                        <li><a href="${p}venture-capital.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🚀 Venture Capital</a></li>
                        <li><a href="${p}private-equity.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🏭 Private Equity</a></li>
                        <li><a href="${p}peer-to-peer.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🤝 P2P Lending</a></li>
                        <li><a href="${p}commodities.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🌍 Commodities</a></li>
                        <li><a href="${p}ativos-reais.html" style="color:rgba(160,120,80,0.90);text-decoration:none;font-weight:600;">🏠 Ativos Reais</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:#D4AF37;margin-bottom:12px;font-size:0.9rem;font-weight:600;">Defesa do Investidor</h4>
                    <ul style="list-style:none;padding:0;font-size:0.85rem;line-height:2;">
                        <li><a href="${p}defesa-investidor.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🛡 Laboratório</a></li>
                        <li><a href="${p}previdencia-sem-armadilhas.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🎯 Previdência</a></li>
                        <li><a href="${p}credito-sem-armadilhas.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🔥 Crédito</a></li>
                        <li><a href="${p}produtos-sem-armadilhas.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🔍 Produtos</a></li>
                        <li><a href="${p}sinais-de-alerta.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🚨 Sinais de alerta</a></li>
                    </ul>
                </div>
            </div>
            <div style="border-top:1px solid rgba(212,175,55,0.1);padding-top:20px;margin-top:20px;">
                <p style="font-size:0.8rem;color:#64748B;text-align:center;line-height:1.6;margin-bottom:8px;">
                    Conteúdo exclusivamente educacional. Os resultados dos simuladores são projeções baseadas em premissas e não garantem rentabilidade futura.
                </p>
                <p style="font-size:0.75rem;color:#475569;text-align:center;">
                    © 2025 INVLAB — Laboratório de Investimentos. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </footer>`;

    // ─── FOOTER MOBILE ────────────────────────────────────────────────────────
    const mobileHTML = `
    <footer class="invlab-footer-mobile" style="background:rgba(13,13,13,0.97);border-top:1px solid rgba(212,175,55,0.2);margin-top:60px;padding:32px 16px 20px;">
        <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(212,175,55,0.15);">
            <button class="invlab-sobre-btn" id="invlabSobreBtnMobile" style="font-size:1rem;font-weight:700;margin-bottom:8px;display:block;width:100%;text-align:center;">Sobre o INVLAB →</button>
            <p style="font-size:0.8rem;line-height:1.6;color:#94A3B8;margin:0;padding:0 8px;">Laboratório de educação financeira para decisões mais conscientes.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:24px;">
            <div>
                <h4 style="color:#D4AF37;margin-bottom:8px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">Renda Fixa</h4>
                <ul style="list-style:none;padding:0;margin:0;font-size:0.72rem;line-height:1.9;">
                    <li><a href="${p}simulador-cdbs.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🏦 CDBs</a></li>
                    <li><a href="${p}simulador-tesouro-direto.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🇧🇷 Tesouro</a></li>
                    <li><a href="${p}simulador-lci-lca.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🏛️ LCI/LCA</a></li>
                </ul>
            </div>
            <div>
                <h4 style="color:#D4AF37;margin-bottom:8px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">Renda Variável</h4>
                <ul style="list-style:none;padding:0;margin:0;font-size:0.72rem;line-height:1.9;">
                    <li><a href="${p}acoes.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">📈 Ações</a></li>
                    <li><a href="${p}etfs.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">💵 ETFs</a></li>
                    <li><a href="${p}fiis.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🏢 FIIs</a></li>
                </ul>
            </div>
            <div>
                <h4 style="color:#D4AF37;margin-bottom:8px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">Econ. Digital</h4>
                <ul style="list-style:none;padding:0;margin:0;font-size:0.72rem;line-height:1.9;">
                    <li><a href="${p}cripto.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🌐 Digital</a></li>
                </ul>
            </div>
            <div>
                <h4 style="color:#D4AF37;margin-bottom:8px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">Avançados</h4>
                <ul style="list-style:none;padding:0;margin:0;font-size:0.72rem;line-height:1.9;">
                    <li><a href="${p}fundos-investimento.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">💼 Fundos</a></li>
                    <li><a href="${p}bdrs.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🌍 BDRs</a></li>
                    <li><a href="${p}ouro.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🥇 Ouro</a></li>
                    <li><a href="${p}derivativos.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">⚡ Deriv.</a></li>
                    <li><a href="${p}commodities.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🌍 Comod.</a></li>
                </ul>
            </div>
            <div>
                <h4 style="color:#D4AF37;margin-bottom:8px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">Defesa</h4>
                <ul style="list-style:none;padding:0;margin:0;font-size:0.72rem;line-height:1.9;">
                    <li><a href="${p}defesa-investidor.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🛡 Lab.</a></li>
                    <li><a href="${p}previdencia-sem-armadilhas.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🎯 Prev.</a></li>
                    <li><a href="${p}credito-sem-armadilhas.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🔥 Créd.</a></li>
                    <li><a href="${p}produtos-sem-armadilhas.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🔍 Prod.</a></li>
                    <li><a href="${p}sinais-de-alerta.html" style="color:rgba(16,185,129,0.85);text-decoration:none;">🚨 Sinais</a></li>
                </ul>
            </div>
        </div>
        <div style="border-top:1px solid rgba(212,175,55,0.1);padding-top:16px;">
            <p style="font-size:0.72rem;color:#64748B;text-align:center;line-height:1.6;margin-bottom:8px;">
                Conteúdo exclusivamente educacional. Projeções não garantem rentabilidade futura.
            </p>
            <p style="font-size:0.68rem;color:#475569;text-align:center;">
                © 2025 INVLAB — Todos os direitos reservados.
            </p>
        </div>
    </footer>`;

    // ─── MODAL SOBRE O INVLAB ─────────────────────────────────────────────────
    const modalHTML = `
    <div class="invlab-sobre-overlay" id="invlabSobreModal">
        <div class="invlab-sobre-box">
            <div class="invlab-sobre-header">
                <h2>🧪 INVLAB</h2>
                <button class="invlab-sobre-close" id="invlabSobreClose">×</button>
            </div>
            <div class="invlab-sobre-body">
                <p>O INVLAB é um laboratório de educação financeira dedicado a transformar conceitos complexos em conhecimento prático.</p>
                <p>Nossa missão é ajudar pessoas a compreender investimentos, patrimônio e planejamento financeiro por meio de conteúdos, simuladores e ferramentas desenvolvidos com metodologia própria.</p>
                <p>Acreditamos que boas decisões financeiras começam pela compreensão, e não pela indicação de um produto.</p>

                <hr class="invlab-sobre-divider">

                <h3>Nossa filosofia</h3>
                <ul>
                    <li>• Educação antes da decisão.</li>
                    <li>• Planejamento antes do investimento.</li>
                    <li>• Transparência nos cálculos.</li>
                    <li>• Autonomia do investidor.</li>
                </ul>

                <h3>O que você encontra aqui</h3>
                <ul>
                    <li>✔ Conteúdos educativos</li>
                    <li>✔ Simuladores</li>
                    <li>✔ Comparadores</li>
                    <li>✔ Ferramentas de planejamento</li>
                    <li>✔ Estudos sobre produtos financeiros</li>
                    <li>✔ Defesa do Investidor</li>
                </ul>

                <hr class="invlab-sobre-divider">

                <h3>Nosso compromisso</h3>
                <p>O INVLAB não realiza recomendações personalizadas de investimento.</p>
                <p>Nosso objetivo é fornecer conhecimento para que cada pessoa tome decisões mais conscientes e alinhadas aos seus objetivos.</p>

                <hr class="invlab-sobre-divider">

                <h3>Contato</h3>
                <p style="margin-bottom:6px;"><a href="mailto:contato@invlab.com.br" style="color:#D4AF37;text-decoration:none;font-weight:600;">📧 contato@invlab.com.br</a></p>
                <p style="font-size:0.88rem;color:rgba(255,255,255,0.6);margin-bottom:0;">Tem dúvidas, sugestões ou deseja conhecer melhor o INVLAB? Entre em contato conosco.</p>

                <hr class="invlab-sobre-divider">

                <h3>Acompanhe o INVLAB</h3>
                <ul style="line-height:2;">
                    <li style="color:rgba(255,255,255,0.45);font-size:0.88rem;">🔗 LinkedIn <span style="font-size:0.78rem;">(em breve)</span></li>
                    <li style="color:rgba(255,255,255,0.45);font-size:0.88rem;">📷 Instagram <span style="font-size:0.78rem;">(em breve)</span></li>
                    <li style="color:rgba(255,255,255,0.45);font-size:0.88rem;">▶️ YouTube <span style="font-size:0.78rem;">(em breve)</span></li>
                    <li style="color:rgba(255,255,255,0.45);font-size:0.88rem;">🎵 TikTok <span style="font-size:0.78rem;">(em breve)</span></li>
                </ul>
            </div>
        </div>
    </div>`;

    container.innerHTML = desktopHTML + mobileHTML + modalHTML;

    // ─── JS DO MODAL ──────────────────────────────────────────────────────────
    function openModal() {
        document.getElementById('invlabSobreModal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        document.getElementById('invlabSobreModal').classList.remove('open');
        document.body.style.overflow = '';
    }

    document.getElementById('invlabSobreBtn').addEventListener('click', openModal);
    document.getElementById('invlabSobreBtnMobile').addEventListener('click', openModal);
    document.getElementById('invlabSobreClose').addEventListener('click', closeModal);
    document.getElementById('invlabSobreModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

})();
