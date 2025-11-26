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

    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    const dash = document.getElementById('dashboard');
    dash.classList.add('active');

    dash.innerHTML = `
        <div class="dashboard-placeholder">📊</div>
        <h2 class="dashboard-title">Resumo da Sua Simulação</h2>
        <p class="dashboard-description">
            <strong>Idade atual:</strong> ${wizardData.idadeAtual}<br>
            <strong>Renda atual:</strong> R$ ${wizardData.rendaAtual}<br>
            <strong>Patrimônio acumulado:</strong> R$ ${wizardData.patrimonioAtual}<br><br>

            <strong>Renda desejada na aposentadoria:</strong> R$ ${wizardData.rendaDesejada}<br>
            <strong>Gastos essenciais:</strong> R$ ${wizardData.gastosEssenciais}<br>
            <strong>Estimativa INSS:</strong> R$ ${wizardData.inssEstimado}<br><br>

            <strong>Aporte mensal:</strong> R$ ${wizardData.aporteMensal}<br>
            <strong>Tipo de aporte:</strong> ${wizardData.aporteTipo}<br>
            <strong>Aporte extra anual:</strong> R$ ${wizardData.aporteExtraAnual}<br><br>

            <strong>Idade para se aposentar:</strong> ${wizardData.idadeAposentadoria}<br>
            <strong>Perfil investidor:</strong> ${wizardData.perfilInvestidor}<br>
            <strong>Expectativa de vida:</strong> ${wizardData.expectativaVida}<br>
        </p>
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
