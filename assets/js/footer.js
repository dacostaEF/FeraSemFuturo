(function () {
    const container = document.getElementById('invlab-footer');
    if (!container) return;

    // Detecta se está na raiz ou dentro de /pages/
    const inPages = window.location.pathname.includes('/pages/');
    const p = inPages ? '' : 'pages/';   // prefixo para links de páginas
    const r = inPages ? '../' : '';       // prefixo para root (assets, index)

    // ─── CSS DESKTOP/MOBILE ────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        .invlab-footer-desktop { display: block; }
        .invlab-footer-mobile  { display: none;  }
        @media (max-width: 768px) {
            .invlab-footer-desktop { display: none;  }
            .invlab-footer-mobile  { display: block; }
        }
    `;
    document.head.appendChild(style);

    // ─── FOOTER DESKTOP (cópia fiel do original) ───────────────────────────
    const desktopHTML = `
    <footer class="invlab-footer-desktop" style="background: rgba(13,13,13,0.97); border-top: 1px solid rgba(212,175,55,0.2); margin-top: 60px; padding: 40px 20px 20px;">
        <div class="content-wrapper-wide">
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 25px; margin-bottom: 30px;">
                <div>
                    <h4 style="color:#D4AF37;margin-bottom:12px;font-size:0.9rem;font-weight:600;">INVLAB</h4>
                    <p style="font-size:0.85rem;line-height:1.6;color:#94A3B8;margin-bottom:12px;">Laboratório educacional de investimentos. Sem venda de produtos, sem comissões, sem viés comercial.</p>
                    <a href="${r}pages/guia_invlab.html" style="color:#D4AF37;font-size:0.85rem;font-weight:600;text-decoration:none;">🧭 Guia do INVLAB →</a>
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
                <p style="font-size:0.8rem;color:#64748B;text-align:center;line-height:1.6;margin-bottom:12px;">
                    ⚠️ Conteúdo 100% educacional e autoral. Não somos corretora, não vendemos produtos, não recebemos comissões. Todo o conteúdo textual e metodológico é de autoria exclusiva do INVLAB e protegido por direitos autorais.
                </p>
                <p style="font-size:0.75rem;color:#475569;text-align:center;">
                    © 2025 INVLAB — Laboratório de Investimentos. Todos os direitos reservados. Reprodução proibida sem autorização expressa.
                </p>
            </div>
        </div>
    </footer>`;

    // ─── FOOTER MOBILE (cópia idêntica — será editado separadamente) ───────
    const mobileHTML = `
    <footer class="invlab-footer-mobile" style="background: rgba(13,13,13,0.97); border-top: 1px solid rgba(212,175,55,0.2); margin-top: 60px; padding: 40px 20px 20px;">
        <div class="content-wrapper-wide">
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 25px; margin-bottom: 30px;">
                <div>
                    <h4 style="color:#D4AF37;margin-bottom:12px;font-size:0.9rem;font-weight:600;">INVLAB</h4>
                    <p style="font-size:0.85rem;line-height:1.6;color:#94A3B8;margin-bottom:12px;">Laboratório educacional de investimentos. Sem venda de produtos, sem comissões, sem viés comercial.</p>
                    <a href="${r}pages/guia_invlab.html" style="color:#D4AF37;font-size:0.85rem;font-weight:600;text-decoration:none;">🧭 Guia do INVLAB →</a>
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
                <p style="font-size:0.8rem;color:#64748B;text-align:center;line-height:1.6;margin-bottom:12px;">
                    ⚠️ Conteúdo 100% educacional e autoral. Não somos corretora, não vendemos produtos, não recebemos comissões. Todo o conteúdo textual e metodológico é de autoria exclusiva do INVLAB e protegido por direitos autorais.
                </p>
                <p style="font-size:0.75rem;color:#475569;text-align:center;">
                    © 2025 INVLAB — Laboratório de Investimentos. Todos os direitos reservados. Reprodução proibida sem autorização expressa.
                </p>
            </div>
        </div>
    </footer>`;

    container.innerHTML = desktopHTML + mobileHTML;
})();
