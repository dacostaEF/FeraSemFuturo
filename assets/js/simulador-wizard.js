// =====================================================
//  SIMULADOR GUIADO - INVLAB
//  VERSÃO OTIMIZADA (robusta e profissional)
// =====================================================

let wizardData = {
    idadeAtual: null,
    rendaAtual: null, // apenas informativo
    patrimonioAtual: null,

    rendaDesejada: null,
    inssEstimado: null,

    aporteMensal: null,
    aporteExtraAnual: null,

    idadeAposentadoria: null,
    perfilInvestidor: null,
    tipoRenda: null,
    anosPeriodo: null,
    estrategia: null,
    anosDuracao: null
};

// -----------------------------------------------------
// INICIAR
// -----------------------------------------------------
window.simuladorWizardStart = function() {
    console.log("🚀 Função simuladorWizardStart chamada!");
    document.querySelector('.landing-explicativa').style.display = 'none';
    activateStep(1);
    updateProgress(1);
};

// -----------------------------------------------------
// ATIVAR PASSO
// -----------------------------------------------------
function activateStep(stepNumber) {
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    const step = document.getElementById(`step-${stepNumber}`);
    if (step) step.classList.add('active');

    document.getElementById('dashboard').classList.remove('active');

    updateProgress(stepNumber);
}

// -----------------------------------------------------
// CAPTURAR DADOS
// -----------------------------------------------------
function captureStepData(stepNumber) {
    switch (stepNumber) {

        case 1:
            wizardData.idadeAtual = getValue("idadeAtual");
            wizardData.rendaAtual = getValue("rendaAtual");
            wizardData.patrimonioAtual = getValue("patrimonioAtual");
            break;

        case 2:
            wizardData.rendaDesejada = getValue("rendaDesejada");
            wizardData.inssEstimado = getValue("inssEstimado");
            break;

        case 3:
            wizardData.aporteMensal = getValue("aporteMensal");
            wizardData.aporteExtraAnual = getValue("aporteExtraAnual");
            break;

        case 4:
            wizardData.idadeAposentadoria = getValue("idadeAposentadoria");
            wizardData.perfilInvestidor = getValue("perfilInvestidor");
            wizardData.tipoRenda = document.querySelector("input[name='tipoRenda']:checked")?.value || "vitalicia";
            wizardData.anosPeriodo = getValue("anosPeriodo") || null;
            wizardData.estrategia = document.querySelector("input[name='estrategia']:checked")?.value || "perpetua";
            wizardData.anosDuracao = getValue("anosDuracao") || null;
            break;
    }
}

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : null;
}

// -----------------------------------------------------
// VALIDAÇÃO
// -----------------------------------------------------
function validateStep(stepNumber) {

    if (stepNumber === 1) {
        if (!wizardData.idadeAtual || wizardData.idadeAtual < 18 || wizardData.idadeAtual > 90) {
            alert("⚠️ Informe uma idade válida (entre 18 e 90).");
            return false;
        }
        if (!wizardData.rendaAtual || wizardData.rendaAtual <= 0) {
            alert("⚠️ Informe sua renda atual.");
            return false;
        }
    }

    if (stepNumber === 2) {
        if (!wizardData.rendaDesejada || wizardData.rendaDesejada <= 0) {
            alert("⚠️ Informe a renda desejada.");
            return false;
        }
    }

    if (stepNumber === 3) {
        if (!wizardData.aporteMensal || wizardData.aporteMensal <= 0) {
            alert("⚠️ Informe um aporte mensal válido.");
            return false;
        }
    }

    if (stepNumber === 4) {
        if (!wizardData.idadeAposentadoria || wizardData.idadeAposentadoria <= wizardData.idadeAtual) {
            alert("⚠️ A idade de aposentadoria deve ser maior que a idade atual.");
            return false;
        }
    }

    return true;
}

// -----------------------------------------------------
// RENDERIZAR GRÁFICO CHART.JS (INVLAB PREMIUM)
// -----------------------------------------------------
function renderizarGraficoEvolucao(dadosMensais, idadeAtual, idadeAposentadoria) {
    const canvas = document.getElementById('graficoEvolucao');
    if (!canvas) return;

    // Destruir gráfico anterior se existir
    if (window.chartEvolucao) {
        window.chartEvolucao.destroy();
    }

    // Preparar dados (converter meses em anos)
    const labels = [];
    const valores = [];
    const anosAteAposentadoria = idadeAposentadoria - idadeAtual;

    dadosMensais.forEach((item, index) => {
        // A cada 12 meses, adiciona um ponto no gráfico
        if (index % 12 === 0 || index === dadosMensais.length - 1) {
            const ano = Math.floor(index / 12);
            labels.push(`${ano} anos`);
            valores.push(item.saldo);
        }
    });

    // Configuração do gráfico INVLAB Premium
    const ctx = canvas.getContext('2d');
    window.chartEvolucao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Patrimônio Acumulado',
                data: valores,
                borderColor: '#10b981',
                backgroundColor: (context) => {
                    const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
                    return gradient;
                },
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#0D0D0D',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 13, 13, 0.95)',
                    titleColor: '#D4AF37',
                    bodyColor: '#E4E4E4',
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Patrimônio: R$ ' + context.parsed.y.toLocaleString('pt-BR', {maximumFractionDigits: 0});
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(138, 204, 166, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9CA3AF',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(138, 204, 166, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9CA3AF',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                        }
                    }
                }
            }
        }
    });
}

// -----------------------------------------------------
// FINALIZAR
// -----------------------------------------------------
function finalizarWizard() {

    console.log("DADOS FINAIS DO WIZARD:", wizardData);

    // ===================================================
    // 🔥 EXECUTAR MOTOR DE CÁLCULO REAL
    // ===================================================
    const resultados = executarSimulacaoWizard(wizardData);
    console.log("RESULTADOS COMPLETOS DA SIMULAÇÃO:", resultados);

    // Esconder steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    // Ativar dashboard
    const dash = document.getElementById('dashboard');
    dash.classList.add('active');

    // ===================================================
    // 🎨 DASHBOARD INVLAB MASTER
    // ===================================================

    const atingiuMeta = resultados.deficitOuSobra >= 0;
    const corStatus = atingiuMeta ? '#10b981' : '#facc15';
    const iconeStatus = atingiuMeta ? '✅' : '⚠️';
    const textoStatus = atingiuMeta 
        ? 'Parabéns! Você atingirá sua meta de aposentadoria!' 
        : 'Atenção: ajustes necessários para atingir sua meta.';

    dash.innerHTML = `
        <!-- HEADER DE STATUS -->
        <div class="dashboard-header" style="color: ${corStatus};">
            ${iconeStatus} ${textoStatus}
        </div>

        <!-- CARDS PRINCIPAIS -->
        <div class="dashboard-cards">
            
            <div class="card">
                <h3>💰 Patrimônio Projetado</h3>
                <p class="valor" style="color: #10b981;">R$ ${resultados.patrimonioTotalProjetado.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</p>
            </div>

            <div class="card">
                <h3>📈 Renda Mensal Prevista</h3>
                <p class="valor" style="color: #D4AF37;">R$ ${resultados.rendaTotalPrevista.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>

            <div class="card">
                <h3>🎯 Meta Mensal</h3>
                <p class="valor" style="color: #E4E4E4;">R$ ${resultados.rendaDesejada.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>

            <div class="card">
                <h3>📊 Diferença</h3>
                <p class="valor" style="color: ${atingiuMeta ? '#10b981' : '#facc15'};">
                    ${atingiuMeta ? '+' : ''}R$ ${Math.abs(resultados.deficitOuSobra).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
            </div>

        </div>

        <!-- INFO EXTRA -->
        <div class="dashboard-info-extra">
            <p style="margin-bottom: 8px;"><strong>📌 Origem da Renda:</strong></p>
            <ul style="margin-left: 20px; margin-top: 8px;">
                ${resultados.inssReal === 0 
                    ? '<li><strong>100% dos investimentos</strong> (INSS não considerado)</li>'
                    : `<li><strong>INSS:</strong> R$ ${resultados.inssReal.toLocaleString('pt-BR', {minimumFractionDigits: 2})} (${((resultados.inssReal / resultados.rendaTotalPrevista) * 100).toFixed(0)}%)</li>
                       <li><strong>Investimentos:</strong> R$ ${resultados.rendaRealPossivel.toLocaleString('pt-BR', {minimumFractionDigits: 2})} (${((resultados.rendaRealPossivel / resultados.rendaTotalPrevista) * 100).toFixed(0)}%)</li>
                       <li><strong>Total:</strong> R$ ${resultados.rendaTotalPrevista.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</li>`
                }
                <li><strong>Estratégia:</strong> ${
                    resultados.tipoRenda === 'vitalicia' && resultados.estrategia === 'perpetua'
                        ? 'Renda Vitalícia com Capital Preservado'
                        : resultados.tipoRenda === 'periodo'
                            ? `Renda por ${wizardData.anosPeriodo || 30} anos (capital ${resultados.estrategia === 'esgotavel' ? 'consumido gradualmente' : 'preservado'})`
                            : `Renda com uso gradual do capital (${wizardData.anosDuracao || 30} anos)`
                }</li>
            </ul>
            <p style="margin-top: 15px;">⏱️ <strong>Prazo:</strong> ${resultados.anosAteAposentadoria} anos até aposentadoria</p>
            <p>📊 <strong>Perfil:</strong> ${resultados.perfil.charAt(0).toUpperCase() + resultados.perfil.slice(1)} (${(resultados.taxaAnualEscolhida * 100).toFixed(1)}% a.a.)</p>
        </div>

        <!-- GRÁFICO CHART.JS -->
        <div class="dashboard-section" style="padding:30px 20px; background:#0f0f0f; border-radius:10px;">
            <h3 style="color:#D4AF37; margin-bottom:20px; text-align:center;">📈 Evolução do Patrimônio</h3>
            <canvas id="graficoEvolucao" style="max-height: 400px;"></canvas>
        </div>

        ${!atingiuMeta && resultados.aporteNecessario && resultados.aporteNecessario > 0 ? `
            <div id="card-aporte-necessario">
                <div class="card-header">
                    <span class="emoji">💡</span>
                    <span class="titulo">Sugestão para atingir sua meta</span>
                </div>
                <div class="card-body">
                    <p class="aporte-texto">
                        Para atingir sua meta de <strong>R$ ${resultados.rendaDesejada.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</strong>, 
                        você precisaria investir aproximadamente 
                        <strong>R$ ${resultados.aporteNecessario.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês A MAIS</strong> 
                        (totalizando <strong>R$ ${(Number(wizardData.aporteMensal) + resultados.aporteNecessario).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</strong>).
                    </p>
                </div>
            </div>
        ` : ''}

        <!-- INTERPRETAÇÃO AUTOMÁTICA DO RESULTADO -->
        ${gerarInterpretacaoAutomatica(resultados, wizardData)}

        <!-- BOTÕES DE AÇÃO -->
        <div class="dashboard-actions">
            <button class="btn-modal" onclick="abrirModalDados()">📋 Ver dados usados</button>
            <button class="btn-modal" onclick="abrirModalFormulas()">🧠 Ver fórmulas e parâmetros</button>
        </div>

        <!-- MODAL: DADOS DE ENTRADA -->
        <div class="modal-overlay" id="modalDados">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">📋 Dados Usados na Simulação</h3>
                    <button class="modal-close" onclick="fecharModal('modalDados')">×</button>
                </div>
                <div class="modal-body">
                    <p><strong>Idade atual:</strong> ${wizardData.idadeAtual} anos</p>
                    <p><strong>Idade de aposentadoria:</strong> ${wizardData.idadeAposentadoria} anos</p>
                    <p><strong>Patrimônio atual:</strong> R$ ${Number(wizardData.patrimonioAtual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p><strong>Aporte mensal:</strong> R$ ${Number(wizardData.aporteMensal).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p><strong>Aporte extra anual:</strong> R$ ${Number(wizardData.aporteExtraAnual || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p><strong>Perfil investidor:</strong> ${resultados.perfil.charAt(0).toUpperCase() + resultados.perfil.slice(1)} (${(resultados.taxaAnualEscolhida * 100).toFixed(1)}% a.a.)</p>
                    <p><strong>Renda desejada:</strong> R$ ${resultados.rendaDesejada.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</p>
                    <p><strong>Estimativa de INSS:</strong> ${resultados.inssReal === 0 ? 'Não considerado (R$ 0)' : 'R$ ' + resultados.inssReal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + (wizardData.inssEstimado > 0 ? ' (manual)' : ' (automático)')}</p>
                    <p><strong>Estratégia:</strong> ${resultados.tipoRenda === 'vitalicia' ? 'Renda Vitalícia' : 'Renda por Período'} + ${resultados.estrategia === 'perpetua' ? 'Capital Preservado (Perpétua)' : 'Uso Gradual do Capital'}</p>
                    <p><strong>Taxa real usada:</strong> ${((resultados.taxaAnualEscolhida - 0.045) * 100).toFixed(2)}% a.a. (após inflação)</p>
                    <p><strong>Inflação presumida:</strong> 4,5% a.a.</p>
                </div>
            </div>
        </div>

        <!-- MODAL: FÓRMULAS E PARÂMETROS -->
        <div class="modal-overlay" id="modalFormulas">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">🧠 Cálculo Matemático</h3>
                    <button class="modal-close" onclick="fecharModal('modalFormulas')">×</button>
                </div>
                <div class="modal-body">
                    <h4 style="color: #D4AF37; margin-top: 0;">📊 Parâmetros Utilizados</h4>
                    <p><strong>Taxa Nominal Anual:</strong> ${(resultados.taxaAnualEscolhida * 100).toFixed(1)}% a.a.</p>
                    <p><strong>Taxa Equivalente Mensal:</strong> ${((Math.pow(1 + resultados.taxaAnualEscolhida, 1/12) - 1) * 100).toFixed(4)}% a.m.</p>
                    <p><strong>Inflação Presumida:</strong> 4,5% a.a. (IPCA médio histórico)</p>
                    <p><strong>Taxa Real:</strong> ${((resultados.taxaAnualEscolhida - 0.045) * 100).toFixed(2)}% a.a. (${((Math.pow(1 + (resultados.taxaAnualEscolhida - 0.045), 1/12) - 1) * 100).toFixed(4)}% a.m.)</p>
                    
                    <h4 style="color: #D4AF37; margin-top: 20px;">📐 Fórmulas Utilizadas</h4>
                    <p><strong>1️⃣ Acumulação com Juros Compostos:</strong></p>
                    <p style="font-family: monospace; font-size: 0.9em; background: #0f0f0f; padding: 10px; border-radius: 6px;">
                        FV = PV × (1 + i)^n + PMT × [(1 + i)^n - 1] / i
                    </p>
                    
                    <p><strong>2️⃣ Renda Vitalícia Perpétua:</strong></p>
                    <p style="font-family: monospace; font-size: 0.9em; background: #0f0f0f; padding: 10px; border-radius: 6px;">
                        Renda = Patrimônio × Taxa Real Mensal<br>
                        (Preserva o capital para herança)
                    </p>
                    
                    <p><strong>3️⃣ Renda por Período (PMT):</strong></p>
                    <p style="font-family: monospace; font-size: 0.9em; background: #0f0f0f; padding: 10px; border-radius: 6px;">
                        R = (P × i) / [1 - (1 + i)^-n]<br>
                        (Consome capital gradualmente)
                    </p>
                    
                    <p style="margin-top: 15px; font-size: 0.9em; color: #9ca3af;">
                        <strong>Onde:</strong> PV = Valor Presente, FV = Valor Futuro, PMT = Pagamento, i = Taxa, n = Períodos
                    </p>
                </div>
            </div>
        </div>
    `;

    // ===================================================
    // 📈 RENDERIZAR GRÁFICO APÓS CRIAR DASHBOARD
    // ===================================================
    setTimeout(() => {
        renderizarGraficoEvolucao(
            resultados.dadosMensais,
            wizardData.idadeAtual,
            wizardData.idadeAposentadoria
        );
    }, 100);
}

// -----------------------------------------------------
// INTERPRETAÇÃO AUTOMÁTICA DO RESULTADO
// -----------------------------------------------------
function gerarInterpretacaoAutomatica(resultados, wizardData) {
    const percentualAtingido = (resultados.rendaTotalPrevista / resultados.rendaDesejada) * 100;
    let html = '';
    let statusClass = '';
    let icone = '';
    let titulo = '';
    let conteudo = '';

    if (percentualAtingido >= 100) {
        // 🟢 META ATINGIDA
        statusClass = 'status-success';
        icone = '🎉';
        titulo = 'Parabéns! Sua meta foi atingida.';
        conteudo = `
            <p>Você terá uma aposentadoria confortável mantendo disciplina nos investimentos.</p>
            <p style="margin-top: 15px;"><strong>Resumo:</strong></p>
            <ul>
                <li><strong>Renda desejada:</strong> R$ ${resultados.rendaDesejada.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</li>
                <li><strong>Renda projetada:</strong> R$ ${resultados.rendaTotalPrevista.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</li>
                <li><strong>Excedente:</strong> R$ ${Math.abs(resultados.deficitOuSobra).toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</li>
            </ul>
            <p style="margin-top: 15px;"><strong>💡 Sugestões opcionais:</strong></p>
            <ul>
                <li>Antecipar aposentadoria em alguns anos</li>
                <li>Aumentar patrimônio para deixar herança maior</li>
                <li>Elevar padrão de vida na aposentadoria</li>
            </ul>
        `;
    } else if (percentualAtingido >= 80) {
        // 🟡 PRÓXIMO DA META
        statusClass = 'status-warning';
        icone = '💡';
        titulo = 'Você está muito perto da sua meta!';
        const faltam = Math.abs(resultados.deficitOuSobra);
        const aporteAdicional = resultados.aporteNecessario || 0;
        conteudo = `
            <p>Faltam apenas <strong>R$ ${faltam.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</strong> para atingir 100% da meta.</p>
            <p style="margin-top: 15px;"><strong>📈 Pontos positivos:</strong></p>
            <ul>
                <li>Patrimônio projetado sólido: <strong>R$ ${resultados.patrimonioTotalProjetado.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</strong></li>
                <li><strong>${percentualAtingido.toFixed(1)}%</strong> da meta já atingidos</li>
                <li>${resultados.estrategia === 'perpetua' ? 'Renda perpétua = patrimônio preservado para herança' : 'Estratégia de consumo gradual do capital'}</li>
            </ul>
            <p style="margin-top: 15px;"><strong>🎯 Como atingir 100%:</strong></p>
            <ul>
                ${aporteAdicional > 0 ? `<li>Aumentar aporte mensal de R$ ${Number(wizardData.aporteMensal).toLocaleString('pt-BR', {minimumFractionDigits: 2})} para R$ ${(Number(wizardData.aporteMensal) + aporteAdicional).toLocaleString('pt-BR', {minimumFractionDigits: 2})} (+R$ ${aporteAdicional.toLocaleString('pt-BR', {minimumFractionDigits: 2})})</li>` : ''}
                <li>Aumentar aporte anual (13º, bônus, etc)</li>
                <li>Postergar aposentadoria em 1-2 anos</li>
            </ul>
        `;
    } else {
        // 🟢 DISTANTE DA META (mensagem acolhedora)
        statusClass = 'status-alert';
        icone = '💡';
        titulo = 'Você está no caminho certo — faltam ajustes simples para alcançar sua meta.';
        const percentualFaltando = 100 - percentualAtingido;
        conteudo = `
            <p>Atualmente você atingiria <strong>${percentualAtingido.toFixed(1)}%</strong> da meta desejada. Isso já é um ótimo começo!</p>
            <p style="margin-top: 15px;"><strong>🛠️ Caminhos possíveis:</strong></p>
            <ul>
                <li><strong>Elevar aporte mensal:</strong> Aumentar valor investido mensalmente</li>
                <li><strong>Incluir aportes anuais:</strong> 13º salário, bônus, restituição IR</li>
                <li><strong>Ajustar idade de aposentadoria:</strong> Trabalhar alguns anos a mais</li>
                <li><strong>Testar diferentes perfis:</strong> Avaliar aumentar exposição a renda variável</li>
            </ul>
            <p style="margin-top: 15px; font-size: 0.95em; color: #10b981;">
                ✔️ <strong>Escolha um caminho acima e teste rapidamente no simulador.</strong>
            </p>
        `;
    }

    html = `
        <div class="interpretation-block ${statusClass}">
            <div class="interpretation-header">
                <span>${icone}</span>
                <span>${titulo}</span>
            </div>
            <div class="interpretation-body">
                ${conteudo}
            </div>
        </div>
    `;

    return html;
}

// -----------------------------------------------------
// FUNÇÕES DOS MODAIS
// -----------------------------------------------------
function abrirModalDados() {
    document.getElementById('modalDados').classList.add('active');
}

function abrirModalFormulas() {
    document.getElementById('modalFormulas').classList.add('active');
}

function fecharModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Fechar modal clicando fora
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// -----------------------------------------------------
// BARRA DE PROGRESSO (UX)
// -----------------------------------------------------
function updateProgress(currentStep) {
    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    let bar = document.getElementById("progressBar");
    if (bar) bar.style.width = progress + "%";
}

// -----------------------------------------------------
// REGRAS DE BLOQUEIO (Renda Vitalícia / Período)
// -----------------------------------------------------
function atualizarRegrasWizard() {
    const rTipo = document.querySelector("input[name='tipoRenda']:checked");
    const rEstrategia = document.querySelector("input[name='estrategia']:checked");
    
    if (!rTipo || !rEstrategia) return;

    const tipo = rTipo.value;
    const est = rEstrategia.value;

    // Mostrar/esconder campos condicionais
    const periodoContainer = document.getElementById("periodoContainer");
    const duracaoContainer = document.getElementById("anosDuracaoContainer");

    if (periodoContainer) {
        periodoContainer.style.display = tipo === "periodo" ? "block" : "none";
    }

    if (duracaoContainer) {
        duracaoContainer.style.display = est === "esgotavel" ? "block" : "none";
    }

    // BLOQUEIO 1: Vitalícia só aceita perpétua
    const radioEsgotavel = document.querySelector("input[value='esgotavel']");
    const radioPerpetua = document.querySelector("input[value='perpetua']");
    
    if (tipo === "vitalicia") {
        if (radioEsgotavel) radioEsgotavel.disabled = true;
        if (est === "esgotavel" && radioPerpetua) {
            radioPerpetua.checked = true;
        }
    } else {
        if (radioEsgotavel) radioEsgotavel.disabled = false;
    }

    // BLOQUEIO 2: Perpétua só aceita vitalícia
    const radioPeriodo = document.querySelector("input[value='periodo']");
    const radioVitalicia = document.querySelector("input[value='vitalicia']");
    
    if (est === "perpetua") {
        if (radioPeriodo) radioPeriodo.disabled = true;
        if (tipo === "periodo" && radioVitalicia) {
            radioVitalicia.checked = true;
        }
    } else {
        if (radioPeriodo) radioPeriodo.disabled = false;
    }
}

// -----------------------------------------------------
// EVENTOS
// -----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ JavaScript do Wizard carregado!");

    const startBtn = document.getElementById("btnStartWizard");
    if (startBtn) {
        console.log("✅ Botão Start encontrado!");
        startBtn.onclick = simuladorWizardStart;
    } else {
        console.error("❌ Botão btnStartWizard NÃO encontrado!");
    }

    const steps = document.querySelectorAll('.wizard-step');

    steps.forEach((step, index) => {

        const prevBtn = step.querySelector('.btn-prev');
        const nextBtn = step.querySelector('.btn-next');

        if (prevBtn) {
            prevBtn.onclick = () => activateStep(index);
        }

        if (nextBtn) {
            nextBtn.onclick = () => {

                captureStepData(index + 1);

                if (!validateStep(index + 1)) return;

                if (index + 1 === 4) {
                    finalizarWizard();
                } else {
                    activateStep(index + 2);
                }
            };
        }

    });

    // Listeners para radio buttons de renda
    const rTipo = document.querySelectorAll("input[name='tipoRenda']");
    const rEstrategia = document.querySelectorAll("input[name='estrategia']");

    rTipo.forEach(r => r.addEventListener("change", atualizarRegrasWizard));
    rEstrategia.forEach(r => r.addEventListener("change", atualizarRegrasWizard));

    // Inicializar regras
    setTimeout(atualizarRegrasWizard, 100);

});
