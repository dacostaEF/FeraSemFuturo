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
            <p>💼 <strong>INSS:</strong> ${
                resultados.inssReal === 0 
                ? '<span style="color: #9ca3af;">Não considerado nesta simulação</span>'
                : 'R$ ' + resultados.inssReal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '/mês'
            }</p>
            <p>💰 <strong>Investimentos:</strong> R$ ${resultados.rendaRealPossivel.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</p>
            <p>⏱️ <strong>Prazo:</strong> ${resultados.anosAteAposentadoria} anos até aposentadoria</p>
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
                        <strong>R$ ${resultados.aporteNecessario.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</strong>.
                    </p>
                </div>
            </div>
        ` : ''}
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
