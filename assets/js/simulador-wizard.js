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
function renderizarGraficoEvolucao(dadosMensais, idadeAtual, idadeAposentadoria, projecaoPosAposentadoria = null, tipoRenda = 'vitalicia', estrategia = 'perpetua') {
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

    // Fase 1: Acumulação até aposentadoria
    dadosMensais.forEach((item, index) => {
        // A cada 12 meses, adiciona um ponto no gráfico
        if (index % 12 === 0 || index === dadosMensais.length - 1) {
            const ano = Math.floor(index / 12);
            labels.push(`${ano} anos`);
            valores.push(item.saldo);
        }
    });

    // Fase 2: Pós-aposentadoria (se houver projeção)
    let valoresPosAposentadoria = [];
    let labelsPosAposentadoria = [];
    if (projecaoPosAposentadoria && projecaoPosAposentadoria.length > 0) {
        const patrimonioFinal = valores[valores.length - 1];
        const anoAposentadoria = anosAteAposentadoria;
        
        projecaoPosAposentadoria.forEach((item, index) => {
            // A cada 12 meses ou pontos importantes
            if (index % 12 === 0 || index === projecaoPosAposentadoria.length - 1) {
                const anosAposAposentadoria = Math.floor(index / 12);
                labelsPosAposentadoria.push(`${anoAposentadoria + anosAposAposentadoria} anos`);
                valoresPosAposentadoria.push(item.saldo);
            }
        });
    }

    // Determinar cor e label baseado na estratégia
    const isVitalicia = tipoRenda === 'vitalicia' && estrategia === 'perpetua';
    const corAcumulacao = '#10b981';  // Verde para acumulação
    const corConsumo = '#e74c3c';     // Vermelho para consumo
    const corVitalicia = '#2ecc71';   // Verde claro para vitalícia preservada

    // Preparar datasets
    const datasets = [{
        label: 'Acumulação até Aposentadoria',
        data: valores,
        borderColor: corAcumulacao,
        backgroundColor: (context) => {
            const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
            return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: corAcumulacao,
        pointBorderColor: '#0D0D0D',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
    }];

    // Adicionar dataset pós-aposentadoria se houver
    if (valoresPosAposentadoria.length > 0) {
        // Combinar labels e valores
        const labelsCompletos = [...labels, ...labelsPosAposentadoria];
        const valoresCompletos = [...valores, ...valoresPosAposentadoria];
        
        datasets[0].data = valoresCompletos;
        
        // Se for período (consumo), adicionar linha de consumo
        if (!isVitalicia) {
            datasets.push({
                label: 'Consumo do Patrimônio (Pós-Aposentadoria)',
                data: new Array(valores.length).fill(null).concat(valoresPosAposentadoria),
                borderColor: corConsumo,
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointBackgroundColor: corConsumo,
                pointBorderColor: '#0D0D0D',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
            });
        } else {
            // Se for vitalícia, linha horizontal preservada
            datasets.push({
                label: 'Patrimônio Preservado (Pós-Aposentadoria)',
                data: new Array(valores.length).fill(null).concat(valoresPosAposentadoria),
                borderColor: corVitalicia,
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0,
                pointBackgroundColor: corVitalicia,
                pointBorderColor: '#0D0D0D',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
            });
        }
    }

    // Configuração do gráfico INVLAB Premium
    const ctx = canvas.getContext('2d');
    window.chartEvolucao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: valoresPosAposentadoria.length > 0 ? [...labels, ...labelsPosAposentadoria] : labels,
            datasets: datasets
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
    const iconeStatus = atingiuMeta ? '✅' : '⚠️';
    const textoStatus = atingiuMeta 
        ? 'Parabéns! Você atingirá sua meta de aposentadoria!' 
        : 'Atenção: ajustes necessários para atingir sua meta.';

    dash.innerHTML = `
        <!-- HEADER DE STATUS -->
        <div class="dashboard-header" style="color: #D4AF37;">
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
                <p style="font-size: 0.85rem; color: #9ca3af; margin-top: 8px;">
                    ${resultados.tipoRenda === 'vitalicia' && resultados.estrategia === 'perpetua'
                        ? '💚 Renda vitalícia (capital preservado)'
                        : resultados.tipoRenda === 'periodo'
                            ? `⏱️ Renda por ${resultados.anosPeriodo || 30} anos (capital consumido)`
                            : '📊 Renda com uso gradual do capital'}
                </p>
            </div>

            <div class="card">
                <h3>🎯 Meta Mensal</h3>
                <p class="valor" style="color: #E4E4E4;">R$ ${resultados.rendaDesejada.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>

            <div class="card">
                <h3>💎 Herança Projetada</h3>
                <p class="valor" style="color: ${resultados.heranca > 0 ? '#10b981' : '#ef4444'};">
                    ${resultados.heranca > 0 
                        ? 'R$ ' + resultados.heranca.toLocaleString('pt-BR', {maximumFractionDigits: 0})
                        : 'R$ 0 (capital consumido)'}
                </p>
                <p style="font-size: 0.85rem; color: #9ca3af; margin-top: 8px;">
                    ${resultados.heranca > 0 
                        ? 'Patrimônio preservado para herança'
                        : 'Capital será consumido ao final do período'}
                </p>
            </div>

        </div>

        <!-- INFO EXTRA -->
        <div class="dashboard-info-extra">
            <p class="dashboard-section-title" style="margin-bottom: 8px;">📌 Origem da Renda:</p>
            <ul style="margin-left: 20px; margin-top: 8px;">
                ${resultados.inssReal === 0 
                    ? '<li><strong>100% dos investimentos</strong> (INSS não considerado)</li>'
                    : `<li><strong>INSS:</strong> R$ ${resultados.inssReal.toLocaleString('pt-BR', {minimumFractionDigits: 2})} (${((resultados.inssReal / resultados.rendaTotalPrevista) * 100).toFixed(0)}%)</li>
                       <li><strong>Investimentos:</strong> R$ ${resultados.rendaRealPossivel.toLocaleString('pt-BR', {minimumFractionDigits: 2})} (${((resultados.rendaRealPossivel / resultados.rendaTotalPrevista) * 100).toFixed(0)}%)</li>
                       <li><strong>Total:</strong> R$ ${resultados.rendaTotalPrevista.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</li>`
                }
                <li><strong>Estratégia:</strong> ${
                    resultados.tipoRenda === 'vitalicia' && resultados.estrategia === 'perpetua'
                        ? '💚 Renda Vitalícia Perpétua (capital preservado indefinidamente)'
                        : resultados.tipoRenda === 'periodo'
                            ? `⏱️ Renda por ${resultados.anosPeriodo || 30} anos (capital consumido gradualmente)`
                            : `📊 Renda com uso gradual do capital (${wizardData.anosDuracao || 30} anos)`
                }</li>
                <li><strong>Herança:</strong> ${
                    resultados.heranca > 0
                        ? `R$ ${resultados.heranca.toLocaleString('pt-BR', {maximumFractionDigits: 0})} (patrimônio preservado)`
                        : 'R$ 0 (capital será consumido)'
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
            <button class="btn-modal" onclick="abrirModalDados()">Ver dados usados</button>
            <button class="btn-modal" onclick="abrirModalFormulas()">Ver fórmulas e parâmetros</button>
        </div>

        <!-- PAINEL DE AJUSTES RÁPIDOS -->
        <div id="painelAjustesRapidos" class="quick-adjust-card">
            <h3 class="titulo-ajustes">🔧 Ajustes Rápidos</h3>
            <p class="subtitulo-ajustes" style="color: #9ca3af; font-size: 0.9rem; text-align: center; margin-bottom: 20px;">
                Ajuste os parâmetros e veja o impacto em tempo real
            </p>
            
            <div class="ajuste-grid">
                <div class="ajuste-item">
                    <label for="ajusteIdadeAtual">Idade<br>atual</label>
                    <input type="number" id="ajusteIdadeAtual" class="ajuste-input" 
                           value="${wizardData.idadeAtual}" 
                           min="18" max="90">
                </div>
                
                <div class="ajuste-item">
                    <label for="ajusteIdadeApos">Idade de aposentadoria</label>
                    <input type="number" id="ajusteIdadeApos" class="ajuste-input" 
                           value="${wizardData.idadeAposentadoria}" 
                           min="${wizardData.idadeAtual + 1}" max="90"
                           data-min-base="${wizardData.idadeAtual}">
                </div>
                
                <div class="ajuste-item">
                    <label for="ajustePatrimonioInicial">Patrimônio inicial (R$)</label>
                    <input type="number" id="ajustePatrimonioInicial" class="ajuste-input" 
                           value="${Number(wizardData.patrimonioAtual || 0)}" 
                           min="0" step="1000">
                </div>
                
                <div class="ajuste-item">
                    <label for="ajusteAporte">Aporte mensal (R$)</label>
                    <input type="number" id="ajusteAporte" class="ajuste-input" 
                           value="${Number(wizardData.aporteMensal)}" 
                           min="0" step="100">
                </div>
                
                <div class="ajuste-item">
                    <label for="ajustePerfil">Perfil de investimento</label>
                    <select id="ajustePerfil" class="ajuste-input ajuste-select">
                        <option value="conservador" ${wizardData.perfilInvestidor === 'conservador' ? 'selected' : ''} data-text-mobile="Conservador">Conservador (6% a.a.)</option>
                        <option value="moderado" ${wizardData.perfilInvestidor === 'moderado' ? 'selected' : ''} data-text-mobile="Moderado">Moderado (8% a.a.)</option>
                        <option value="arrojado" ${wizardData.perfilInvestidor === 'arrojado' ? 'selected' : ''} data-text-mobile="Arrojado">Arrojado (10% a.a.)</option>
                    </select>
                </div>
                
                <div class="ajuste-item">
                    <label for="ajusteRendaDesejada">Renda desejada (R$/mês)</label>
                    <input type="number" id="ajusteRendaDesejada" class="ajuste-input" 
                           value="${Number(wizardData.rendaDesejada)}" 
                           min="0" step="100">
                </div>
            </div>
            
            <div class="ajuste-actions">
                <button id="btnRecalcularWizard" class="btn-simulador-invlab">Recalcular projeção</button>
                <button id="btnResetarAjustes" class="btn-simulador-invlab">Resetar valores originais</button>
            </div>
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
            wizardData.idadeAposentadoria,
            resultados.projecaoPosAposentadoria,  // ✅ NOVO: projeção pós-aposentadoria
            resultados.tipoRenda,  // ✅ NOVO: tipo de renda
            resultados.estrategia  // ✅ NOVO: estratégia
        );
        
        // Verificar se o painel existe antes de configurar
        const painel = document.getElementById('painelAjustesRapidos');
        if (painel) {
            console.log('✅ Painel de ajustes encontrado, configurando...');
            configurarPainelAjustes(resultados);
        } else {
            console.error('❌ Painel de ajustes NÃO encontrado no DOM!');
            console.log('Dashboard innerHTML length:', dash.innerHTML.length);
            console.log('Procurando por "painelAjustesRapidos":', dash.innerHTML.includes('painelAjustesRapidos'));
        }
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
            <p style="color: #E4E4E4;">Você terá uma aposentadoria confortável mantendo disciplina nos investimentos.</p>
            <p style="margin-top: 15px; color: #E4E4E4;">Resumo:</p>
            <ul style="color: #E4E4E4;">
                <li>Renda desejada: <span style="color: #D4AF37;">R$ ${resultados.rendaDesejada.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</span></li>
                <li>Renda projetada: <span style="color: #D4AF37;">R$ ${resultados.rendaTotalPrevista.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</span></li>
                <li>Excedente: <span style="color: #D4AF37;">R$ ${Math.abs(resultados.deficitOuSobra).toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</span></li>
            </ul>
            <p style="margin-top: 15px; color: #E4E4E4;">💡 Sugestões opcionais:</p>
            <ul style="color: #E4E4E4;">
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
            <p style="color: #E4E4E4;">Faltam apenas <span style="color: #D4AF37;">R$ ${faltam.toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</span> para atingir 100% da meta.</p>
            <p style="margin-top: 15px; color: #E4E4E4;">📈 Pontos positivos:</p>
            <ul style="color: #E4E4E4;">
                <li>Patrimônio projetado sólido: <span style="color: #D4AF37;">R$ ${resultados.patrimonioTotalProjetado.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</span></li>
                <li><span style="color: #D4AF37;">${percentualAtingido.toFixed(1)}%</span> da meta já atingidos</li>
                <li>${resultados.estrategia === 'perpetua' ? 'Renda perpétua = patrimônio preservado para herança' : 'Estratégia de consumo gradual do capital'}</li>
            </ul>
            <p style="margin-top: 15px; color: #E4E4E4;">🎯 Como atingir 100%:</p>
            <ul style="color: #E4E4E4;">
                ${aporteAdicional > 0 ? `<li>Aumentar aporte mensal de <span style="color: #D4AF37;">R$ ${Number(wizardData.aporteMensal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span> para <span style="color: #D4AF37;">R$ ${(Number(wizardData.aporteMensal) + aporteAdicional).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span> (<span style="color: #D4AF37;">+R$ ${aporteAdicional.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>)</li>` : ''}
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
            <p style="color: #E4E4E4;">Atualmente você atingiria <span style="color: #D4AF37;">${percentualAtingido.toFixed(1)}%</span> da meta desejada. Isso já é um ótimo começo!</p>
            <p style="margin-top: 15px; color: #E4E4E4;">🛠️ Caminhos possíveis:</p>
            <ul style="color: #E4E4E4;">
                <li>Elevar aporte mensal: Aumentar valor investido mensalmente</li>
                <li>Incluir aportes anuais: 13º salário, bônus, restituição IR</li>
                <li>Ajustar idade de aposentadoria: Trabalhar alguns anos a mais</li>
                <li>Testar diferentes perfis: Avaliar aumentar exposição a renda variável</li>
            </ul>
            <p style="margin-top: 15px; font-size: 0.95em; color: #E4E4E4;">
                ✔️ Escolha um caminho acima e teste rapidamente no simulador.
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
    
    if (!rTipo) {
        console.warn("⚠️ atualizarRegrasWizard: Radio button tipoRenda não encontrado");
        return;
    }
    
    // Se rEstrategia não estiver encontrado, buscar o padrão
    if (!rEstrategia) {
        const estrategiaPadrao = document.querySelector("input[name='estrategia'][value='perpetua']");
        if (estrategiaPadrao) {
            estrategiaPadrao.checked = true;
        }
    }

    const tipo = rTipo.value;
    const est = rEstrategia ? rEstrategia.value : "perpetua";

    // Mostrar/esconder campos condicionais
    const periodoContainer = document.getElementById("periodoContainer");
    const duracaoContainer = document.getElementById("anosDuracaoContainer");

    if (periodoContainer) {
        periodoContainer.style.display = tipo === "periodo" ? "block" : "none";
    }

    if (duracaoContainer) {
        duracaoContainer.style.display = est === "esgotavel" ? "block" : "none";
    }

    // BLOQUEIO 1: Vitalícia só aceita perpétua (preservar capital)
    const radioEsgotavel = document.querySelector("input[value='esgotavel']");
    const radioPerpetua = document.querySelector("input[value='perpetua']");
    
    if (tipo === "vitalicia") {
        // Se escolheu vitalícia, só pode preservar capital (perpétua)
        if (radioEsgotavel) {
            radioEsgotavel.disabled = true;
        }
        if (est === "esgotavel" && radioPerpetua) {
            radioPerpetua.checked = true;
        }
    } else {
        // Se escolheu período, pode escolher qualquer estratégia
        // FORÇAR habilitação da opção "Usar capital gradualmente"
        if (radioEsgotavel) {
            radioEsgotavel.disabled = false;
            radioEsgotavel.removeAttribute('disabled'); // Força remoção
        }
    }
    
    // SEMPRE garantir que "Preservar capital" esteja habilitado
    if (radioPerpetua) {
        radioPerpetua.disabled = false;
        radioPerpetua.removeAttribute('disabled'); // Força remoção
    }

    // BLOQUEIO 2: REMOVIDO - Não bloquear período quando perpétua está selecionado
    // O usuário pode escolher "período determinado" independentemente da estratégia
    const radioPeriodo = document.querySelector("input[value='periodo']");
    const radioVitalicia = document.querySelector("input[value='vitalicia']");
    
    // SEMPRE permitir seleção de ambos os tipos de renda
    // Garantir que nunca fiquem desabilitados
    if (radioPeriodo) {
        radioPeriodo.disabled = false;
        radioPeriodo.removeAttribute('disabled'); // Força remoção
    }
    if (radioVitalicia) {
        radioVitalicia.disabled = false;
        radioVitalicia.removeAttribute('disabled'); // Força remoção
    }
    
    // VERIFICAÇÃO FINAL: Garantir que quando "período" está selecionado, 
    // "esgotavel" esteja SEMPRE habilitado
    if (tipo === "periodo" && radioEsgotavel) {
        radioEsgotavel.disabled = false;
        radioEsgotavel.removeAttribute('disabled');
        console.log("✅ Forçando habilitação de 'Usar capital gradualmente' para período");
    }
    
    // Log detalhado para debug
    console.log(`✅ Regras atualizadas: tipoRenda=${tipo}, estrategia=${est}`);
    console.log(`   - radioEsgotavel disabled: ${radioEsgotavel ? radioEsgotavel.disabled : 'não encontrado'}`);
    console.log(`   - radioPerpetua disabled: ${radioPerpetua ? radioPerpetua.disabled : 'não encontrado'}`);
}

// ================================================================
// CONFIGURAR LISTENERS DE ESTRATÉGIA
// ================================================================
function configurarListenersEstrategia() {
    console.log("🔧 Configurando listeners de estratégia...");
    
    // Remover listeners anteriores se existirem (usando uma flag)
    if (window.listenersEstrategiaConfigurados) {
        console.log("⚠️ Listeners já configurados, pulando...");
        return;
    }
    
    const rEstrategia = document.querySelectorAll("input[name='estrategia']");
    console.log(`🔍 Encontrados ${rEstrategia.length} radio buttons de estratégia`);
    
    if (rEstrategia.length === 0) {
        console.warn("⚠️ Nenhum radio button de estratégia encontrado! Tentando novamente em 500ms...");
        setTimeout(configurarListenersEstrategia, 500);
        return;
    }
    
    rEstrategia.forEach((r, index) => {
        // Listener no input radio - usar once: false para permitir múltiplas tentativas
        r.addEventListener("click", function(e) {
            console.log(`🖱️ Clicou em estratégia [${index}]: ${this.value}`);
            // Verificar se está tentando selecionar "esgotavel" com "vitalicia" ativo
            const tipoRendaAtual = document.querySelector("input[name='tipoRenda']:checked");
            console.log(`   Tipo de renda atual: ${tipoRendaAtual ? tipoRendaAtual.value : 'não encontrado'}`);
            
            if (this.value === "esgotavel" && tipoRendaAtual && tipoRendaAtual.value === "vitalicia") {
                console.log("⚠️ BLOQUEANDO: Tentativa de selecionar esgotavel com vitalicia ativo");
                // Prevenir a seleção
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.checked = false;
                
                // Manter "perpetua" selecionado
                const radioPerpetua = document.querySelector("input[value='perpetua']");
                if (radioPerpetua) {
                    radioPerpetua.checked = true;
                }
                
                // Mostrar modal explicativo
                console.log("📢 Chamando mostrarModalVitaliciaEsgotavel()...");
                mostrarModalVitaliciaEsgotavel();
                return false;
            }
        }, { capture: true }); // Usar capture para pegar antes de outros listeners
        
        r.addEventListener("change", function() {
            console.log(`🔄 Estratégia mudou para: ${this.value}`);
            atualizarRegrasWizard();
        });
    });
    
    // Também adicionar listener nos labels (caso o usuário clique no container)
    const labelsEstrategia = document.querySelectorAll("label.option-line");
    console.log(`🔍 Encontrados ${labelsEstrategia.length} labels`);
    
    labelsEstrategia.forEach((label, index) => {
        const radio = label.querySelector("input[name='estrategia']");
        if (radio && radio.value === "esgotavel") {
            console.log(`   Configurando listener no label [${index}] para esgotavel`);
            
            label.addEventListener("click", function(e) {
                console.log(`🖱️ Clicou no label [${index}] de esgotavel`);
                // Verificar se está tentando selecionar "esgotavel" com "vitalicia" ativo
                const tipoRendaAtual = document.querySelector("input[name='tipoRenda']:checked");
                
                if (tipoRendaAtual && tipoRendaAtual.value === "vitalicia") {
                    console.log("⚠️ BLOQUEANDO (via label): Tentativa de selecionar esgotavel com vitalicia ativo");
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    // Prevenir que o radio seja marcado
                    const radioEsgotavel = this.querySelector("input[name='estrategia']");
                    if (radioEsgotavel) {
                        radioEsgotavel.checked = false;
                    }
                    
                    // Manter "perpetua" selecionado
                    const radioPerpetua = document.querySelector("input[value='perpetua']");
                    if (radioPerpetua) {
                        radioPerpetua.checked = true;
                    }
                    
                    // Mostrar modal explicativo
                    console.log("📢 Chamando mostrarModalVitaliciaEsgotavel() (via label)...");
                    mostrarModalVitaliciaEsgotavel();
                    return false;
                }
            }, { capture: true });
        }
    });
    
    window.listenersEstrategiaConfigurados = true;
    console.log("✅ Listeners de estratégia configurados!");
}

// ================================================================
// MODAL EXPLICATIVO - Renda Vitalícia vs Usar Capital
// ================================================================
function mostrarModalVitaliciaEsgotavel() {
    console.log("🔍 Função mostrarModalVitaliciaEsgotavel chamada");
    let modal = document.getElementById("modalVitaliciaEsgotavel");
    
    // Se não encontrar, tentar buscar de outras formas
    if (!modal) {
        console.warn("⚠️ Modal não encontrado por ID, tentando buscar por classe...");
        modal = document.querySelector(".modal-overlay#modalVitaliciaEsgotavel");
    }
    
    console.log("🔍 Modal encontrado:", modal ? "SIM" : "NÃO");
    
    if (modal) {
        console.log("✅ Exibindo modal...");
        
        // Múltiplas formas de garantir que o modal apareça
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
        modal.classList.add("active");
        modal.setAttribute("style", 
            "display: flex !important; " +
            "position: fixed !important; " +
            "top: 0 !important; " +
            "left: 0 !important; " +
            "width: 100% !important; " +
            "height: 100% !important; " +
            "background: rgba(0, 0, 0, 0.85) !important; " +
            "z-index: 10000 !important; " +
            "justify-content: center !important; " +
            "align-items: center !important; " +
            "padding: 20px !important; " +
            "visibility: visible !important; " +
            "opacity: 1 !important;"
        );
        
        document.body.style.overflow = "hidden"; // Prevenir scroll
        
        console.log("✅ Modal exibido! Verifique na tela.");
    } else {
        console.error("❌ Modal não encontrado! Verifique se o ID está correto no HTML.");
        console.error("   Tentando criar modal dinamicamente...");
        
        // Criar modal dinamicamente se não existir (fallback)
        criarModalDinamico();
    }
}

// Função fallback para criar modal se não existir
function criarModalDinamico() {
    const modalHTML = `
        <div id="modalVitaliciaEsgotavel" class="modal-overlay" style="display: flex !important; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); z-index: 10000; justify-content: center; align-items: center; padding: 20px;">
            <div class="modal-content" style="max-width: 600px; background: #1a1a1a; border: 1px solid rgba(138, 204, 166, 0.3); border-radius: 12px; padding: 30px;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(138, 204, 166, 0.2);">
                    <h3 class="modal-title" style="font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #D4AF37; font-weight: 700;">💡 Por que essas opções não combinam?</h3>
                    <button class="modal-close" onclick="fecharModalVitaliciaEsgotavel()" style="background: none; border: none; color: #9ca3af; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
                </div>
                <div class="modal-body" style="color: #E4E4E4; line-height: 1.8;">
                    <p style="font-size: 1.1rem; color: #E4E4E4; margin-bottom: 15px; line-height: 1.6;">
                        <strong style="color: #10b981;">Renda Vitalícia</strong> significa que você receberá uma renda <strong>fixa e constante</strong> pelo resto da sua vida, sem nunca acabar.
                    </p>
                    <p style="font-size: 1.1rem; color: #E4E4E4; line-height: 1.6; margin-bottom: 20px;">
                        <strong style="color: #10b981;">Usar Capital Gradualmente</strong> significa que você vai <strong>consumir seu patrimônio</strong> ao longo do tempo para ter uma renda maior.
                    </p>
                    <p style="color: #FACC15; margin-top: 20px; line-height: 1.7;">
                        <strong>💡 Solução:</strong> Se você quer Renda Vitalícia, escolha "Preservar Capital". Se quer uma renda maior (mas que vai acabar), escolha "Renda por Período" + "Usar Capital Gradualmente".
                    </p>
                </div>
                <div style="padding: 15px; text-align: right; border-top: 1px solid rgba(138, 204, 166, 0.2); margin-top: 20px;">
                    <button onclick="fecharModalVitaliciaEsgotavel()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">Entendi! 👍</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log("✅ Modal criado dinamicamente!");
}

function fecharModalVitaliciaEsgotavel() {
    const modal = document.getElementById("modalVitaliciaEsgotavel");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Restaurar scroll
    }
}

// Fechar modal ao clicar no backdrop
function configurarModalVitaliciaEsgotavel() {
    const modal = document.getElementById("modalVitaliciaEsgotavel");
    if (modal) {
        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                fecharModalVitaliciaEsgotavel();
            }
        });
    }
}

// Configurar quando DOM estiver pronto
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", configurarModalVitaliciaEsgotavel);
    } else {
        configurarModalVitaliciaEsgotavel();
    }
}

// Tornar funções globais para uso no onclick do HTML
if (typeof window !== "undefined") {
    window.fecharModalVitaliciaEsgotavel = fecharModalVitaliciaEsgotavel;
    window.mostrarModalVitaliciaEsgotavel = mostrarModalVitaliciaEsgotavel;
}

// -----------------------------------------------------
// EVENTOS
// -----------------------------------------------------
// =====================================================
// PAINEL DE AJUSTES RÁPIDOS - VARIÁVEIS E FUNÇÕES
// =====================================================

// Armazenar valores originais da primeira simulação
let valoresOriginais = null;
let resultadosOriginais = null;

// Salvar valores originais quando o dashboard é exibido
function salvarValoresOriginais(resultados) {
    valoresOriginais = {
        idadeAtual: wizardData.idadeAtual,
        idadeAposentadoria: wizardData.idadeAposentadoria,
        patrimonioAtual: wizardData.patrimonioAtual || 0,
        aporteMensal: wizardData.aporteMensal,
        rendaDesejada: wizardData.rendaDesejada,
        perfilInvestidor: wizardData.perfilInvestidor
    };
    resultadosOriginais = JSON.parse(JSON.stringify(resultados)); // Deep copy
}

// Função auxiliar para converter string formatada em número
function converterParaNumero(valor) {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    // Remove pontos (milhares) e substitui vírgula por ponto (decimal)
    const limpo = String(valor).replace(/\./g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
}

// Função para recalcular simulação com ajustes
function recalcularComAjustes() {
    // Ler valores dos inputs
    const inputIdadeAtual = document.getElementById('ajusteIdadeAtual');
    const inputIdadeApos = document.getElementById('ajusteIdadeApos');
    const inputPatrimonioInicial = document.getElementById('ajustePatrimonioInicial');
    const inputAporte = document.getElementById('ajusteAporte');
    const inputPerfil = document.getElementById('ajustePerfil');
    const inputRendaDesejada = document.getElementById('ajusteRendaDesejada');

    const novaIdadeAtual = parseInt(inputIdadeAtual?.value) || 0;
    const novaIdadeApos = parseInt(inputIdadeApos?.value) || 0;
    const novoPatrimonioInicial = converterParaNumero(inputPatrimonioInicial?.value);
    const novoAporte = converterParaNumero(inputAporte?.value);
    const novoPerfil = inputPerfil?.value || 'moderado';
    const novaRendaDesejada = converterParaNumero(inputRendaDesejada?.value);

    // Validações
    if (novaIdadeAtual < 18 || novaIdadeAtual > 90) {
        alert('⚠️ A idade atual deve estar entre 18 e 90 anos.');
        return;
    }

    if (novaIdadeApos <= novaIdadeAtual) {
        alert(`⚠️ A idade de aposentadoria deve ser maior que a idade atual (${novaIdadeAtual} anos).`);
        return;
    }

    if (novoPatrimonioInicial < 0) {
        alert('⚠️ O patrimônio inicial não pode ser negativo.');
        return;
    }

    if (novoAporte <= 0) {
        alert('⚠️ O aporte mensal deve ser maior que zero.');
        return;
    }

    if (!novoPerfil || !PERFIS_RENTABILIDADE[novoPerfil]) {
        alert('⚠️ Selecione um perfil de investimento válido.');
        return;
    }

    if (novaRendaDesejada <= 0) {
        alert('⚠️ A renda desejada deve ser maior que zero.');
        return;
    }

    // Atualizar wizardData
    wizardData.idadeAtual = novaIdadeAtual;
    wizardData.idadeAposentadoria = novaIdadeApos;
    wizardData.patrimonioAtual = novoPatrimonioInicial;
    wizardData.aporteMensal = novoAporte;
    wizardData.rendaDesejada = novaRendaDesejada;

    // Atualizar perfil de investimento (rentabilidade vem automaticamente do perfil)
    wizardData.perfilInvestidor = novoPerfil;

    // Atualizar min da idade de aposentadoria no input
    if (inputIdadeApos) {
        inputIdadeApos.min = novaIdadeAtual + 1;
    }

    // Recalcular
    const novosResultados = executarSimulacaoWizard(wizardData);

    // Atualizar dashboard completo
    finalizarWizard();

    // Feedback visual
    const btnRecalcular = document.getElementById('btnRecalcularWizard');
    if (btnRecalcular) {
        const textoOriginal = btnRecalcular.innerHTML;
        btnRecalcular.innerHTML = '✅ Recalculado!';
        btnRecalcular.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        setTimeout(() => {
            btnRecalcular.innerHTML = textoOriginal;
            btnRecalcular.style.background = '';
        }, 2000);
    }
}

// Função para resetar valores originais
function resetarValoresOriginais() {
    if (!valoresOriginais) {
        alert('⚠️ Não há valores originais salvos.');
        return;
    }

    // Restaurar wizardData
    wizardData.idadeAtual = valoresOriginais.idadeAtual;
    wizardData.idadeAposentadoria = valoresOriginais.idadeAposentadoria;
    wizardData.patrimonioAtual = valoresOriginais.patrimonioAtual;
    wizardData.aporteMensal = valoresOriginais.aporteMensal;
    wizardData.rendaDesejada = valoresOriginais.rendaDesejada;
    wizardData.perfilInvestidor = valoresOriginais.perfilInvestidor;

    // Restaurar inputs
    const ajusteIdadeAtual = document.getElementById('ajusteIdadeAtual');
    const ajusteIdadeApos = document.getElementById('ajusteIdadeApos');
    const ajustePatrimonioInicial = document.getElementById('ajustePatrimonioInicial');
    const ajusteAporte = document.getElementById('ajusteAporte');
    const ajustePerfil = document.getElementById('ajustePerfil');
    const ajusteRendaDesejada = document.getElementById('ajusteRendaDesejada');

    if (ajusteIdadeAtual) ajusteIdadeAtual.value = valoresOriginais.idadeAtual;
    if (ajusteIdadeApos) {
        ajusteIdadeApos.value = valoresOriginais.idadeAposentadoria;
        ajusteIdadeApos.min = valoresOriginais.idadeAtual + 1;
    }
    if (ajustePatrimonioInicial) ajustePatrimonioInicial.value = Number(valoresOriginais.patrimonioAtual);
    if (ajusteAporte) ajusteAporte.value = Number(valoresOriginais.aporteMensal);
    if (ajustePerfil) ajustePerfil.value = valoresOriginais.perfilInvestidor;
    if (ajusteRendaDesejada) ajusteRendaDesejada.value = Number(valoresOriginais.rendaDesejada);

    // Recalcular com valores originais
    const resultados = executarSimulacaoWizard(wizardData);
    finalizarWizard();
}

// Ajustar texto do select de perfil em mobile (esconder parênteses)
function ajustarSelectPerfilMobile() {
    // Verificar se está em mobile
    const isMobile = window.innerWidth <= 768;
    const selectPerfil = document.getElementById('ajustePerfil');
    
    if (selectPerfil) {
        const options = selectPerfil.querySelectorAll('option');
        options.forEach(option => {
            if (isMobile) {
                // Em mobile, usar apenas o texto do data-text-mobile ou remover parênteses
                const textMobile = option.getAttribute('data-text-mobile');
                if (textMobile) {
                    option.textContent = textMobile;
                } else {
                    // Fallback: remover tudo entre parênteses
                    option.textContent = option.textContent.replace(/\s*\([^)]*\)\s*/, '');
                }
            } else {
                // Em desktop, restaurar texto completo
                const value = option.value;
                if (value === 'conservador') {
                    option.textContent = 'Conservador (6% a.a.)';
                } else if (value === 'moderado') {
                    option.textContent = 'Moderado (8% a.a.)';
                } else if (value === 'arrojado') {
                    option.textContent = 'Arrojado (10% a.a.)';
                }
            }
        });
    }
}

// Ajustar label "Idade atual" em desktop (substituir <br> por espaço)
function ajustarLabelIdadeAtualDesktop() {
    const isDesktop = window.innerWidth > 768;
    const labelIdadeAtual = document.querySelector('#painelAjustesRapidos label[for="ajusteIdadeAtual"]');
    
    if (labelIdadeAtual) {
        if (isDesktop) {
            // Em desktop, substituir <br> por espaço
            const html = labelIdadeAtual.innerHTML;
            if (html.includes('<br>')) {
                labelIdadeAtual.innerHTML = html.replace('<br>', ' ');
            }
        } else {
            // Em mobile, restaurar <br>
            const html = labelIdadeAtual.innerHTML;
            if (html.includes(' atual')) {
                labelIdadeAtual.innerHTML = html.replace(' atual', '<br>atual');
            }
        }
    }
}

// Adicionar event listeners quando o painel for criado
function configurarPainelAjustes(resultados) {
    // Salvar valores originais na primeira vez
    if (!valoresOriginais) {
        salvarValoresOriginais(resultados);
    }

    // Ajustar texto do select de perfil em mobile (esconder parênteses)
    ajustarSelectPerfilMobile();

    // Ajustar label "Idade atual" em desktop (adicionar espaço)
    ajustarLabelIdadeAtualDesktop();

    // Aguardar um pouco para garantir que o DOM foi atualizado
    setTimeout(() => {
        const btnRecalcular = document.getElementById('btnRecalcularWizard');
        const btnResetar = document.getElementById('btnResetarAjustes');

        if (btnRecalcular) {
            btnRecalcular.addEventListener('click', recalcularComAjustes);
        }

        if (btnResetar) {
            btnResetar.addEventListener('click', resetarValoresOriginais);
        }

        // Perfil já define a rentabilidade automaticamente - sem necessidade de sincronização

        // Listener para redimensionamento da janela (ajustar texto do select e label)
        window.addEventListener('resize', function() {
            ajustarSelectPerfilMobile();
            ajustarLabelIdadeAtualDesktop();
        });

        // Atualizar min da idade de aposentadoria quando idade atual mudar
        const ajusteIdadeAtual = document.getElementById('ajusteIdadeAtual');
        const ajusteIdadeApos = document.getElementById('ajusteIdadeApos');
        
        if (ajusteIdadeAtual && ajusteIdadeApos) {
            ajusteIdadeAtual.addEventListener('input', function() {
                const novaIdadeAtual = parseInt(this.value) || 18;
                ajusteIdadeApos.min = novaIdadeAtual + 1;
                if (parseInt(ajusteIdadeApos.value) <= novaIdadeAtual) {
                    ajusteIdadeApos.value = novaIdadeAtual + 1;
                }
            });
        }

        // Adicionar validação em tempo real nos inputs
        const inputs = document.querySelectorAll('.ajuste-input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                // Garantir que valores monetários sejam positivos
                if ((this.id === 'ajusteAporte' || this.id === 'ajusteRendaDesejada' || this.id === 'ajustePatrimonioInicial') && this.value < 0) {
                    this.value = 0;
                }
            });
        });
    }, 100);
}

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ JavaScript do Wizard carregado!");

    const startBtn = document.getElementById("btnStartWizard");
    if (startBtn) {
        console.log("✅ Botão Start encontrado!");
        startBtn.onclick = simuladorWizardStart;
    } else {
        console.error("❌ Botão btnStartWizard NÃO encontrado!");
    }
    
    // Configurar listeners de estratégia após um pequeno delay para garantir que elementos estejam prontos
    // Chamar múltiplas vezes para garantir que funcione
    setTimeout(() => {
        console.log("⏰ Primeira tentativa de configurar listeners (300ms)...");
        configurarListenersEstrategia();
    }, 300);
    
    setTimeout(() => {
        console.log("⏰ Segunda tentativa de configurar listeners (1000ms)...");
        configurarListenersEstrategia();
    }, 1000);

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

    rTipo.forEach(r => {
        r.addEventListener("change", function() {
            console.log(`🔄 Tipo de renda mudou para: ${this.value}`);
            atualizarRegrasWizard();
        });
    });
    
    // Configurar listeners de estratégia
    configurarListenersEstrategia();
    
    // Event delegation no container do passo 4 para garantir que funcione
    // Isso funciona mesmo se os elementos ainda não estiverem prontos
    const step4 = document.getElementById("step-4");
    if (step4) {
        console.log("✅ Step 4 encontrado, adicionando event delegation...");
        step4.addEventListener("click", function(e) {
            // Verificar se o clique foi em um input de estratégia ou seu label
            const target = e.target;
            const radioEsgotavel = target.closest("label")?.querySelector("input[value='esgotavel']") || 
                                   (target.type === "radio" && target.value === "esgotavel" ? target : null);
            
            if (radioEsgotavel) {
                const tipoRendaAtual = document.querySelector("input[name='tipoRenda']:checked");
                
                if (tipoRendaAtual && tipoRendaAtual.value === "vitalicia") {
                    console.log("⚠️ Event delegation: Bloqueando esgotavel com vitalicia");
                    e.preventDefault();
                    e.stopPropagation();
                    
                    radioEsgotavel.checked = false;
                    
                    const radioPerpetua = document.querySelector("input[value='perpetua']");
                    if (radioPerpetua) {
                        radioPerpetua.checked = true;
                    }
                    
                    mostrarModalVitaliciaEsgotavel();
                    return false;
                }
            }
        }, { capture: true });
    } else {
        console.warn("⚠️ Step 4 não encontrado, tentando novamente...");
        setTimeout(() => {
            const step4Retry = document.getElementById("step-4");
            if (step4Retry) {
                step4Retry.addEventListener("click", function(e) {
                    const target = e.target;
                    const radioEsgotavel = target.closest("label")?.querySelector("input[value='esgotavel']") || 
                                           (target.type === "radio" && target.value === "esgotavel" ? target : null);
                    
                    if (radioEsgotavel) {
                        const tipoRendaAtual = document.querySelector("input[name='tipoRenda']:checked");
                        
                        if (tipoRendaAtual && tipoRendaAtual.value === "vitalicia") {
                            e.preventDefault();
                            e.stopPropagation();
                            radioEsgotavel.checked = false;
                            
                            const radioPerpetua = document.querySelector("input[value='perpetua']");
                            if (radioPerpetua) {
                                radioPerpetua.checked = true;
                            }
                            
                            mostrarModalVitaliciaEsgotavel();
                            return false;
                        }
                    }
                }, { capture: true });
            }
        }, 500);
    }

    // Inicializar regras (com delay maior para garantir que elementos estejam prontos)
    setTimeout(() => {
        console.log("🔧 Inicializando regras do wizard...");
        atualizarRegrasWizard();
    }, 200);

});
