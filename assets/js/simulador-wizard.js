// =====================================================
//  SIMULADOR GUIADO - INVLAB
//  VERSÃO OTIMIZADA (robusta e profissional)
// =====================================================

let wizardData = {
    idadeAtual: null,
    rendaAtual: null,
    patrimonioAtual: null,

    rendaDesejada: null,
    gastosEssenciais: null,
    inssEstimado: null,

    aporteMensal: null,
    aporteTipo: null,
    aporteExtraAnual: null,

    idadeAposentadoria: null,
    perfilInvestidor: null,
    expectativaVida: null
};

// -----------------------------------------------------
// INICIAR
// -----------------------------------------------------
function simuladorWizardStart() {
    document.querySelector('.landing-explicativa').style.display = 'none';
    activateStep(1);
    updateProgress(1);
}

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
            wizardData.gastosEssenciais = getValue("gastosEssenciais");
            wizardData.inssEstimado = getValue("inssEstimado");
            break;

        case 3:
            wizardData.aporteMensal = getValue("aporteMensal");
            wizardData.aporteTipo = getValue("aporteTipo");
            wizardData.aporteExtraAnual = getValue("aporteExtraAnual");
            break;

        case 4:
            wizardData.idadeAposentadoria = getValue("idadeAposentadoria");
            wizardData.perfilInvestidor = getValue("perfilInvestidor");
            wizardData.expectativaVida = getValue("expectativaVida");
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
    // 🎨 DASHBOARD PREMIUM COM RESULTADOS REAIS
    // ===================================================

    const atingiuMeta = resultados.deficitOuSobra >= 0;
    const corStatus = atingiuMeta ? '#10b981' : '#facc15';
    const iconeStatus = atingiuMeta ? '✅' : '⚠️';
    const textoStatus = atingiuMeta 
        ? 'Parabéns! Você atingirá sua meta de aposentadoria!' 
        : 'Atenção: ajustes necessários para atingir sua meta.';

    dash.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto;">
            
            <!-- CABEÇALHO -->
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">📊</div>
                <h2 style="
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #D4AF37;
                    margin-bottom: 10px;
                ">Sua Projeção de Aposentadoria</h2>
                <p style="color: rgba(16, 185, 129, 0.85); font-size: 1.05rem;">
                    Análise completa baseada nos seus dados
                </p>
            </div>

            <!-- STATUS PRINCIPAL -->
            <div style="
                background: rgba(26, 26, 26, 0.9);
                border-left: 6px solid ${corStatus};
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 30px;
                text-align: center;
            ">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">${iconeStatus}</div>
                <h3 style="color: ${corStatus}; font-size: 1.3rem; margin-bottom: 10px;">${textoStatus}</h3>
                <p style="color: #E4E4E4; font-size: 1rem;">
                    ${atingiuMeta 
                        ? `Você terá uma sobra de <strong style="color: #10b981;">R$ ${Math.abs(resultados.deficitOuSobra).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong> por mês.`
                        : `Faltam <strong style="color: #facc15;">R$ ${Math.abs(resultados.deficitOuSobra).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong> por mês para atingir sua meta.`
                    }
                </p>
            </div>

            <!-- GRID DE RESULTADOS -->
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            ">
                
                <!-- PATRIMÔNIO TOTAL -->
                <div style="
                    background: rgba(26, 26, 26, 0.9);
                    border: 1px solid rgba(138, 204, 166, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                ">
                    <div style="color: #10b981; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600;">💰 PATRIMÔNIO PROJETADO</div>
                    <div style="color: #E4E4E4; font-size: 1.8rem; font-weight: 700; margin-bottom: 8px;">
                        R$ ${resultados.patrimonioTotalProjetado.toLocaleString('pt-BR', {maximumFractionDigits: 0})}
                    </div>
                    <div style="color: #9CA3AF; font-size: 0.85rem;">
                        Acumulado em ${resultados.anosAteAposentadoria} anos
                    </div>
                </div>

                <!-- RENDA MENSAL -->
                <div style="
                    background: rgba(26, 26, 26, 0.9);
                    border: 1px solid rgba(138, 204, 166, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                ">
                    <div style="color: #10b981; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600;">📈 RENDA MENSAL PREVISTA</div>
                    <div style="color: #E4E4E4; font-size: 1.8rem; font-weight: 700; margin-bottom: 8px;">
                        R$ ${resultados.rendaTotalPrevista.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <div style="color: #9CA3AF; font-size: 0.85rem;">
                        INSS (R$ ${resultados.inssReal.toLocaleString('pt-BR')}) + Investimentos (R$ ${resultados.rendaRealPossivel.toLocaleString('pt-BR')})
                    </div>
                </div>

                <!-- META -->
                <div style="
                    background: rgba(26, 26, 26, 0.9);
                    border: 1px solid rgba(138, 204, 166, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                ">
                    <div style="color: #10b981; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600;">🎯 SUA META</div>
                    <div style="color: #E4E4E4; font-size: 1.8rem; font-weight: 700; margin-bottom: 8px;">
                        R$ ${resultados.rendaDesejada.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <div style="color: #9CA3AF; font-size: 0.85rem;">
                        Renda mensal desejada
                    </div>
                </div>

            </div>

            <!-- DETALHES ADICIONAIS -->
            <div style="
                background: rgba(26, 26, 26, 0.9);
                border: 1px solid rgba(138, 204, 166, 0.1);
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 30px;
            ">
                <h3 style="color: #D4AF37; font-size: 1.2rem; margin-bottom: 20px; font-family: 'Playfair Display', serif;">📋 Detalhes da Simulação</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; color: #E4E4E4;">
                    <div>
                        <span style="color: #9CA3AF; font-size: 0.85rem;">Anos até aposentadoria:</span><br>
                        <strong>${resultados.anosAteAposentadoria} anos</strong>
                    </div>
                    <div>
                        <span style="color: #9CA3AF; font-size: 0.85rem;">Perfil de investidor:</span><br>
                        <strong style="text-transform: capitalize;">${resultados.perfil}</strong>
                    </div>
                    <div>
                        <span style="color: #9CA3AF; font-size: 0.85rem;">Rentabilidade adotada:</span><br>
                        <strong>${(resultados.taxaAnualEscolhida * 100).toFixed(1)}% ao ano</strong>
                    </div>
                    <div>
                        <span style="color: #9CA3AF; font-size: 0.85rem;">Aporte mensal:</span><br>
                        <strong>R$ ${wizardData.aporteMensal}</strong>
                    </div>
                </div>

                ${!atingiuMeta && resultados.aporteNecessario ? `
                    <div style="
                        margin-top: 20px;
                        padding: 15px;
                        background: rgba(250, 204, 21, 0.1);
                        border-left: 4px solid #facc15;
                        border-radius: 8px;
                    ">
                        <strong style="color: #facc15;">💡 Sugestão:</strong>
                        <p style="margin: 8px 0 0 0; color: #E4E4E4;">
                            Para atingir sua meta, você precisaria investir aproximadamente 
                            <strong style="color: #facc15;">R$ ${resultados.aporteNecessario.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong> 
                            por mês.
                        </p>
                    </div>
                ` : ''}
            </div>

            <!-- ESPAÇO PARA GRÁFICO (FUTURO) -->
            <div style="
                background: rgba(26, 26, 26, 0.9);
                border: 1px solid rgba(138, 204, 166, 0.1);
                border-radius: 12px;
                padding: 24px;
                text-align: center;
            ">
                <h3 style="color: #D4AF37; font-size: 1.2rem; margin-bottom: 15px; font-family: 'Playfair Display', serif;">📈 Projeção de Acumulação</h3>
                <p style="color: #9CA3AF; font-size: 0.95rem;">
                    Gráfico de evolução será exibido aqui (próxima fase)
                </p>
                <div style="
                    margin-top: 15px;
                    padding: 20px;
                    background: rgba(16, 185, 129, 0.05);
                    border-radius: 8px;
                ">
                    <p style="color: #10b981; margin: 0;">
                        ✓ ${resultados.dadosMensais.length} meses de projeção calculados
                    </p>
                </div>
            </div>

        </div>
    `;
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
// EVENTOS
// -----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("btnStartWizard");
    if (startBtn) startBtn.onclick = simuladorWizardStart;

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

});
