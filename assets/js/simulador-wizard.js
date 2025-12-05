// =====================================================
//  SIMULADOR GUIADO - INVLAB
//  VERSÃO OTIMIZADA (robusta e profissional)
// =====================================================

console.log("🚀 Engine NOVO carregado! ", new Date().toISOString());

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

// Variável global para gráfico de renda mensal
let graficoRendaMensal = null;

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
// FUNÇÃO AUXILIAR: FORMATAR VALORES MONETÁRIOS (TRATAR NaN)
// -----------------------------------------------------
function formatarValorMonetario(valor, minDecimais = 2, maxDecimais = 2) {
    // 1. Trata nulos
    if (valor === null || valor === undefined) {
        return '<span style="color: #ef4444;">–</span>';
    }

    // 2. Se vier como string, limpar e converter
    if (typeof valor === "string") {
        // remove espaços
        valor = valor.trim();

        if (valor === "") {
            return '<span style="color: #ef4444;">–</span>';
        }

        // remove separador de milhar ".", depois troca vírgula por ponto
        // ex: "1.234.567,89" -> "1234567.89"
        valor = valor.replace(/\./g, "").replace(",", ".");
        valor = Number(valor);
    }

    // 3. Validação final
    if (isNaN(valor) || !isFinite(valor)) {
        return '<span style="color: #ef4444;">–</span>';
    }

    // 4. Formatação em pt-BR (mantendo prefixo "R$ " para compatibilidade)
    return `R$ ${valor.toLocaleString("pt-BR", {
        minimumFractionDigits: minDecimais,
        maximumFractionDigits: maxDecimais
    })}`;
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
            
            // INSS: informado, vazio (auto) ou zero (ignorar)
            let inssEstimadoCampo = document.getElementById("inssEstimado")?.value.trim();
            const rendaDesejada = parseFloat(wizardData.rendaDesejada) || 0;
            
            // Regra de ouro:
            // "" → estimar automaticamente (40% da renda desejada)
            // "0" → ignorar completamente
            // número > 0 → usar o valor informado
            let valorINSS = 0;
            
            if (inssEstimadoCampo === "" || inssEstimadoCampo === null) {
                // Estimar automaticamente = 40% da renda desejada
                valorINSS = rendaDesejada * 0.40;
            } else {
                let num = parseFloat(inssEstimadoCampo);
                if (!isNaN(num) && num > 0) {
                    valorINSS = num;
                } else {
                    valorINSS = 0; // usuário digitou 0 → ignorar INSS
                }
            }
            
            wizardData.inssEstimado = valorINSS;
            break;

        case 3:
            wizardData.aporteMensal = getValue("aporteMensal");
            wizardData.aporteExtraAnual = getValue("aporteExtraAnual");
            break;

        case 4:
            wizardData.idadeAposentadoria = getValue("idadeAposentadoria");
            wizardData.perfilInvestidor = getValue("perfilInvestidor");
            wizardData.tipoRenda = document.querySelector("input[name='tipoRenda']:checked")?.value || "vitalicia";
            wizardData.estrategia = document.querySelector("input[name='estrategia']:checked")?.value || "perpetua";
            
            // Captura idade terminal para Período OU Esgotável
            if (wizardData.tipoRenda === "periodo" || wizardData.estrategia === "esgotavel") {
                // ✅ SIMPLIFICAÇÃO: Sempre usar 95 anos como idade final
                wizardData.idadeFinal = 95;
                
                // Calcular anosPeriodo/anosDuracao a partir da idade final (95 anos)
                const idadeFinal = 95;
                if (wizardData.tipoRenda === "periodo") {
                    wizardData.anosPeriodo = idadeFinal - Number(wizardData.idadeAposentadoria);
                } else {
                    wizardData.anosDuracao = idadeFinal - Number(wizardData.idadeAposentadoria);
                }
            } 
            else if (wizardData.tipoRenda === "vitalicia" && wizardData.estrategia === "perpetua") {
                // Para renda vitalícia perpétua, usar 116 anos (padrão do motor)
                // O motor projeta até 116 anos para vitalícia perpétua
                wizardData.idadeFinal = 95;  // ✅ SIMPLIFICAÇÃO: Sempre 95 anos
                wizardData.anosPeriodo = null;
                wizardData.anosDuracao = null;
            } 
            else {
                // Fallback seguro — engine nunca deve receber null
                wizardData.idadeFinal = 95;  // ✅ SIMPLIFICAÇÃO: Sempre 95 anos
                wizardData.anosPeriodo = null;
                wizardData.anosDuracao = null;
            }
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
        // ✅ NOVO: Validar perfil do investidor
        if (!wizardData.perfilInvestidor || !['conservador', 'moderado', 'arrojado'].includes(wizardData.perfilInvestidor)) {
            alert("⚠️ Por favor, selecione um perfil de investidor.");
            return false;
        }
    }

    return true;
}

// -----------------------------------------------------
// RENDERIZAR GRÁFICO CHART.JS (INVLAB PREMIUM)
// -----------------------------------------------------
function renderizarGraficoEvolucao(dadosMensais, idadeAtual, idadeAposentadoria, projecaoPosAposentadoria = null, tipoRenda = 'vitalicia', estrategia = 'perpetua', idadeFinal = 95) {
    const canvas = document.getElementById('graficoEvolucao');
    if (!canvas) return;

    // Destruir gráfico anterior se existir
    if (window.chartEvolucao) {
        window.chartEvolucao.destroy();
    }

    // ✅ FUNÇÃO DE AJUSTE VISUAL: Converte meses desde início em idade real
    // IMPORTANTE: idadeAtual e idadeAposentadoria são VARIÁVEIS DINÂMICAS fornecidas pelo usuário
    // O eixo X começa em idadeAtual (início da formação do patrimônio)
    // O pico de acumulação está em idadeAposentadoria (início do uso do patrimônio)
    const idadeAtualNum = Number(idadeAtual); // Converter para número (evitar concatenação de strings)
    const idadeAposentadoriaNum = Number(idadeAposentadoria);
    
    // Correção OFF-BY-ONE: calcula idade com base em anos completos decorridos
    const ajustarIdade = (mesesDesdeInicio) => {
        const idadeCorreta = idadeAtualNum + (mesesDesdeInicio / 12);
        return Math.floor(idadeCorreta);
    };

    // Preparar dados (converter meses em anos)
    const labels = [];
    const valores = [];
    const anosAteAposentadoria = idadeAposentadoriaNum - idadeAtualNum;

    // Fase 1: Acumulação até aposentadoria
    // Esta fase vai de idadeAtual até idadeAposentadoria
    // ✅ CORREÇÃO: Usar item.mes (que começa em 1) ao invés de index (que começa em 0)
    dadosMensais.forEach((item, index) => {
        // Adicionar primeiro ponto (mês 1) e depois a cada 12 meses, ou último ponto
        if (index === 0 || item.mes % 12 === 0 || index === dadosMensais.length - 1) {
            // ✅ CORREÇÃO: Usar item.mes - 1 porque item.mes começa em 1, não em 0
            const mesesDesdeInicio = item.mes - 1;
            const idadeReal = ajustarIdade(mesesDesdeInicio); // Idade real baseada em idadeAtual
            labels.push(idadeReal.toString());
            valores.push(item.saldo);
        }
    });

    // Fase 2: Pós-aposentadoria (se houver projeção)
    // Esta fase começa em idadeAposentadoria e continua adiante
    // Representa o período de uso/consumo do patrimônio após a aposentadoria
    let valoresPosAposentadoria = [];
    let labelsPosAposentadoria = [];
    
    if (projecaoPosAposentadoria && projecaoPosAposentadoria.length > 0) {
        const mesesAteAposentadoria = anosAteAposentadoria * 12; // Meses desde idadeAtual até idadeAposentadoria
        
        // ✅ CORREÇÃO: projecaoPosAposentadoria tem item.mes começando em 0
        projecaoPosAposentadoria.forEach((item, index) => {
            // A cada 12 meses ou pontos importantes
            // ✅ CORREÇÃO: Usar item.mes diretamente (já começa em 0, então é meses desde início da projeção)
            if (item.mes % 12 === 0 || index === projecaoPosAposentadoria.length - 1) {
                // mesesTotais = meses desde idadeAtual até aposentadoria + meses desde aposentadoria
                const mesesTotais = mesesAteAposentadoria + item.mes;
                const idadeReal = ajustarIdade(mesesTotais); // Idade real baseada em idadeAtual
                labelsPosAposentadoria.push(idadeReal.toString());
                
                // Usar valor exato do motor, sem ajustes artificiais
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
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
            return gradient;
        },
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: corAcumulacao,
        pointBorderColor: '#0D0D0D',
        pointBorderWidth: 1,
        pointRadius: 2,
        pointHoverRadius: 4
    }];

    // Adicionar dataset pós-aposentadoria se houver
    let labelsCompletos = null;
    let valoresCompletos = null;
    
    if (valoresPosAposentadoria.length > 0) {
        // Combinar labels e valores
        labelsCompletos = [...labels, ...labelsPosAposentadoria];
        valoresCompletos = [...valores, ...valoresPosAposentadoria];
        
        datasets[0].data = valoresCompletos;
        
        // ✅ CORREÇÃO: idadeFinal agora vem como parâmetro da função (não mais hardcoded)
        // Converter para número para garantir comparação correta
        const idadeFinalNum = Number(idadeFinal) || 95;
        const idadeAposentadoriaNum = Number(idadeAposentadoria);
        
        // 🔍 DEBUG: Verificar estratégia e dados
        console.log("🔍 DEBUG renderizarGraficoEvolucao:", {
            estrategia: estrategia,
            tipoRenda: tipoRenda,
            idadeFinal: idadeFinalNum,
            idadeAposentadoria: idadeAposentadoriaNum,
            valoresPosAposentadoriaLength: valoresPosAposentadoria.length,
            primeiroValor: valoresPosAposentadoria[0],
            ultimoValor: valoresPosAposentadoria[valoresPosAposentadoria.length - 1],
            todosValores: valoresPosAposentadoria.slice(0, 5).concat("...").concat(valoresPosAposentadoria.slice(-5))
        });
        
        // 🟩 CENÁRIO PRESERVAR 20% — CORRIGIDO
        // ✅ CORREÇÃO CRÍTICA: Detectar corretamente o Caso 2
        // Caso 2 = periodo + perpetua + idadeFinal > idadeAposentadoria (preservar 20%)
        // Caso Vitalícia = periodo + perpetua + sem idadeFinal ou idadeFinal <= idadeAposentadoria (patrimônio constante)
        const isPreservar20 = estrategia === "preservar20" || 
                              (tipoRenda === "periodo" && estrategia === "perpetua" && idadeFinalNum > idadeAposentadoriaNum);
        
        if (isPreservar20) {
            console.log("✅ Estratégia preservar20 detectada! (tipoRenda:", tipoRenda, ", estrategia:", estrategia, ", idadeFinal:", idadeFinalNum, ", idadeAposentadoria:", idadeAposentadoriaNum, ")");
            
            // Calcular patrimônio inicial e piso de 20%
            const patrimonioTotalProjetado = valores.length > 0 ? valores[valores.length - 1] : 0;
            const piso = patrimonioTotalProjetado * 0.20;
            
            // ✅ CORREÇÃO: Garantir que valores não desçam abaixo do piso de 20%
            // Encontrar o primeiro índice onde a curva toca ou passa abaixo do piso
            let indicePiso = -1;
            for (let i = 0; i < valoresPosAposentadoria.length; i++) {
                if (valoresPosAposentadoria[i] !== null && valoresPosAposentadoria[i] <= piso) {
                    indicePiso = i;
                    break;
                }
            }
            
            // Ajustar valores: manter valores originais até tocar o piso, depois manter constante em piso
            const valoresAjustados = valoresPosAposentadoria.map((val, idx) => {
                if (indicePiso >= 0 && idx >= indicePiso) {
                    // A partir do ponto onde tocou o piso, manter constante
                    return piso;
                }
                // Antes de tocar o piso, manter valor original (mas garantir que não fique abaixo)
                if (val !== null && val < piso) {
                    return piso; // Forçar piso mínimo
                }
                return val;
            });
            
            console.log("🔍 DEBUG preservar20:", {
                patrimonioTotalProjetado: patrimonioTotalProjetado,
                piso: piso,
                primeiroValor: valoresPosAposentadoria[0],
                ultimoValor: valoresPosAposentadoria[valoresPosAposentadoria.length - 1],
                indicePiso: indicePiso,
                valoresAbaixoPiso: valoresPosAposentadoria.filter(v => v !== null && v < piso).length,
                totalMeses: valoresPosAposentadoria.length
            });
            
            // ➤ A linha de consumo até atingir o piso de 20%
            datasets.push({
                label: `Consumo até o piso (20% preservado)`,
                data: new Array(valores.length).fill(null).concat(valoresAjustados),
                borderColor: "#F39C12",
                backgroundColor: 'rgba(243, 156, 18, 0.05)',
                borderWidth: 1.8,
                tension: 0.4,
                borderDash: [5, 3],
                fill: false,
                pointBackgroundColor: "#F39C12",
                pointBorderColor: '#0D0D0D',
                pointBorderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4
            });
            
            // =============================
            // LINHA HORIZONTAL – HERANÇA 20%
            // =============================
            // (patrimonioTotalProjetado e piso já calculados acima)
            
            // Encontrar o índice onde começa a aposentadoria (fim da fase de acumulação)
            const idadeAposentadoriaIndex = valores.length;
            
            // Criar array de dados: null até aposentadoria, depois piso até o final
            const labelsCompletos = [...labels, ...labelsPosAposentadoria];
            const dadosLinhaHorizontal = labelsCompletos.map((_, idx) => idx >= idadeAposentadoriaIndex ? piso : null);
            
            datasets.push({
                label: "Herança Preservada (20% do Patrimônio Inicial)",
                data: dadosLinhaHorizontal,
                borderColor: "rgba(173, 255, 47, 0.70)", // verde-limão neon premium
                backgroundColor: "transparent",
                borderWidth: 1.2,
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 0,
                borderDash: [], // linha contínua
                fill: false
            });
        }
        // 🟥 CENÁRIO CONSUMO COMPLETO (esgotável)
        else if (!isVitalicia) {
            datasets.push({
                label: tipoRenda === 'periodo' ? `Até 95 anos (simulação)` : 'Consumo do Patrimônio',
                data: new Array(valores.length).fill(null).concat(valoresPosAposentadoria),
                borderColor: corConsumo,
                backgroundColor: 'rgba(231, 76, 60, 0.05)',
                borderWidth: 1.5,
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointBackgroundColor: corConsumo,
                pointBorderColor: '#0D0D0D',
                pointBorderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4
            });
        } else {
            // Se for vitalícia, linha horizontal preservada
            datasets.push({
                label: 'Patrimônio Preservado',
                data: new Array(valores.length).fill(null).concat(valoresPosAposentadoria),
                borderColor: corVitalicia,
                backgroundColor: 'rgba(46, 204, 113, 0.05)',
                borderWidth: 1.5,
                fill: false,
                tension: 0,
                pointBackgroundColor: corVitalicia,
                pointBorderColor: '#0D0D0D',
                pointBorderWidth: 1,
                pointRadius: 2,
                pointHoverRadius: 4
            });
        }
    }

    // ✅ SIMPLIFICAÇÃO: Curvas extras removidas - sempre usar apenas 95 anos

    // ✅ Labels finais: ajustar para refletir exatamente o tamanho da curva projetada
    // Ajusta o eixo X para refletir exatamente o tamanho da curva projetada
    let labelsFinais;
    if (labelsCompletos && valoresCompletos) {
        labelsFinais = labelsCompletos.slice(0, valoresCompletos.length);
    } else {
        labelsFinais = labels;
    }
    
    // ✅ GARANTIR que o eixo X vá até 116 anos (OBRIGATÓRIO - TODOS OS GRÁFICOS)
    const idadeMaxima = 116;
    const idadeMaximaAtual = labelsFinais.length > 0 ? Math.max(...labelsFinais.map(l => parseInt(l, 10))) : idadeAtualNum;
    
    if (idadeMaximaAtual < idadeMaxima) {
        // Adicionar idades importantes até 116 anos
        const idadesImportantes = [];
        for (let idade = idadeMaximaAtual + 1; idade <= idadeMaxima; idade++) {
            if (idade % 5 === 0 || idade === 95 || idade === 100 || idade === 116) {
                idadesImportantes.push(idade);
            }
        }
        idadesImportantes.forEach(idade => {
            const idadeStr = idade.toString();
            if (!labelsFinais.includes(idadeStr)) {
                labelsFinais.push(idadeStr);
            }
        });
        // Reordenar
        labelsFinais = labelsFinais.map(l => parseInt(l, 10)).sort((a, b) => a - b).map(l => l.toString());
    }
    
    // ✅ IMPORTANTE: NÃO limitar labelsFinais ao tamanho de valoresCompletos
    // O eixo X DEVE ir até 116 anos mesmo que os dados terminem antes
    // Os datasets serão mapeados corretamente com null para idades sem dados
    
    // ✅ MAPEAR datasets para labelsFinais expandidos até 116 anos
    if (labelsCompletos && valoresCompletos && labelsFinais.length > labelsCompletos.length) {
        // Criar mapa idade -> valor para mapeamento eficiente
        const mapaIdadeValor = new Map();
        labelsCompletos.forEach((label, idx) => {
            const idade = parseInt(label, 10);
            mapaIdadeValor.set(idade, valoresCompletos[idx]);
        });
        
        // Mapear dataset principal para labelsFinais expandidos
        datasets[0].data = labelsFinais.map(label => {
            const idade = parseInt(label, 10);
            return mapaIdadeValor.has(idade) ? mapaIdadeValor.get(idade) : null;
        });
    }
    
    // IMPORTANTE: NÃO ajustar datasets com nulls - cada curva deve manter seu tamanho original
    // Isso permite que as curvas parem exatamente onde o motor determinou
    
    // Ajustar linha horizontal da herança 20% se existir
    const linhaHeranca = datasets.find(d => d.label === "Herança Preservada (20% do Patrimônio Inicial)");
    if (linhaHeranca) {
        const idadeAposentadoriaNum = Number(idadeAposentadoria);
        const indiceAposentadoria = labelsFinais.findIndex(l => parseInt(l, 10) >= idadeAposentadoriaNum);
        const piso = linhaHeranca.data.find(v => v !== null) || 0;
        
        // Recalcular linha horizontal para os labels finais
        linhaHeranca.data = labelsFinais.map((_, idx) => idx >= indiceAposentadoria ? piso : null);
    }
    
    // Configuração do gráfico INVLAB Premium
    const ctx = canvas.getContext('2d');
    window.chartEvolucao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsFinais,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',  // Centralizado no topo
                    labels: {
                        color: '#E4E4E4',
                        font: {
                            size: 10,  // Tamanho adequado, não muito grande
                            family: "'Inter', sans-serif"
                        },
                        padding: 8,
                        usePointStyle: true,  // ✅ AJUSTE: Usar estilo de linha em vez de caixa
                        pointStyle: 'line',  // ✅ AJUSTE: Linha na legenda
                        boxWidth: 0,  // ✅ AJUSTE: Remover largura da caixa
                        boxHeight: 0  // ✅ AJUSTE: Remover altura da caixa
                    }
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
                    title: {
                        display: true,
                        text: 'Idade (anos)',
                        color: '#D4AF37',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(138, 204, 166, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9CA3AF',
                        font: {
                            size: 11
                        },
                        maxTicksLimit: 30,
                        autoSkip: true,
                        maxRotation: 0,
                        minRotation: 0,
                        callback: function(value, index) {
                            // Retornar o label diretamente (já é uma idade real)
                            return labelsFinais[index] || '';
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
    try {
        console.log("DADOS FINAIS DO WIZARD:", wizardData);

        // ===================================================
        // 🔥 EXECUTAR MOTOR DE CÁLCULO REAL
        // ===================================================
        const tipoRenda = document.querySelector("input[name='tipoRenda']:checked")?.value;
        if (!tipoRenda) {
            alert("⚠️ Por favor, selecione um tipo de renda.");
            return;
        }
        
        const estrategia = document.querySelector("input[name='estrategia']:checked")?.value || "perpetua";

        // Captura idade terminal para Período OU Esgotável
        // ✅ CORREÇÃO: Nunca enviar null para o engine
        let idadeFinal;
        // ✅ SIMPLIFICAÇÃO: Sempre usar 95 anos como idade final
        idadeFinal = 95;
        
        // ✅ SIMPLIFICAÇÃO: Curvas extras removidas - sempre false
        const mostrarTodas = false;

        // Verificar se executarSimulacaoWizard está disponível
        if (typeof executarSimulacaoWizard !== 'function') {
            console.error("❌ executarSimulacaoWizard não está disponível!");
            alert("⚠️ Erro: Motor de cálculo não está disponível. Por favor, recarregue a página.");
            return;
        }

        // Garante consistência mínima entre wizard → engine
        const dadosParaEngine = {
            idadeAtual: Number(wizardData.idadeAtual),
            idadeAposentadoria: Number(wizardData.idadeAposentadoria),

            // idadeFinal nunca deve ser nula
            idadeFinal: Number(idadeFinal) || (Number(wizardData.idadeAposentadoria) + 30),

            rendaAtual: Number(wizardData.rendaAtual) || 0,
            rendaDesejada: Number(wizardData.rendaDesejada) || 0,
            gastosEssenciais: Number(wizardData.gastosEssenciais) || 0,
            inssEstimado: Number(wizardData.inssEstimado) || 0,
            aporteMensal: Number(wizardData.aporteMensal) || 0,
            aporteExtraAnual: Number(wizardData.aporteExtraAnual) || 0,
            patrimonioAtual: Number(wizardData.patrimonioAtual) || 0,
            perfilInvestidor: wizardData.perfilInvestidor || 'moderado',

            // Estratégia e tipo de renda obrigatórios
            tipoRenda: tipoRenda,
            estrategia: estrategia,
            anosPeriodo: Number(wizardData.anosPeriodo) || 30,
            anosDuracao: Number(wizardData.anosDuracao) || 30,

            mostrarTodasCurvas: Boolean(mostrarTodas)
        };

        // Chamada segura do motor
        const resultados = executarSimulacaoWizard(dadosParaEngine);
        console.log("RESULTADOS COMPLETOS DA SIMULAÇÃO:", resultados);
        
        // ✅ LOG: Debug para verificar curvasExtras geradas
        if (resultados && resultados.curvasExtras) {
            console.log("🟣 DEBUG - curvasExtras geradas:", {
                quantidade: resultados.curvasExtras.length,
                idades: resultados.curvasExtras.map(c => c.idade),
                mostrarTodasCurvas: mostrarTodas,
                tipoRenda: tipoRenda,
                estrategia: estrategia
            });
        } else {
            console.log("🟣 DEBUG - curvasExtras:", {
                existe: !!resultados?.curvasExtras,
                quantidade: resultados?.curvasExtras?.length || 0,
                motivo: !mostrarTodas ? "mostrarTodasCurvas = false" : 
                        tipoRenda !== "periodo" ? "tipoRenda !== periodo" : 
                        "curvasExtras não foi gerado"
            });
        }
        
        if (!resultados) {
            console.error("❌ executarSimulacaoWizard retornou undefined!");
            alert("⚠️ Erro ao calcular simulação. Por favor, verifique os dados e tente novamente.");
            return;
        }

    // Esconder steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    // Ativar dashboard
    const dash = document.getElementById('dashboard');
    
    // ✅ CORREÇÃO: Remover modais existentes antes de recriar (evita IDs duplicados)
    // Isso garante que modais criados dinamicamente fora do dashboard sejam removidos
    const modaisParaRemover = [
        'modalVitaliciaEsgotavel' // Modal criado dinamicamente fora do dashboard
    ];
    modaisParaRemover.forEach(modalId => {
        const modalExistente = document.getElementById(modalId);
        if (modalExistente) {
            modalExistente.remove();
            console.log(`🔄 Modal ${modalId} removido antes de recriar dashboard`);
        }
    });
    
    dash.classList.add('active');

    // ===================================================
    // 🎨 DASHBOARD INVLAB MASTER
    // ===================================================

    // ✅ CORREÇÃO DOSE 6: Proteger contra NaN antes de calcular atingiuMeta
    const deficitOuSobraValido = isNaN(resultados.deficitOuSobra) ? -1 : resultados.deficitOuSobra;
    const atingiuMeta = deficitOuSobraValido >= 0;
    const iconeStatus = atingiuMeta ? '✅' : '⚠️';
    const textoStatus = atingiuMeta 
        ? 'Parabéns! Você atingirá sua meta de aposentadoria!' 
        : 'Atenção: ajustes necessários para atingir sua meta.';

    // =============================================
    // REMOVER CSS DINÂMICO ANTIGO (se existir)
    // =============================================
    const cssAntigo = document.getElementById("wizard-dynamic-style");
    if (cssAntigo) cssAntigo.remove();

    dash.innerHTML = `
        <!-- HEADER DE STATUS -->
        <div class="dashboard-header" style="color: #D4AF37;">
            ${iconeStatus} ${textoStatus}
        </div>

        <!-- CARDS PRINCIPAIS -->
        <div class="dashboard-cards">
            
            <div class="card">
                <h3>💰 Patrimônio Projetado</h3>
                <p class="valor" style="color: #10b981;">${formatarValorMonetario(resultados.patrimonioTotalProjetado, 0)}</p>
            </div>

            <div class="card">
                <h3>
                    📈 Renda Mensal Prevista
                    <span class="info-icon-modal" onclick="abrirModalPremissasRenda()" style="cursor: pointer;" title="Clique para ver premissas técnicas">i</span>
                </h3>
                <p class="valor" style="color: #D4AF37;">${formatarValorMonetario(resultados.rendaTotalPrevista)}</p>
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
                <p class="valor" style="color: #E4E4E4;">${formatarValorMonetario(resultados.rendaDesejada)}</p>
            </div>

            <div class="card">
                <h3>💎 Herança Projetada</h3>
                <p class="valor" style="color: ${resultados.heranca > 0 ? '#10b981' : '#ef4444'};">
                    ${resultados.heranca > 0 
                        ? formatarValorMonetario(resultados.heranca, 0)
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
                    : `<li><strong>Renda do Patrimônio:</strong> ${formatarValorMonetario(resultados.rendaRealPossivel)}/mês</li>
                       <li><strong>Renda do INSS:</strong> ${formatarValorMonetario(resultados.inssReal)}/mês</li>
                       <li><strong>Renda Total:</strong> ${formatarValorMonetario(resultados.rendaTotalPrevista)}/mês</li>`
                }
                <li><strong>Estratégia:</strong> ${
                    resultados.tipoRenda === 'vitalicia' && resultados.estrategia === 'perpetua'
                        ? '💚 Renda Vitalícia Perpétua (capital preservado indefinidamente)'
                        : resultados.tipoRenda === 'periodo' && resultados.estrategia === 'perpetua'
                            ? `⏱️ Renda por Período Determinado (até ${resultados.idadeFinal || 95} anos) - Perpétua (preservar capital)<br>
                               <span style="font-size: 0.85rem; color: #9ca3af;">Sua renda será calculada usando apenas os juros reais. O patrimônio permanece constante ao longo da aposentadoria, e uma herança integral é preservada.</span>`
                        : resultados.tipoRenda === 'periodo' && resultados.estrategia === 'esgotavel'
                            ? `⏱️ Renda por Período Determinado (até ${resultados.idadeFinal || 95} anos) - Esgotável<br>
                               <span style="font-size: 0.85rem; color: #9ca3af;">Sua renda será calculada para consumir todo o patrimônio até a idade selecionada. Se você viver além dessa idade, poderá ficar sem recursos.</span>`
                        : resultados.estrategia === 'esgotavel'
                            ? `📊 Usar Capital Gradualmente (até ${resultados.idadeFinal || 95} anos)<br>
                               <span style="font-size: 0.85rem; color: #9ca3af;">Sua renda será calculada para consumir todo o patrimônio até a idade selecionada. Se você viver além dessa idade, poderá ficar sem recursos.</span>`
                            : `📊 Renda com uso gradual do capital`
                }</li>
                <li><strong>Herança:</strong> ${
                    resultados.heranca > 0
                        ? `${formatarValorMonetario(resultados.heranca, 0)} (patrimônio preservado)`
                        : 'R$ 0 (capital será consumido)'
                }</li>
            </ul>
            <p style="margin-top: 15px;">⏱️ <strong>Prazo:</strong> ${resultados.anosAteAposentadoria} anos até aposentadoria</p>
            <p>📊 <strong>Perfil:</strong> ${resultados.perfil && resultados.perfil.charAt ? resultados.perfil.charAt(0).toUpperCase() + resultados.perfil.slice(1) : 'N/A'} (${resultados.taxaAnualEscolhida ? (resultados.taxaAnualEscolhida * 100).toFixed(1) : 'N/A'}% a.a.)</p>
        </div>

        ${resultados.inssReal > 0 ? `
        <!-- CAIXA DESTACADA: ESTIMATIVA DE INSS -->
        <div style="border: 2px solid #4da6ff; background: rgba(77, 166, 255, 0.1); border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h4 style="color: #4da6ff; margin-top: 0; margin-bottom: 15px; font-size: 1.1rem;">
                📘 Estimativa de INSS
            </h4>
            <p style="color: #E4E4E4; line-height: 1.6; margin-bottom: 10px;">
                Baseada no salário de <strong>R$ ${wizardData.rendaAtual?.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || 'N/A'}</strong> e aposentadoria prevista aos <strong>${wizardData.idadeAposentadoria} anos</strong>:
            </p>
            <p style="color: #4da6ff; font-size: 1.1rem; font-weight: 600; margin: 10px 0;">
                🧮 Benefício estimado: <strong>R$ ${resultados.inssReal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</strong> (em valores reais)
            </p>
            <p style="color: #9ca3af; font-size: 0.85rem; margin-top: 15px; line-height: 1.5; border-top: 1px solid rgba(77, 166, 255, 0.3); padding-top: 15px;">
                💡 <strong>Observação:</strong> Este valor do INSS é uma estimativa baseada nos seus dados. Para um cálculo oficial e detalhado, consulte o portal <a href="https://meu.inss.gov.br" target="_blank" style="color: #4da6ff; text-decoration: underline;">Meu INSS</a>.
            </p>
        </div>
        ` : ''}

        <!-- GRÁFICO CHART.JS -->
        <div class="dashboard-section" style="padding:30px 20px; background:#0f0f0f; border-radius:10px;">
            <h3 style="color:#D4AF37; margin-bottom:10px; text-align:center;">📈 Evolução do Patrimônio</h3>
            <p style="text-align:center; font-size:0.85rem; color:#8AC926; margin-bottom:15px; padding:8px; background:rgba(138, 201, 38, 0.1); border-radius:6px; border-left:3px solid #8AC926;">
                📊 <strong>Simulação até 95 anos de idade</strong> - Todas as projeções são calculadas para durar até 95 anos, uma expectativa de vida realista e segura para planejamento financeiro.
            </p>
            <canvas id="graficoEvolucao" style="max-height: 400px;"></canvas>
            
            <!-- Botão para abrir modal de renda mensal -->
            <div style="text-align:center; margin-top:15px;">
                <button id="btn_rendaMensal" class="btn-simulador-invlab" style="width: auto; display: inline-block;">
                    📊 Ver renda mensal ao longo do tempo
                </button>
            </div>
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

        <!-- BOTÃO FECHAR DASHBOARD -->
        <div style="text-align: center; margin-top: 30px; margin-bottom: 20px; padding: 0 20px;">
            <button id="btnFecharDashboard" class="btn-modal" style="max-width: 300px; width: 100%; margin: 0 auto; display: block;">
                Fechar e Voltar para Ajustes
            </button>
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
                    <p><strong>Perfil investidor:</strong> ${resultados.perfil && resultados.perfil.charAt ? resultados.perfil.charAt(0).toUpperCase() + resultados.perfil.slice(1) : 'N/A'} (${resultados.taxaAnualEscolhida ? (resultados.taxaAnualEscolhida * 100).toFixed(1) : 'N/A'}% a.a.)</p>
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

        <!-- MODAL DE PREMISSAS TÉCNICAS DA RENDA MENSAL -->
        <div id="modalPremissasRenda" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); z-index: 99999; padding-top: 80px; padding-bottom: 40px; overflow-y: auto;">
            <div style="max-width: 800px; margin: 0 auto; background: #0D0D0D; border: 2px solid rgba(212, 175, 55, 0.4); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6); max-height: calc(100vh - 120px); display: flex; flex-direction: column;">
                <!-- Header do Modal (fixo no topo) -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 25px 30px; border-bottom: 1px solid rgba(212, 175, 55, 0.3); flex-shrink: 0;">
                    <h2 style="color: #D4AF37; margin: 0; font-size: 1.5rem;">📘 Como calculamos sua Renda Mensal Prevista</h2>
                    <button onclick="fecharModalPremissasRenda()" style="background: transparent; border: 1px solid rgba(212, 175, 55, 0.4); color: #D4AF37; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(212, 175, 55, 0.2)'; this.style.borderColor='#D4AF37';" onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(212, 175, 55, 0.4)';" title="Fechar">×</button>
                </div>

                <!-- Conteúdo do Modal (com scroll) -->
                <div style="color: #E4E4E4; line-height: 1.8; font-size: 0.95rem; padding: 30px; overflow-y: auto; flex: 1;">
                    <p style="margin-bottom: 20px; color: #E4E4E4;">
                        Sua <strong style="color: #D4AF37;">Renda Mensal Prevista</strong> é uma projeção baseada no modelo <strong style="color: #10b981;">Renda Vitalícia com Capital Preservado</strong>, uma estratégia em que você utiliza somente os rendimentos reais do patrimônio acumulado, mantendo o valor total investido para o resto da vida (e podendo deixar como herança).
                    </p>

                    <h3 style="color: #D4AF37; margin-top: 30px; margin-bottom: 15px; font-size: 1.2rem;">🔧 Como funciona o cálculo?</h3>
                    <p style="margin-bottom: 20px;">Usamos três pilares:</p>

                    <div style="background: rgba(212, 175, 55, 0.05); border-left: 4px solid #D4AF37; padding: 15px; margin: 15px 0; border-radius: 6px;">
                        <h4 style="color: #D4AF37; margin-top: 0; margin-bottom: 10px;">1️⃣ Taxa real de longo prazo (após inflação):</h4>
                        <p style="margin: 0;">
                            Consideramos um retorno real estimado de <strong style="color: #D4AF37;">0,287% ao mês (≈ 3,5% ao ano)</strong>.<br>
                            Essa taxa é compatível com estudos históricos de juros reais no Brasil, incluindo análises do <strong>IBRE/FGV</strong> e comportamento do <strong>CDI/Selic</strong> ao longo de décadas.
                        </p>
                    </div>

                    <div style="background: rgba(16, 185, 129, 0.05); border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 6px;">
                        <h4 style="color: #10b981; margin-top: 0; margin-bottom: 10px;">2️⃣ Seu patrimônio projetado na data de aposentadoria:</h4>
                        <p style="margin: 0;">
                            O simulador atualiza mês a mês seu saldo acumulado considerando:<br>
                            • aportes,<br>
                            • rentabilidade do perfil,<br>
                            • prazo até aposentadoria.
                        </p>
                    </div>

                    <div style="background: rgba(46, 204, 113, 0.05); border-left: 4px solid #2ecc71; padding: 15px; margin: 15px 0; border-radius: 6px;">
                        <h4 style="color: #2ecc71; margin-top: 0; margin-bottom: 10px;">3️⃣ Retirada apenas dos juros reais:</h4>
                        <p style="margin: 0;">
                            O valor mensal calculado corresponde a apenas os rendimentos reais do seu patrimônio, garantindo:<br>
                            • renda vitalícia,<br>
                            • preservação integral do capital,<br>
                            • possibilidade de deixar herança.
                        </p>
                    </div>

                    <div style="background: rgba(77, 166, 255, 0.1); border: 1px solid rgba(77, 166, 255, 0.3); padding: 15px; margin: 25px 0; border-radius: 8px;">
                        <p style="margin: 0; color: #4da6ff;">
                            <strong>💡 Importante:</strong> A renda exibida já está calculada em valores "descontados da inflação", ou seja, ela mantém o poder de compra ao longo do tempo.
                        </p>
                    </div>

                    <!-- Disclaimer -->
                    <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 20px; margin-top: 30px;">
                        <h3 style="color: #ef4444; margin-top: 0; margin-bottom: 15px; font-size: 1.1rem;">🔒 Aviso Importante (Disclaimer)</h3>
                        <p style="margin-bottom: 12px; color: #E4E4E4;">
                            As projeções apresentadas neste simulador têm <strong>caráter educacional e ilustrativo</strong>.
                        </p>
                        <p style="margin-bottom: 12px; color: #E4E4E4;">
                            Os valores futuros dependem de condições de mercado, inflação, juros reais, política econômica e desempenho dos investimentos ao longo do tempo.
                        </p>
                        <p style="margin-bottom: 12px; color: #E4E4E4;">
                            As taxas utilizadas seguem estimativas de retorno real de longo prazo, com base em estudos históricos de juros reais no Brasil (incluindo análises do <strong>IBRE/FGV</strong>, <strong>CDI</strong> e <strong>Selic real</strong>), mas <strong>não constituem garantia de resultados</strong>.
                        </p>
                        <p style="margin: 0; color: #E4E4E4;">
                            Recomenda-se revisar periodicamente seu planejamento, pois mudanças de renda, objetivos pessoais ou condições macroeconômicas podem alterar significativamente as projeções.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- CSS para o ícone de informação e modal -->
        <style id="wizard-dynamic-style">
            .info-icon-modal {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                background: rgba(212, 175, 55, 0.2);
                border: 1px solid rgba(212, 175, 55, 0.4);
                border-radius: 50%;
                color: #D4AF37;
                font-size: 0.85rem;
                font-weight: 700;
                margin-left: 8px;
                transition: all 0.3s ease;
            }
            .info-icon-modal:hover {
                background: rgba(212, 175, 55, 0.3);
                border-color: #D4AF37;
                transform: scale(1.1);
            }
            
            /* Estilo para scrollbar do modal */
            #modalPremissasRenda > div > div:last-child {
                scrollbar-width: thin;
                scrollbar-color: rgba(212, 175, 55, 0.5) rgba(13, 13, 13, 0.3);
            }
            
            #modalPremissasRenda > div > div:last-child::-webkit-scrollbar {
                width: 8px;
            }
            
            #modalPremissasRenda > div > div:last-child::-webkit-scrollbar-track {
                background: rgba(13, 13, 13, 0.3);
                border-radius: 4px;
            }
            
            #modalPremissasRenda > div > div:last-child::-webkit-scrollbar-thumb {
                background: rgba(212, 175, 55, 0.5);
                border-radius: 4px;
            }
            
            #modalPremissasRenda > div > div:last-child::-webkit-scrollbar-thumb:hover {
                background: rgba(212, 175, 55, 0.7);
            }
            
            /* 🔥 BOTÃO SIMULADOR INVLAB - Degradê Premium Gold Touch */
            .btn-simulador-invlab {
                background: linear-gradient(135deg, #355E3B 0%, #CCAA66 100%);
                border: 1px solid rgba(204, 170, 102, 0.3);
                color: #E4E4E4;
                padding: 14px 32px;
                font-size: 1rem;
                font-weight: 500;
                font-family: 'Inter', sans-serif;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(53, 94, 59, 0.2);
            }
            
            .btn-simulador-invlab:hover {
                border-color: #D4AF37;
                transform: translateY(-4px);
                box-shadow: 
                    0 8px 24px rgba(53, 94, 59, 0.3),
                    0 4px 12px rgba(204, 170, 102, 0.2);
                color: #FFFFFF;
            }
            
            .btn-simulador-invlab:active {
                transform: translateY(-2px);
            }
        </style>
    `;

    // ===================================================
    // 📈 RENDERIZAR GRÁFICO APÓS CRIAR DASHBOARD
    // ===================================================
    setTimeout(() => {
        // ✅ VALIDAÇÃO: Verificar se curvasExtras existe e não está vazio antes de renderizar
        // ✅ SIMPLIFICAÇÃO: Curvas extras removidas - sempre usar apenas 95 anos
        renderizarGraficoEvolucao(
            resultados.dadosMensais,
            wizardData.idadeAtual,
            wizardData.idadeAposentadoria,
            resultados.projecaoPosAposentadoria,
            resultados.tipoRenda,
            resultados.estrategia,
            resultados.idadeFinal || 95
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
        
        // Configurar botão de renda mensal
        const btnRendaMensal = document.getElementById('btn_rendaMensal');
        if (btnRendaMensal) {
            btnRendaMensal.onclick = () => {
                abrirGraficoRendaMensal(
                    resultados.rendaMensalDetalhada,
                    resultados.idadeAposentadoria,
                    resultados.inssReal || 0,
                    [],  // ✅ SIMPLIFICAÇÃO: rendas extras removidas
                    95,  // ✅ SIMPLIFICAÇÃO: sempre 95 anos
                    resultados.tipoRenda || 'vitalicia',
                    resultados.estrategia || 'perpetua'
                );
            };
        }

        // Configurar botão de fechar dashboard
        const btnFecharDashboard = document.getElementById('btnFecharDashboard');
        if (btnFecharDashboard) {
            btnFecharDashboard.onclick = () => {
                fecharDashboard();
            };
        }
    }, 100);
    } catch (error) {
        console.error("❌ Erro em finalizarWizard:", error);
        alert("⚠️ Ocorreu um erro ao finalizar a simulação. Por favor, verifique o console para mais detalhes.\n\nErro: " + error.message);
    }
}

// -----------------------------------------------------
// INTERPRETAÇÃO AUTOMÁTICA DO RESULTADO
// -----------------------------------------------------
function gerarInterpretacaoAutomatica(resultados, wizardData) {
    // Blindagem contra valores inválidos vindos do motor
    if (!resultados || typeof resultados !== 'object') {
        return '<p style="color: #ef4444;">⚠️ Erro: Dados de simulação inválidos.</p>';
    }
    
    const rendaPrevista = Number(resultados?.rendaTotalPrevista) || 0;
    const rendaDesejada = Number(resultados?.rendaDesejada) || 0;
    
    // Evita divisão por zero e problemas de Infinity/NaN
    const divisor = rendaDesejada > 0 ? rendaDesejada : 1;
    
    // Cálculo seguro
    const percentualAtingido = (rendaPrevista / divisor) * 100;
    
    // Validar resultado final
    if (isNaN(percentualAtingido) || !isFinite(percentualAtingido)) {
        return '<p style="color: #ef4444;">⚠️ Erro ao calcular percentual atingido. Por favor, verifique os dados informados.</p>';
    }
    
    // ✅ CORREÇÃO DOSE 6: Validar deficitOuSobra antes de usar
    const deficitOuSobraValido = isNaN(resultados.deficitOuSobra) ? -1 : resultados.deficitOuSobra;
    
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
                <li>Renda desejada: <span style="color: #D4AF37;">${formatarValorMonetario(rendaDesejada)}/mês</span></li>
                <li>Renda projetada: <span style="color: #D4AF37;">${formatarValorMonetario(rendaPrevista)}/mês</span></li>
                <li>Excedente: <span style="color: #D4AF37;">${formatarValorMonetario(Math.abs(deficitOuSobraValido))}/mês</span></li>
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
        // ✅ CORREÇÃO DOSE 6: Usar deficitOuSobraValido (já validado) e formatarValorMonetario
        const faltam = Math.abs(deficitOuSobraValido);
        const aporteAdicional = (resultados.aporteNecessario && !isNaN(resultados.aporteNecessario)) ? resultados.aporteNecessario : 0;
        conteudo = `
            <p style="color: #E4E4E4;">Faltam apenas <span style="color: #D4AF37;">${formatarValorMonetario(faltam)}/mês</span> para atingir 100% da meta.</p>
            <p style="margin-top: 15px; color: #E4E4E4;">📈 Pontos positivos:</p>
            <ul style="color: #E4E4E4;">
                <li>Patrimônio projetado sólido: <span style="color: #D4AF37;">${formatarValorMonetario(resultados.patrimonioTotalProjetado, 0)}</span></li>
                <li><span style="color: #D4AF37;">${percentualAtingido.toFixed(1)}%</span> da meta já atingidos</li>
                <li>${resultados.estrategia === 'perpetua' ? 'Renda perpétua = patrimônio preservado para herança' : 'Estratégia de consumo gradual do capital'}</li>
            </ul>
            <p style="margin-top: 15px; color: #E4E4E4;">🎯 Como atingir 100%:</p>
            <ul style="color: #E4E4E4;">
                ${aporteAdicional > 0 && !isNaN(wizardData.aporteMensal) ? `<li>Aumentar aporte mensal de <span style="color: #D4AF37;">${formatarValorMonetario(Number(wizardData.aporteMensal))}</span> para <span style="color: #D4AF37;">${formatarValorMonetario(Number(wizardData.aporteMensal) + aporteAdicional)}</span> (<span style="color: #D4AF37;">+${formatarValorMonetario(aporteAdicional)}</span>)</li>` : ''}
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

// -----------------------------------------------------
// FECHAR DASHBOARD E VOLTAR AO STEP 4
// -----------------------------------------------------
function fecharDashboard() {
    // Fechar o dashboard
    const dash = document.getElementById('dashboard');
    if (dash) {
        dash.classList.remove('active');
    }

    // Voltar para o step 4
    activateStep(4);
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
    // ✅ SIMPLIFICAÇÃO: Dropdown e checkbox removidos - sempre usamos 95 anos

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
    // ===============================
    // PREVENIR LISTENERS DUPLICADOS
    // ===============================
    if (window.__listenersEstrategiaCarregados) {
        return; // impede múltiplas execuções
    }
    window.__listenersEstrategiaCarregados = true;
    
    console.log("🔧 Configurando listeners de estratégia...");
    
    const rEstrategiaBtns = document.querySelectorAll("input[name='estrategia']");
    console.log(`🔍 Encontrados ${rEstrategiaBtns.length} radio buttons de estratégia`);
    
    if (rEstrategiaBtns.length === 0) {
        console.warn("⚠️ Nenhum radio button de estratégia encontrado! Tentando novamente em 500ms...");
        setTimeout(configurarListenersEstrategia, 500);
        return;
    }
    
    rEstrategiaBtns.forEach((r, index) => {
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
    
    // Tentar múltiplas formas de encontrar o modal
    let modal = document.getElementById("modalVitaliciaEsgotavel");
    
    if (!modal) {
        // Tentar buscar por classe também
        modal = document.querySelector(".modal-overlay#modalVitaliciaEsgotavel");
    }
    
    if (!modal) {
        // Se ainda não encontrou, criar dinamicamente
        console.warn("⚠️ Modal não encontrado no HTML, criando dinamicamente...");
        criarModalDinamico();
        modal = document.getElementById("modalVitaliciaEsgotavel");
    }
    
    if (modal) {
        console.log("✅ Modal encontrado, exibindo...");
        
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
        
        // Configurar listener para fechar ao clicar no backdrop (se ainda não estiver configurado)
        if (!modal.hasAttribute('data-listener-configurado')) {
            modal.addEventListener("click", function(e) {
                if (e.target === modal) {
                    fecharModalVitaliciaEsgotavel();
                }
            });
            modal.setAttribute('data-listener-configurado', 'true');
        }
        
        console.log("✅ Modal exibido com sucesso!");
    } else {
        console.error("❌ Erro crítico: Não foi possível encontrar ou criar o modal!");
    }
}

// Função fallback para criar modal se não existir
function criarModalDinamico() {
    // ✅ CORREÇÃO: Remover modal existente antes de criar novo (evita IDs duplicados)
    const modalExistente = document.getElementById("modalVitaliciaEsgotavel");
    if (modalExistente) {
        modalExistente.remove();
        console.log("🔄 Modal existente removido antes de criar novo");
    }
    
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
    // Garantir que o modal existe antes de configurar
    let modal = document.getElementById("modalVitaliciaEsgotavel");
    if (!modal) {
        console.log("🔧 Modal não encontrado na inicialização, criando...");
        criarModalDinamico();
        modal = document.getElementById("modalVitaliciaEsgotavel");
    }
    
    if (modal) {
        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                fecharModalVitaliciaEsgotavel();
            }
        });
        console.log("✅ Modal configurado corretamente!");
    } else {
        console.error("❌ Erro: Não foi possível criar o modal na inicialização!");
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

    // Verificar se PERFIS_RENTABILIDADE está disponível (exportado do motor)
    const perfisDisponiveis = window.PERFIS_RENTABILIDADE || {
        conservador: 0.06,
        moderado: 0.08,
        arrojado: 0.10
    };

    if (!novoPerfil || !perfisDisponiveis[novoPerfil]) {
        alert('⚠️ Selecione um perfil de investimento válido.');
        return;
    }

    if (novaRendaDesejada <= 0) {
        alert('⚠️ A renda desejada deve ser maior que zero.');
        return;
    }

    // Atualização do estado principal (wizardData)
    wizardData.idadeAtual = Number(novaIdadeAtual) || wizardData.idadeAtual;
    wizardData.idadeAposentadoria = Number(novaIdadeApos) || wizardData.idadeAposentadoria;
    wizardData.aporteMensal = Number(novoAporte) || wizardData.aporteMensal;
    wizardData.patrimonioAtual = novoPatrimonioInicial;
    wizardData.rendaDesejada = novaRendaDesejada;

    // 1. Sincroniza visualmente os inputs do wizard
    const inputIdadeAtualWizard = document.querySelector('input[name="idadeAtual"]');
    if (inputIdadeAtualWizard) inputIdadeAtualWizard.value = wizardData.idadeAtual;

    const inputIdadeAposWizard = document.querySelector('input[name="idadeAposentadoria"]');
    if (inputIdadeAposWizard) inputIdadeAposWizard.value = wizardData.idadeAposentadoria;

    const inputAporteWizard = document.querySelector('input[name="aporteMensal"]');
    if (inputAporteWizard) inputAporteWizard.value = wizardData.aporteMensal;

    // 2. Garantia de consistência mínima
    if (wizardData.idadeAposentadoria <= wizardData.idadeAtual) {
        wizardData.idadeAposentadoria = wizardData.idadeAtual + 1;
        if (inputIdadeAposWizard) inputIdadeAposWizard.value = wizardData.idadeAposentadoria;
    }

    // ✅ SIMPLIFICAÇÃO: Sempre usar 95 anos como idade final
    wizardData.idadeFinal = 95;

    // 4. Garante que campos dependentes não fiquem undefined
    wizardData.rendaDesejada = Number(wizardData.rendaDesejada) || 0;
    wizardData.rendaAtual = Number(wizardData.rendaAtual) || 0;
    wizardData.inssEstimado = Number(wizardData.inssEstimado) || 0;

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
                try {
                    captureStepData(index + 1);

                    if (!validateStep(index + 1)) return;

                    if (index + 1 === 4) {
                        finalizarWizard();
                    } else {
                        activateStep(index + 2);
                    }
                } catch (error) {
                    console.error("❌ Erro ao processar próximo passo:", error);
                    alert("⚠️ Ocorreu um erro. Por favor, verifique o console para mais detalhes.");
                }
            };
        }

    });

    // Listeners para radio buttons de renda
    const rTipoBtns = document.querySelectorAll("input[name='tipoRenda']");
    const rEstrategiaBtnsMain = document.querySelectorAll("input[name='estrategia']");

    // Função auxiliar para atualizar visibilidade dos campos
    // ✅ SIMPLIFICAÇÃO: Dropdown e checkbox removidos - sempre usamos 95 anos
    // Não há mais necessidade de controlar a exibição desses elementos
    const atualizarVisibilidadeCampos = () => {
        // Função vazia - elementos removidos
    };

    // Mostrar/ocultar campos de idade terminal se tipo = 'periodo' OU estratégia = 'esgotavel'
    rTipoBtns.forEach(el => {
        el.addEventListener("change", () => {
            console.log(`🔄 Tipo de renda mudou para: ${el.value}`);
            atualizarVisibilidadeCampos();
            atualizarRegrasWizard();
        });
    });
    
    // Também mostrar idade terminal quando estratégia mudar para esgotavel
    rEstrategiaBtnsMain.forEach(el => {
        el.addEventListener("change", () => {
            console.log(`🔄 Estratégia mudou para: ${el.value}`);
            atualizarVisibilidadeCampos();
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

// ============================================================
// 📊 GRÁFICO: RENDA MENSAL AO LONGO DA APOSENTADORIA
// ============================================================
function abrirGraficoRendaMensal(listaRenda, idadeApos, inssValor = 0, rendasMensaisExtras = [], idadeFinal = null, tipoRenda = 'vitalicia', estrategia = 'perpetua') {
    console.log("📊 Abrindo gráfico de renda mensal...");
    console.log("📊 Parâmetros recebidos:", { 
        listaRenda: listaRenda?.length, 
        idadeApos, 
        inssValor, 
        rendasMensaisExtras: rendasMensaisExtras?.length,
        rendasMensaisExtrasDetalhes: rendasMensaisExtras?.map(c => ({ idade: c.idade, tamanho: c.rendaMensal?.length, primeira: c.rendaMensal?.[0] }))
    });
    
    // Converter parâmetros
    idadeApos = Number(idadeApos) || 0;
    inssValor = Number(inssValor) || 0;
    
    // Validar lista de renda
    if (!listaRenda || !Array.isArray(listaRenda) || listaRenda.length === 0) {
        console.error("❌ Lista de renda inválida ou vazia!");
        alert("Erro: Não foi possível gerar o gráfico. Dados de renda inválidos.");
        return;
    }
    
    console.log(`✅ Lista de renda válida com ${listaRenda.length} meses`);
    
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined' && typeof window.Chart === 'undefined') {
        console.error("❌ Chart.js não está carregado!");
        alert("Erro: Chart.js não está disponível. Por favor, recarregue a página.");
        return;
    }
    
    const ChartLib = window.Chart || Chart;
    
    const modal = document.getElementById("modalRendaMensal");
    if (!modal) {
        console.error("❌ Modal não encontrado!");
        return;
    }
    
    // Exibir modal primeiro
    modal.style.display = "flex";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    
    // Esconder loading e mostrar canvas
    const loadingDiv = document.getElementById("graficoLoading");
    if (loadingDiv) {
        loadingDiv.style.display = "none";
    }
    
    // Aguardar um pouco para o modal estar totalmente renderizado antes de criar o gráfico
    setTimeout(() => {
        const canvas = document.getElementById("graficoRendaMensal");
        if (!canvas) {
            console.error("❌ Canvas não encontrado!");
            const infoDiv = document.getElementById("infoRendaMensal");
            if (infoDiv) {
                const pElement = infoDiv.querySelector('p');
                if (pElement) {
                    pElement.innerHTML = "❌ Erro: Canvas não encontrado. Por favor, recarregue a página.";
                }
            }
            if (loadingDiv) {
                loadingDiv.style.display = "block";
                loadingDiv.textContent = "❌ Erro ao carregar gráfico";
            }
            return;
        }
        
        // Garantir que o canvas tenha dimensões
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        } else {
            canvas.width = 800;
            canvas.height = 400;
        }
        
        console.log("✅ Canvas encontrado, dimensões:", canvas.width, "x", canvas.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("❌ Não foi possível obter contexto 2D do canvas!");
            if (loadingDiv) {
                loadingDiv.style.display = "block";
                loadingDiv.textContent = "❌ Erro ao obter contexto do canvas";
            }
            return;
        }
    
        // Gerar labels de idade (amostrar a cada 12 meses para não sobrecarregar)
        // ✅ GARANTIR que o eixo X vá até 116 anos (OBRIGATÓRIO - TODOS OS GRÁFICOS)
        const labels = [];
        const rendas = [];
        const idadeMaxima = 116; // Idade máxima para todos os gráficos
        
        for (let i = 0; i < listaRenda.length; i++) {
            // Amostrar a cada 12 meses ou no último mês
            if (i % 12 === 0 || i === listaRenda.length - 1) {
                const idade = idadeApos + Math.floor(i / 12);
                if (idade <= idadeMaxima) {
                    labels.push(idade + " anos");
                    rendas.push(listaRenda[i]);
                }
            }
        }
        
        // ✅ Expandir labels até 116 anos (preencher com null nos dados)
        const ultimaIdade = labels.length > 0 ? parseInt(labels[labels.length - 1].replace(" anos", "")) : idadeApos;
        if (ultimaIdade < idadeMaxima) {
            for (let idade = ultimaIdade + 1; idade <= idadeMaxima; idade++) {
                // Adicionar apenas idades múltiplas de 5 ou idades importantes (95, 100, 116)
                if (idade % 5 === 0 || idade === 95 || idade === 100 || idade === 116) {
                    labels.push(idade + " anos");
                    rendas.push(null); // Sem dados para essas idades na curva principal
                }
            }
        }
        
        console.log(`✅ Dados preparados: ${labels.length} pontos de idade (até ${idadeMaxima} anos), ${rendas.filter(r => r !== null).length} valores de renda válidos`);
        
        // Destruir gráfico antigo se existir
        if (graficoRendaMensal) {
            graficoRendaMensal.destroy();
            graficoRendaMensal = null;
        }
        
        // Validar dados
        if (labels.length === 0 || rendas.length === 0) {
            console.error("❌ Dados vazios!");
            const infoDiv = document.getElementById("infoRendaMensal");
            if (infoDiv) {
                const pElement = infoDiv.querySelector('p');
                if (pElement) {
                    pElement.innerHTML = "⚠️ Erro: Não foi possível gerar o gráfico. Dados insuficientes.";
                }
            }
            if (loadingDiv) {
                loadingDiv.style.display = "block";
                loadingDiv.textContent = "❌ Dados insuficientes";
            }
            return;
        }
        
        // Preparar 3 datasets: Patrimônio, INSS e Total
        // Renda do patrimônio (já calculada)
        const datasetPropria = {
            label: "Renda do Patrimônio",
            data: rendas,
            borderColor: "#00ff88",
            backgroundColor: "rgba(0, 255, 136, 0.05)",  // ✅ AJUSTE: Transparência reduzida
            borderWidth: 1.5,  // ✅ AJUSTE: Linha mais fina
            tension: 0.25,
            fill: true,
            pointRadius: 1.5,  // ✅ AJUSTE: Pontos menores
            pointHoverRadius: 4
        };

        // INSS (valor constante após aposentadoria)
        const datasetINSS = {
            label: "Renda do INSS",
            data: rendas.map(() => inssValor),
            borderColor: "#4da6ff",
            backgroundColor: "rgba(77, 166, 255, 0.05)",  // ✅ AJUSTE: Transparência reduzida
            borderWidth: 1.5,  // ✅ AJUSTE: Linha mais fina
            borderDash: [6, 4],
            tension: 0.15,
            fill: false,
            pointRadius: 1,  // Mantido pequeno para INSS
            pointHoverRadius: 3
        };

        // Soma total
        const datasetTotal = {
            label: "Renda Total (Patrimônio + INSS)",
            data: rendas.map((v) => v + inssValor),
            borderColor: "#ffcc00",
            backgroundColor: "rgba(255, 204, 0, 0.05)",  // ✅ AJUSTE: Transparência reduzida
            borderWidth: 1.5,  // ✅ AJUSTE: Linha mais fina
            tension: 0.25,
            fill: true,
            pointRadius: 1.5,  // ✅ AJUSTE: Pontos menores
            pointHoverRadius: 4
        };
        
        // ✅ SIMPLIFICAÇÃO: Curvas extras de renda removidas - sempre usar apenas 95 anos
        
        // Combinar todos os datasets
        const todosDatasets = [datasetPropria, datasetINSS, datasetTotal];
        
        console.log("📊 Total de datasets:", todosDatasets.length);
        
        try {
            graficoRendaMensal = new ChartLib(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: todosDatasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'center',
                            labels: {
                                color: '#E4E4E4',
                                usePointStyle: true,  // ✅ AJUSTE: Usar estilo de linha em vez de caixa
                                pointStyle: 'line',  // ✅ AJUSTE: Linha na legenda
                                boxWidth: 30,  // ✅ AJUSTE: Aumentar comprimento das linhas na legenda
                                boxHeight: 2,  // ✅ AJUSTE 2: Restaurar altura para mostrar elementos visuais
                                padding: 12,  // ✅ AJUSTE 1: Adicionar padding para espaçamento
                                font: {
                                    size: 11
                                }
                            },
                            padding: {
                                top: 10,  // ✅ AJUSTE 1: Espaçamento superior entre labels e gráfico
                                bottom: 5
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            titleColor: '#D4AF37',
                            bodyColor: '#E4E4E4',
                            callbacks: {
                                label: function(context) {
                                    return `Renda: R$ ${context.parsed.y.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Renda Mensal (R$)",
                                color: "#ffcc00"
                            },
                            ticks: {
                                color: '#9ca3af',
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR', {maximumFractionDigits: 0});
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: "Idade",
                                color: "#ffcc00"
                            },
                            ticks: {
                                color: '#9ca3af',
                                maxTicksLimit: 20
                            }
                        }
                    }
                }
            });
            
            console.log("✅ Gráfico Chart.js criado com sucesso!");
            
            // Esconder loading
            if (loadingDiv) {
                loadingDiv.style.display = "none";
            }
            
            // ✅ DOSE 7: Atualizar informações textuais com explicação melhorada sobre curvas extras
            const infoDiv = document.getElementById("infoRendaMensal");
            if (infoDiv) {
                const rendaInicial = listaRenda[0] || 0;
                const rendaFinal = listaRenda[listaRenda.length - 1] || 0;
                const mesesTotal = listaRenda.length;
                const idadeFinalCalculada = idadeFinal || (idadeApos + Math.floor(mesesTotal / 12));
                const temRendaZero = rendas.some(r => r === 0 || r < 0.01);
                const rendaTotalInicial = rendaInicial + inssValor;
                
                // ✅ SIMPLIFICAÇÃO: Curvas extras removidas
                let textoInfo = "";
                
                // ✅ AJUSTE 3: Remover negrito desnecessário quando já temos cor destacada
                if (temRendaZero) {
                    textoInfo = `📊 <span style="color: #10b981;">Renda por Período Determinado:</span> Você receberá uma renda mensal do patrimônio que começa em <span style="color: #D4AF37;">R$ ${rendaInicial.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</span> e termina em <span style="color: #D4AF37;">R$ 0</span> aproximadamente aos <span style="color: #D4AF37;">${idadeFinalCalculada} anos</span>, quando seu patrimônio se esgotará.`;
                } else {
                    textoInfo = `💚 <span style="color: #10b981;">Renda Vitalícia:</span> Você receberá <span style="color: #D4AF37;">R$ ${rendaInicial.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</span> do patrimônio de forma permanente, preservando seu capital para sempre.`;
                }
                
                // ✅ AJUSTE 3: Remover negrito desnecessário
                if (idadeFinal) {
                    textoInfo += `<br><br>📌 <span style="color: #10b981;">Linha principal (verde):</span> Renda mensal calculada para durar até <span style="color: #D4AF37;">${idadeFinal} anos</span>, baseada na sua escolha.`;
                }
                
                // ✅ AJUSTE 3: Remover negrito desnecessário quando já temos cor destacada
                if (inssValor > 0) {
                    textoInfo += `<br><br>📘 <span style="color: #4da6ff;">INSS:</span> Você receberá adicionalmente <span style="color: #D4AF37;">R$ ${inssValor.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</span> do INSS.`;
                    textoInfo += `<br><br>💰 <span style="color: #ffcc00;">Renda Total:</span> <span style="color: #D4AF37;">R$ ${rendaTotalInicial.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}/mês</span> (patrimônio + INSS).`;
                    textoInfo += `<br><br><span style="font-size: 0.85rem; color: #9ca3af;">💡 <span style="color: #D4AF37;">Observação:</span> O valor do INSS é uma estimativa. Para um cálculo oficial, consulte o portal <a href="https://meu.inss.gov.br" target="_blank" style="color: #4da6ff;">Meu INSS</a>.</span>`;
                }
                
                const pElement = infoDiv.querySelector('p');
                if (pElement) {
                    pElement.innerHTML = textoInfo;
                }
            }
        } catch (error) {
            console.error("❌ Erro ao criar gráfico:", error);
            const infoDiv = document.getElementById("infoRendaMensal");
            if (infoDiv) {
                const pElement = infoDiv.querySelector('p');
                if (pElement) {
                    pElement.innerHTML = `⚠️ Erro ao criar gráfico: ${error.message}`;
                }
            }
            if (loadingDiv) {
                loadingDiv.style.display = "block";
                loadingDiv.textContent = `❌ Erro: ${error.message}`;
            }
            return;
        }
        
        console.log("✅ Gráfico de renda mensal criado com sucesso!");
    }, 100); // Delay de 100ms para garantir que o modal esteja visível
}

// ======================
// Fechar Modal de Renda Mensal
// ======================
function fecharModalRendaMensal() {
    const modal = document.getElementById("modalRendaMensal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

// Tornar funções globais para acesso via onclick
window.fecharModalRendaMensal = fecharModalRendaMensal;

// ===================================================
// MODAL DE PREMISSAS TÉCNICAS DA RENDA MENSAL
// ===================================================
function abrirModalPremissasRenda() {
    const modal = document.getElementById('modalPremissasRenda');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll da página
    }
}

function fecharModalPremissasRenda() {
    const modal = document.getElementById('modalPremissasRenda');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
}

// Fechar modal ao clicar fora dele
document.addEventListener('click', function(event) {
    const modal = document.getElementById('modalPremissasRenda');
    if (modal && event.target === modal) {
        fecharModalPremissasRenda();
    }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('modalPremissasRenda');
        if (modal && modal.style.display === 'block') {
            fecharModalPremissasRenda();
        }
    }
});

// Tornar funções globais
window.abrirModalPremissasRenda = abrirModalPremissasRenda;
window.fecharModalPremissasRenda = fecharModalPremissasRenda;

// Garantir que simuladorWizardStart esteja acessível globalmente
if (typeof window.simuladorWizardStart === 'undefined') {
    window.simuladorWizardStart = function() {
        console.log("🚀 Função simuladorWizardStart chamada!");
        document.querySelector('.landing-explicativa').style.display = 'none';
        activateStep(1);
        updateProgress(1);
    };
}
