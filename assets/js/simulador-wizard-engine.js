// ===============================================================
//  SIMULADOR INVLAB - MOTOR COMPLETO (WIZARD)
//  Arquivo: simulador-wizard-engine.js
//  Autor: Noah | InvLab Premium
// ===============================================================

/**
 * NOVA LÓGICA DO SIMULADOR WIZARD (2025-02):
 *
 * - Somente 1 idade final será usada: 95 anos.
 * - Todas as estratégias seguem essa idade final.
 * - Curvas extras foram removidas.
 * - PMT da estratégia esgotável usa taxa REAL mensal (renda em poder de compra constante).
 * - O gráfico deverá mostrar apenas:
 *     - acumulação até aposentadoria
 *     - curva esgotável até 95 anos
 * - Nenhuma curva deve ser calculada para 105 ou 115 anos.
 */

// ===============================================================
// CONFIGURAÇÕES E CONSTANTES OFICIAIS
// ===============================================================

// Taxas anuais para cada perfil
const PERFIS_RENTABILIDADE = {
    conservador: 0.06,  // 6% a.a.
    moderado: 0.08,     // 8% a.a.
    arrojado: 0.10      // 10% a.a.
};

// Taxa de inflação média (pode variar depois)
const INFLACAO_MEDIA = 0.045;

// Previdência privada: taxa real menor (custos)
const TAXA_PREVIDENCIA_PRIVADA = 0.02; // 2%

// Teto INSS
const TETO_INSS = 7750;

// ===============================================================
// FUNÇÕES AUXILIARES
// ===============================================================

// Converte taxa anual em taxa mensal
function taxaMensal(taxaAnual) {
    return Math.pow(1 + taxaAnual, 1/12) - 1;
}

// Acumulação com juros compostos mensais
function acumulacaoComJuros(aporteMensal, anos, taxaAnual, aporteExtraAnual = 0, patrimonioInicial = 0) {
    const meses = anos * 12;
    const jurosMensal = taxaMensal(taxaAnual);
    let saldo = Number(patrimonioInicial);  // 👈 CORREÇÃO: começa com o que já tem

    for (let m = 1; m <= meses; m++) {
        saldo = saldo * (1 + jurosMensal) + Number(aporteMensal);

        if (aporteExtraAnual > 0 && m % 12 === 0) {
            saldo += Number(aporteExtraAnual);
        }
    }

    return saldo;
}

// Estimar o valor do INSS baseado na renda desejada
function calcularINSS(rendaDesejada) {
    const estimado = rendaDesejada * 0.40;
    return Math.min(estimado, TETO_INSS);
}

// Renda vitalícia baseada no patrimônio acumulado
function rendaVitalicia(patrimonio, taxaAnual, expectativaAnos) {
    const taxaMensalReal = taxaMensal((1 + taxaAnual) / (1 + INFLACAO_MEDIA) - 1);
    const meses = expectativaAnos * 12;

    if (taxaMensalReal <= 0) {
        return patrimonio / meses; // fallback
    }

    const rendaMensal = (patrimonio * taxaMensalReal) /
        (1 - Math.pow(1 + taxaMensalReal, -meses));

    return rendaMensal;
}

// Projeção mês a mês do patrimônio (para gráficos)
function projetarPatrimonioMensal(aporteMensal, anos, taxaAnual, aporteExtraAnual = 0, patrimonioInicial = 0) {
    const jurosMensal = taxaMensal(taxaAnual);
    const meses = anos * 12;
    let saldo = Number(patrimonioInicial);  // 👈 CORREÇÃO: começa com o patrimônio inicial
    let dados = [];

    for (let m = 1; m <= meses; m++) {
        saldo = saldo * (1 + jurosMensal) + Number(aporteMensal);
        
        if (aporteExtraAnual > 0 && m % 12 === 0) saldo += Number(aporteExtraAnual);

        dados.push({
            mes: m,
            saldo: saldo
        });
    }

    return dados;
}

// ============================================================
// 🟦 PROJEÇÃO PÓS-APOSENTADORIA: RENDA VITALÍCIA
// ============================================================
function projetarPatrimonioVitalicia(patrimonioInicial, taxaMensalReal, anosProjecao = 30) {
    const meses = anosProjecao * 12;
    let saldo = patrimonioInicial;
    let dados = [];

    // Patrimônio permanece constante (só juros são consumidos)
    for (let m = 0; m <= meses; m++) {
        dados.push({
            mes: m,
            saldo: saldo  // Capital preservado
        });
    }

    return dados;
}

// ============================================================
// 🟧 PROJEÇÃO PÓS-APOSENTADORIA: RENDA POR PERÍODO (CONSUMO)
// ============================================================
function projetarPatrimonioPorPeriodo(patrimonioInicial, rendaMensal, taxaMensalReal, mesesTotal) {
    const pv = Number(patrimonioInicial);
    const pmt = Number(rendaMensal);
    const i = taxaMensalReal;

    const dados = [];

    for (let m = 0; m <= mesesTotal; m++) {
        let saldo;

        if (m === 0) {
            saldo = pv;
        } else if (m === mesesTotal) {
            // ✅ CORREÇÃO: Garantir que o último ponto seja exatamente zero
            saldo = 0;
        } else {
            const fator = Math.pow(1 + i, m);
            // Fórmula da anuidade (saldo no mês m)
            // B(m) = PV·(1+i)^m − PMT · ((1+i)^m − 1)/i
            saldo = pv * fator - pmt * ((fator - 1) / i);
        }

        // Evita possíveis resíduos numéricos negativos muito pequenos
        if (saldo < 0 && saldo > -1e-6) {
            saldo = 0;
        }

        dados.push({
            mes: m,
            saldo: saldo
        });
    }

    return dados;
}

// ============================================================
// 🟣 RENDA OTIMIZADA: CÁLCULO PMT PARA LONGEVIDADE
// ============================================================
function calcularRendaPeriodo(pv, taxaMensalReal, idadeApos, idadeFinal) {
    const meses = (idadeFinal - idadeApos) * 12;
    if (meses <= 0) return { rendaMensal: 0, mesesDuracao: 0 };

    const pmt = (pv * taxaMensalReal) / (1 - Math.pow(1 + taxaMensalReal, -meses));
    return { rendaMensal: pmt, mesesDuracao: meses };
}

// ============================================================
// 🔧 FUNÇÕES AUXILIARES PARA CURVAS ESGOTÁVEIS
// ============================================================

// Função auxiliar — calcular PMT esgotável para um n meses
function calcularPMTEsgotavel(pv, taxaMensal, meses) {
    if (meses <= 0) return 0;

    // Fórmula do PMT para esgotar capital (renda esgotável)
    const fator = Math.pow(1 + taxaMensal, meses);
    const pmt = pv * (taxaMensal * fator) / (fator - 1);

    return pmt;
}

// Função auxiliar — projetar curva usando PMT específico
function projetarCurvaEsgotavel(pv, pmt, taxaMensal, mesesTotal) {
    const dados = [];
    let saldo = pv;

    for (let m = 0; m <= mesesTotal; m++) {
        if (m === mesesTotal) {
            // ✅ CORREÇÃO: Garantir que o último ponto seja exatamente zero
            saldo = 0;
        } else if (m > 0) {
            saldo = saldo * (1 + taxaMensal) - pmt;

            // Limite para evitar números negativos por arredondamento
            if (saldo < 0) saldo = 0;
        }
        
        dados.push({ mes: m, saldo: saldo });
    }
    return dados;
}

// ============================================================
// 🟦 CALCULAR RENDA QUE PRESERVA 20% NO ÚLTIMO MÊS
// ============================================================
function calcularRendaPreservar20(pv, taxaMensalReal, idadeApos, idadeFinal) {
    const meses = (idadeFinal - idadeApos) * 12;
    if (meses <= 0) return { rendaMensal: 0, mesesDuracao: 0, heranca: pv * 0.20 };

    const FV = pv * 0.20; // 20% preservado
    const i = taxaMensalReal;

    // Fórmula exata do PMT com valor residual FV
    // PMT = [PV - FV/(1+i)^n] * [i / (1 - (1+i)^-n)]
    const fator_n = Math.pow(1 + i, meses);
    const rendaMensal = (pv - FV / fator_n) * i / (1 - 1 / fator_n);

    return {
        rendaMensal,
        mesesDuracao: meses,
        heranca: FV
    };
}

// ============================================================
// 🟦 PROJEÇÃO DE PATRIMÔNIO PRESERVANDO 20% NO ÚLTIMO MÊS
// ============================================================
function projetarPatrimonioPreservar20(pv, renda, taxaMensalReal, meses) {
    const H = pv * 0.20; // Herança = 20% do patrimônio inicial
    const dados = [];
    const tolerancia = 0.01; // Tolerância para comparação (1 centavo)
    
    // Adiciona ponto inicial
    dados.push({ mes: 0, saldo: pv });
    
    // Projeta mês a mês iterativamente
    let saldoAtual = pv;
    
    for (let m = 1; m <= meses; m++) {
        if (m === meses) {
            // ÚLTIMO MÊS: deve chegar EXATAMENTE em H
            dados.push({ mes: m, saldo: H });
            break;
        }
        
        // Calcular saldo do próximo mês: aplicar juros e subtrair renda
        saldoAtual = saldoAtual * (1 + taxaMensalReal) - renda;
        
        // Se chegou ao piso de 20% (ou muito próximo), manter constante até o final
        if (saldoAtual <= H + tolerancia) {
            // Ajustar para H exato
            saldoAtual = H;
            
            // Adicionar ponto atual
            dados.push({ mes: m, saldo: saldoAtual });
            
            // Preencher todos os meses restantes com H
            for (let k = m + 1; k <= meses; k++) {
                dados.push({ mes: k, saldo: H });
            }
            
            // Garantir que o último mês seja exatamente H
            if (dados.length > 0 && dados[dados.length - 1].mes === meses) {
                dados[dados.length - 1].saldo = H;
            }
            
            break; // Parar a projeção
        }
        
        // Adicionar ponto atual
        dados.push({ mes: m, saldo: saldoAtual });
    }
    
    // Garantir que o último ponto seja exatamente H
    if (dados.length > 0 && dados[dados.length - 1].mes !== meses) {
        // Se não chegou ao último mês, adicionar ponto final
        dados.push({ mes: meses, saldo: H });
    } else if (dados.length > 0) {
        // Se já tem o último mês, garantir que seja H
        dados[dados.length - 1].saldo = H;
    }
    
    return dados;
}

// ============================================================
// 🟣 PROJEÇÃO DE CONSUMO ATÉ LONGEVIDADE
// ============================================================
function projetarConsumoLongevidade(pv, renda, taxaMensalReal, meses) {
    let saldo = pv;
    const dados = [];

    for (let i = 0; i <= meses; i++) {
        dados.push({
            mes: i,
            saldo: saldo
        });

        if (i < meses) {
            saldo = saldo * (1 + taxaMensalReal) - renda;  // juros e saque
            
            if (saldo < 0) {
                saldo = 0;  // Não pode ficar negativo
                dados.push({
                    mes: i + 1,
                    saldo: 0
                });
                break;
            }
        }
    }

    return dados;
}

// ===============================================================
// MOTOR PRINCIPAL (ADAPTADO PARA WIZARD)
// ===============================================================

function executarSimulacaoWizard(dadosWizard) {

    // 1. Extrair dados básicos
    const idadeAtual = Number(dadosWizard.idadeAtual);
    const idadeAposent = Number(dadosWizard.idadeAposentadoria);
    const rendaAtual = Number(dadosWizard.rendaAtual);
    const rendaDesejada = Number(dadosWizard.rendaDesejada);
    const gastosEssenciais = Number(dadosWizard.gastosEssenciais);
    const inssEstimado = Number(dadosWizard.inssEstimado || 0);
    const aporteMensal = Number(dadosWizard.aporteMensal);
    const aporteExtraAnual = Number(dadosWizard.aporteExtraAnual || 0);
    const perfil = dadosWizard.perfilInvestidor;
    const patrimonioAtual = Number(dadosWizard.patrimonioAtual || 0);

    // Dados de renda humanizada
    const tipoRenda = dadosWizard.tipoRenda || "vitalicia";
    const estrategia = dadosWizard.estrategia || "perpetua";
    const anosPeriodo = Number(dadosWizard.anosPeriodo) || 30;
    const anosDuracao = Number(dadosWizard.anosDuracao) || 30;
    // ✅ SIMPLIFICAÇÃO: Sempre usar 95 anos como idade final padrão
    const idadeFinal = 95;

    // =============================
    // VALIDAÇÃO ANTES DOS CÁLCULOS
    // Garantir que funções nunca recebam undefined/NaN
    // =============================
    
    // 1. Validar perfil do investidor
    if (!perfil || !PERFIS_RENTABILIDADE[perfil]) {
        console.error("❌ Perfil de investidor inválido ou não informado:", perfil);
        return {
            erro: true,
            mensagem: "Perfil do investidor inválido ou ausente. Por favor, selecione um perfil válido.",
            perfil: perfil
        };
    }
    
    // 2. Calcular taxa anual baseada no perfil
    const taxaAnualEscolhida = PERFIS_RENTABILIDADE[perfil];
    
    // 3. Validar taxaAnualEscolhida antes de usar em cálculos
    if (typeof taxaAnualEscolhida !== "number" || isNaN(taxaAnualEscolhida)) {
        console.error("❌ Taxa anual escolhida inválida:", taxaAnualEscolhida);
        return {
            erro: true,
            mensagem: "taxaAnualEscolhida inválida antes do cálculo. Por favor, verifique o perfil selecionado.",
            taxaAnualEscolhida: taxaAnualEscolhida
        };
    }
    
    // 4. Validar se taxa anual não é <= -100% (evita NaN em Math.pow)
    if (taxaAnualEscolhida <= -1) {
        console.error("❌ Taxa anual inválida (<= -100%):", taxaAnualEscolhida);
        return {
            erro: true,
            mensagem: "Taxa anual inválida: não pode ser <= -100%.",
            taxaAnualEscolhida: taxaAnualEscolhida
        };
    }
    
    // 5. Calcular taxa real e taxa mensal
    const taxaAnualReal = (1 + taxaAnualEscolhida) / (1 + INFLACAO_MEDIA) - 1;
    const taxaMensalReal = Math.pow(1 + taxaAnualReal, 1/12) - 1;
    
    // 6. Validar taxaMensalReal (verifica se Math.pow não retornou NaN/Infinity)
    if (!isFinite(taxaMensalReal)) {
        console.error("❌ Falha ao calcular taxaMensalReal:", { taxaAnualReal, taxaMensalReal, taxaAnualEscolhida });
        return {
            erro: true,
            mensagem: "Falha ao calcular taxaMensalReal — taxa anual pode ser inválida.",
            taxas: { taxaAnualReal, taxaMensalReal, taxaAnualEscolhida }
        };
    }
    
    // 7. Validar taxaAnualReal também
    if (!isFinite(taxaAnualReal)) {
        console.error("❌ Taxa anual real inválida:", taxaAnualReal);
        return {
            erro: true,
            mensagem: "Taxa anual real inválida. Por favor, verifique os dados informados.",
            taxas: { taxaAnualReal, taxaAnualEscolhida, INFLACAO_MEDIA }
        };
    }

    // =============================
    // AGORA SIM: CÁLCULOS SEGUROS
    // Todas as validações foram aprovadas
    // =============================
    
    // 3. Calcular o tempo até a aposentadoria
    const anosAteAposentadoria = idadeAposent - idadeAtual;

    // 4. Patrimônio acumulado até lá (com o que já tem + aportes futuros)
    const patrimonioTotalProjetado = acumulacaoComJuros(
        aporteMensal,
        anosAteAposentadoria,
        taxaAnualEscolhida,
        aporteExtraAnual,
        patrimonioAtual  // 👈 CORREÇÃO: patrimônio inicial entra rendendo juros
    );
    
    // ✅ DEBUG: Log de patrimônio e taxas para validação
    console.log("🔍 DEBUG PATRIMÔNIO E TAXAS:", {
        patrimonioAtual: patrimonioAtual,
        aporteMensal: aporteMensal,
        anosAteAposentadoria: anosAteAposentadoria,
        taxaAnualEscolhida: taxaAnualEscolhida,
        taxaAnualReal: taxaAnualReal,
        taxaMensalReal: taxaMensalReal,
        patrimonioTotalProjetado: patrimonioTotalProjetado
    });
    
    // ✅ VALIDAÇÃO: Verificar se patrimônioTotalProjetado é válido
    if (isNaN(patrimonioTotalProjetado) || patrimonioTotalProjetado < 0) {
        console.error("❌ Patrimônio total projetado inválido:", patrimonioTotalProjetado);
        return {
            erro: true,
            mensagem: "Erro ao calcular patrimônio projetado. Por favor, verifique os dados informados.",
            patrimonioTotalProjetado: patrimonioTotalProjetado
        };
    }

    let rendaRealPossivel = 0;

    // ============================================================
    // ESTRATÉGIA 1: RENDA VITALÍCIA + PRESERVAR CAPITAL
    // ============================================================
    // Renda menor (só juros), patrimônio preservado para sempre
    if (tipoRenda === "vitalicia" && estrategia === "perpetua") {
        rendaRealPossivel = patrimonioTotalProjetado * taxaMensalReal;
    }

    // ============================================================
    // ESTRATÉGIA 2: RENDA POR PERÍODO + PRESERVAR CAPITAL
    // ============================================================
    // ✅ CORREÇÃO: Verificar idadeFinal PRIMEIRO para caso 2 (preservar 20%)
    // Se for "periodo" + "perpetua" COM idadeFinal → usar "preservar20" (renda intermediária)
    // Se for "periodo" + "perpetua" SEM idadeFinal → usar renda vitalícia (só juros)
    else if (tipoRenda === "periodo" && estrategia === "perpetua") {
        if (idadeFinal && idadeFinal > idadeAposent) {
            // CASO 2: Renda por período + preservar capital até idadeFinal
            // Renda intermediária que consome capital gradualmente até 20% aos 95 anos
            const calc = calcularRendaPreservar20(
                patrimonioTotalProjetado,
                taxaMensalReal,
                idadeAposent,
                idadeFinal
            );
            rendaRealPossivel = calc.rendaMensal;
            
            const mesesTotal = (idadeFinal - idadeAposent) * 12;
            console.log("✅ CASO 2: Renda preservar20 calculada:", {
                rendaMensal: calc.rendaMensal,
                rendaVitalicia: patrimonioTotalProjetado * taxaMensalReal, // Para comparação
                patrimonioInicial: patrimonioTotalProjetado,
                heranca: calc.heranca,
                idadeAposent,
                idadeFinal,
                mesesTotal: mesesTotal,
                taxaMensalReal: taxaMensalReal
            });
        } else {
            // Sem idadeFinal: renda vitalícia (só juros, patrimônio constante)
            rendaRealPossivel = patrimonioTotalProjetado * taxaMensalReal;
        }
    }

    // ============================================================
    // 🟣 ESTRATÉGIA OTIMIZADA: RENDA POR PERÍODO COM LONGEVIDADE
    // ============================================================
    // Para outros casos de "periodo" com idadeFinal (não "perpetua")
    else if (tipoRenda === "periodo" && idadeFinal && estrategia !== "perpetua") {
        // Usar cálculo normal de período
        const calc = calcularRendaPeriodo(
            patrimonioTotalProjetado,
            taxaMensalReal,
            idadeAposent,
            idadeFinal
        );
        rendaRealPossivel = calc.rendaMensal;
    }

    // ============================================================
    // ESTRATÉGIA 3: RENDA POR PERÍODO + USAR CAPITAL GRADUALMENTE
    // ============================================================
    // Renda maior (consome capital + juros), até zerar no período
    else if (tipoRenda === "periodo" && estrategia === "esgotavel") {
        // Usar idadeFinal se disponível, senão calcular a partir de anosPeriodo
        let meses;
        if (idadeFinal) {
            const anosAposAposentadoria = idadeFinal - idadeAposent;
            meses = anosAposAposentadoria * 12;
        } else {
            meses = anosPeriodo * 12;
        }
        
        rendaRealPossivel = calcularPMTEsgotavel(
            patrimonioTotalProjetado,
            taxaMensalReal,
            meses
        );

        projecaoPosAposentadoria = projetarCurvaEsgotavel(
            patrimonioTotalProjetado,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );
    }

    // ============================================================
    // ESTRATÉGIA 4: RENDA VITALÍCIA + USAR CAPITAL GRADUALMENTE
    // ============================================================
    // Esta combinação não deveria ser permitida (já tem modal de aviso)
    // Mas se chegar aqui, trata como consumo por período usando idadeFinal
    else if (tipoRenda === "vitalicia" && estrategia === "esgotavel") {
        // Usar idadeFinal se disponível, senão calcular a partir de anosDuracao
        let meses;
        if (idadeFinal) {
            const anosAposAposentadoria = idadeFinal - idadeAposent;
            meses = anosAposAposentadoria * 12;
        } else {
            meses = anosDuracao * 12;
        }
        
        rendaRealPossivel = calcularPMTEsgotavel(
            patrimonioTotalProjetado,
            taxaMensalReal,
            meses
        );

        projecaoPosAposentadoria = projetarCurvaEsgotavel(
            patrimonioTotalProjetado,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );

        // ✅ CORREÇÃO: Herança = 0 para esgotável (capital será consumido)
        heranca = 0;
    }

    // ============================================================
    // ESTRATÉGIA 5: PRESERVAR 20% DO PATRIMÔNIO
    // ============================================================
    // Renda intermediária que preserva 20% do patrimônio como herança
    else if (estrategia === "preservar20") {
        if (idadeFinal) {
            const calc = calcularRendaPreservar20(
                patrimonioTotalProjetado,
                taxaMensalReal,
                idadeAposent,
                idadeFinal
            );
            rendaRealPossivel = calc.rendaMensal;
        } else {
            // Se não tem idadeFinal, usar padrão de 95 anos
            const calc = calcularRendaPreservar20(
                patrimonioTotalProjetado,
                taxaMensalReal,
                idadeAposent,
                95
            );
            rendaRealPossivel = calc.rendaMensal;
        }
    }

    // Fallback: se nada definido, usa vitalícia (só juros)
    else {
        rendaRealPossivel = patrimonioTotalProjetado * taxaMensalReal;
    }

    // 6. Projeção mês mês (gráficos)
    const dadosMensais = projetarPatrimonioMensal(
        aporteMensal,
        anosAteAposentadoria,
        taxaAnualEscolhida,
        aporteExtraAnual,
        patrimonioAtual  // 👈 CORREÇÃO: gráfico mostra patrimônio inicial
    );

    // 7. INSS: Respeitar ZERO do usuário (não forçar cálculo automático)
    let inssReal = 0;
    if (!isNaN(inssEstimado) && inssEstimado !== null && inssEstimado !== "") {
        // Se o usuário informou um valor numérico:
        if (inssEstimado > 0) {
            inssReal = inssEstimado;   // usa o valor informado
        } else {
            inssReal = 0;              // ZERO significa "não considerar INSS"
        }
    } else {
        // Apenas se o usuário NÃO INFORMAR NADA (campo vazio)
        inssReal = calcularINSS(rendaDesejada);
    }

    // 8. Renda final prevista = INSS + investimentos
    const rendaTotalPrevista = rendaRealPossivel + inssReal;

    // 9. Quanto falta para atingir a meta?
    const deficitOuSobra = rendaTotalPrevista - rendaDesejada;

    // 10. Aporte necessário para atingir 100% da meta
    // ===============================================================
    // CÁLCULO CORRETO DO APORTE NECESSÁRIO
    // Considera a estratégia escolhida (vitalícia, esgotável, preservar20)
    // ===============================================================
    let aporteNecessario = null;
    if (deficitOuSobra < 0) {
        const meses = anosAteAposentadoria * 12;
        const jurosNominalMensal = taxaMensal(taxaAnualEscolhida);
        const rendaFaltante = Math.abs(deficitOuSobra);
        
        let patrimonioNecessario;
        
        // Caso 1: Vitalícia Perpétua (capital preservado)
        if (tipoRenda === "vitalicia" && estrategia === "perpetua") {
            // Fórmula: renda = patrimonio * taxaMensalReal
            // Portanto: patrimonio = renda / taxaMensalReal
            patrimonioNecessario = rendaFaltante / taxaMensalReal;
        }
        // Caso 2: Período + Perpetua (sem idadeFinal) - também vitalícia
        else if (tipoRenda === "periodo" && estrategia === "perpetua" && !idadeFinal) {
            // Mesma fórmula de vitalícia (capital preservado)
            patrimonioNecessario = rendaFaltante / taxaMensalReal;
        }
        // Caso 3: Preservar 20% (tem FV = 20% do PV)
        else if (estrategia === "preservar20") {
            const idadeAlvo = idadeFinal || 95;
            const n = (idadeAlvo - idadeAposent) * 12;
            const i = taxaMensalReal;
            const FV_ratio = 0.20; // 20% preservado
            
            // Fórmula: PMT = (i * (PV - FV/(1+i)^n)) / (1 - 1/(1+i)^n)
            // Rearranjando para encontrar PV dado PMT:
            // PV = PMT * (1 - (1+i)^-n) / i / (1 - FV_ratio / (1+i)^n)
            const fator_n = Math.pow(1 + i, n);
            patrimonioNecessario = rendaFaltante * (1 - 1/fator_n) / i / (1 - FV_ratio / fator_n);
        }
        // Caso 4: Esgotável (consome todo capital) ou Período com idadeFinal
        else {
            // Esgotável: periodo + esgotavel, vitalicia + esgotavel, ou periodo + idadeFinal (sem perpetua)
            let n;
            if (idadeFinal && idadeFinal > idadeAposent) {
                n = (idadeFinal - idadeAposent) * 12;
            } else if (tipoRenda === "periodo") {
                n = anosPeriodo * 12;
            } else {
                n = anosDuracao * 12;
            }
            
            const i = taxaMensalReal;
            // Fórmula de anuidade: PV = PMT * (1 - (1+i)^-n) / i
            patrimonioNecessario = rendaFaltante * (1 - Math.pow(1 + i, -n)) / i;
        }
        
        // Diferença entre o patrimônio necessário e o projetado
        const faltaAcumular = patrimonioNecessario - patrimonioTotalProjetado;
        
        if (faltaAcumular > 0) {
            // Fórmula PMT: juros compostos mensais
            aporteNecessario = (faltaAcumular * jurosNominalMensal) / 
                               (Math.pow(1 + jurosNominalMensal, meses) - 1);
        } else {
            aporteNecessario = 0;  // já atingiu
        }
    }

    // 11. Calcular herança baseada na estratégia
    // ✅ CORREÇÃO DOSE 5: Herança deve respeitar a estratégia escolhida
    // - "Preservar capital" (perpetua) → herança = patrimônio total
    // - "Usar capital gradualmente" (esgotavel) → herança = saldo final (pode ser 0)
    let heranca = 0;
    
    // 12. Projeção pós-aposentadoria (para gráfico completo)
    let projecaoPosAposentadoria = [];
    let curvasExtras = null;  // Iniciar como null (será inicializado como [] apenas se mostrarTodasCurvas = true)
    
    // ESTRATÉGIA 1: RENDA VITALÍCIA + PRESERVAR CAPITAL
    // Patrimônio permanece constante (só juros são consumidos)
    // ✅ CORREÇÃO: Renda PERPÉTUA deve ir até 116 anos (não limitada a 30 ou 95 anos)
    if (tipoRenda === "vitalicia" && estrategia === "perpetua") {
        // Calcular anos até 116 anos (padrão de longevidade estendido)
        const idadeMaxima = 116;
        const anosProjecao = idadeMaxima - idadeAposent;
        projecaoPosAposentadoria = projetarPatrimonioVitalicia(
            patrimonioTotalProjetado,
            taxaMensalReal,
            anosProjecao  // Projeção até 116 anos (perpétua)
        );
        // ✅ CORREÇÃO: Herança sempre baseada no saldo final da projeção
        heranca = projecaoPosAposentadoria?.[projecaoPosAposentadoria.length - 1]?.saldo || 0;
        
    }
    // ESTRATÉGIA 2: RENDA POR PERÍODO + PRESERVAR CAPITAL (PRESERVAR 20%)
    // ✅ CORREÇÃO CRÍTICA: Este bloco DEVE vir ANTES do bloco genérico de "periodo"
    // Se tiver idadeFinal, usar "preservar20" em vez de manter constante
    else if (tipoRenda === "periodo" && estrategia === "perpetua") {
        // Se tem idadeFinal definida, usar estratégia "preservar20"
        if (idadeFinal && idadeFinal > idadeAposent) {
            const anosAposAposentadoria = idadeFinal - idadeAposent;
            const meses = anosAposAposentadoria * 12;
            
            projecaoPosAposentadoria = projetarPatrimonioPreservar20(
                patrimonioTotalProjetado,
                rendaRealPossivel,
                taxaMensalReal,
                meses
            );
            
            // Caso 2 — preservar 20% do patrimônio inicial
            heranca = patrimonioTotalProjetado * 0.20;
            
            console.log("✅ CASO 2: Projeção preservar20 gerada:", {
                patrimonioInicial: patrimonioTotalProjetado,
                rendaMensal: rendaRealPossivel,
                taxaMensalReal: taxaMensalReal,
                meses: meses,
                heranca: heranca,
                primeiroPonto: projecaoPosAposentadoria[0],
                ultimoPonto: projecaoPosAposentadoria[projecaoPosAposentadoria.length - 1],
                totalPontos: projecaoPosAposentadoria.length
            });
            
        } else {
            // Sem idadeFinal, manter comportamento original (patrimônio constante)
            const meses = anosPeriodo * 12;
            projecaoPosAposentadoria = projetarPatrimonioVitalicia(
                patrimonioTotalProjetado,
                taxaMensalReal,
                anosPeriodo  // Projeção pelo período determinado
            );
            // ✅ CORREÇÃO: Herança sempre baseada no saldo final da projeção
            heranca = projecaoPosAposentadoria?.[projecaoPosAposentadoria.length - 1]?.saldo || 0;
            
        }
    }
    // 🟣 ESTRATÉGIA OTIMIZADA: RENDA POR PERÍODO COM LONGEVIDADE (GENÉRICO)
    // Patrimônio diminui suavemente até idadeFinal
    // ✅ CORREÇÃO: Este bloco só deve executar se NÃO for "perpetua" (já tratado acima)
    else if (tipoRenda === "periodo" && idadeFinal && estrategia !== "perpetua") {
        const calc = calcularRendaPeriodo(
            patrimonioTotalProjetado,
            taxaMensalReal,
            idadeAposent,
            idadeFinal
        );

        projecaoPosAposentadoria = projetarConsumoLongevidade(
            patrimonioTotalProjetado,
            calc.rendaMensal,
            taxaMensalReal,
            calc.mesesDuracao
        );

        // ✅ CORREÇÃO: Herança sempre baseada no saldo final da projeção
        // Isso garante consistência com o gráfico e correção matemática
        heranca = projecaoPosAposentadoria?.[projecaoPosAposentadoria.length - 1]?.saldo || 0;

    }
    // ESTRATÉGIA 3: RENDA POR PERÍODO + USAR CAPITAL GRADUALMENTE
    // Patrimônio diminui até zerar no período (usa idadeFinal)
    else if (tipoRenda === "periodo" && estrategia === "esgotavel") {
        // Usar idadeFinal se disponível, senão calcular a partir de anosPeriodo
        let meses;
        if (idadeFinal) {
            const anosAposAposentadoria = idadeFinal - idadeAposent;
            meses = anosAposAposentadoria * 12;
        } else {
            meses = anosPeriodo * 12;
        }
        projecaoPosAposentadoria = projetarCurvaEsgotavel(
            patrimonioTotalProjetado,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );

        // ✅ CORREÇÃO: Herança = 0 para esgotável (capital será consumido)
        heranca = 0;

    }
    // ============================================================
    // ESTRATÉGIA 5: PRESERVAR 20% DO PATRIMÔNIO
    // ============================================================
    // Patrimônio desce gradualmente até estabilizar em 20% do inicial
    else if (estrategia === "preservar20") {
        let meses;
        if (idadeFinal) {
            const anosAposAposentadoria = idadeFinal - idadeAposent;
            meses = anosAposAposentadoria * 12;
        } else {
            // Se não tem idadeFinal, usar padrão de 95 anos
            const anosAposAposentadoria = 95 - idadeAposent;
            meses = anosAposAposentadoria * 12;
        }
        
        projecaoPosAposentadoria = projetarPatrimonioPreservar20(
            patrimonioTotalProjetado,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );
        
        // ✅ CORREÇÃO: Herança sempre baseada no saldo final da projeção
        heranca = projecaoPosAposentadoria?.[projecaoPosAposentadoria.length - 1]?.saldo || 0;
        
    }
    // ESTRATÉGIA 4: RENDA VITALÍCIA + USAR CAPITAL GRADUALMENTE (não recomendado)
    // Trata como consumo por período usando idadeFinal
    else if (tipoRenda === "vitalicia" && estrategia === "esgotavel") {
        // Usar idadeFinal se disponível, senão calcular a partir de anosDuracao
        let meses;
        if (idadeFinal) {
            const anosAposAposentadoria = idadeFinal - idadeAposent;
            meses = anosAposAposentadoria * 12;
        } else {
            meses = anosDuracao * 12;
        }
        
        rendaRealPossivel = calcularPMTEsgotavel(
            patrimonioTotalProjetado,
            taxaMensalReal,
            meses
        );

        projecaoPosAposentadoria = projetarCurvaEsgotavel(
            patrimonioTotalProjetado,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );

        // ✅ CORREÇÃO: Herança = 0 para esgotável (capital será consumido)
        heranca = 0;

    }

    // =======================
    // Cálculo correto da herança
    // =======================
    if (tipoRenda === "vitalicia" && estrategia === "perpetua") {
        // Caso 1 — patrimônio permanece intacto
        heranca = patrimonioTotalProjetado;
    }
    else if (tipoRenda === "periodo" && estrategia === "perpetua" && idadeFinal) {
        // Caso 2 — preservar 20% do patrimônio inicial
        heranca = patrimonioTotalProjetado * 0.20;
    }
    else {
        // Caso 3 — esgotável: pegar o saldo final real
        heranca = projecaoPosAposentadoria?.[projecaoPosAposentadoria.length - 1]?.saldo || 0;
    }

    // 13. Gerar renda mensal detalhada para o modal
    // ✅ SIMPLIFICAÇÃO: Sempre usar 95 anos como idade final
    const idadeFinalParaRenda = 95;
    
    // ✅ CORREÇÃO CRÍTICA: Para Caso 2 (periodo + perpetua + idadeFinal), usar estratégia "preservar20"
    let estrategiaParaRenda = estrategia;
    if (tipoRenda === "periodo" && estrategia === "perpetua" && idadeFinalParaRenda > idadeAposent) {
        estrategiaParaRenda = "preservar20";
        console.log("✅ CASO 2: Ajustando estratégia para 'preservar20' na geração de renda mensal");
    }
    
    let rendaMensalDetalhada = gerarRendaMensalAoLongoDoTempo(
        patrimonioTotalProjetado,
        taxaAnualReal,
        idadeAposent,
        idadeFinalParaRenda,
        estrategiaParaRenda
    );

    // 14. Retornar objeto completo
    return {
        anosAteAposentadoria,
        patrimonioTotalProjetado,
        rendaRealPossivel,
        rendaTotalPrevista,
        rendaDesejada,
        rendaAtual,
        inssReal,
        deficitOuSobra,
        aporteNecessario,
        dadosMensais,
        projecaoPosAposentadoria,  // ✅ NOVO: projeção pós-aposentadoria
        heranca,  // ✅ NOVO: valor da herança
        taxaAnualEscolhida,
        taxaMensalReal,  // ✅ NOVO: para uso no gráfico
        perfil,
        tipoRenda,
        estrategia,
        anosPeriodo,  // ✅ NOVO: para exibição
        curvasExtras: null,  // ✅ SIMPLIFICAÇÃO: Curvas extras removidas
        idadeFinal: 95,  // ✅ SIMPLIFICAÇÃO: Sempre 95 anos
        rendaMensalDetalhada,
        rendasMensaisExtras: [],  // ✅ SIMPLIFICAÇÃO: Removidas
        idadeAposentadoria: idadeAposent
    };
}

// ===============================================================
// 🟧 GERAR RENDA MENSAL AO LONGO DO TEMPO
// ===============================================================
function gerarRendaMensalAoLongoDoTempo(patrimonio, taxaAnualReal, idadeApos, idadeFinal, estrategia) {
    const meses = (idadeFinal - idadeApos) * 12;
    const taxaMensal = Math.pow(1 + taxaAnualReal, 1/12) - 1;

    let rendaMensal = [];
    let patrimonioAtual = patrimonio;

    // Estratégia PERPÉTUA (capital preservado)
    if (estrategia === "perpetua") {
        const renda = patrimonio * taxaMensal;
        for (let i = 0; i < meses; i++) {
            rendaMensal.push(renda);
        }
        return rendaMensal;
    }

    // Estratégia PRESERVAR 20% (capital desce até 20% do inicial)
    // ✅ CORREÇÃO: Usar a mesma fórmula de calcularRendaPreservar20 para consistência
    if (estrategia === "preservar20") {
        const H = patrimonio * 0.20; // Herança = 20% do patrimônio inicial
        const i = taxaMensal;
        
        // Fórmula exata do PMT com valor residual FV (mesma de calcularRendaPreservar20)
        // PMT = [PV - FV/(1+i)^n] * [i / (1 - (1+i)^-n)]
        const fator_n = Math.pow(1 + i, meses);
        const renda = (patrimonio - H / fator_n) * i / (1 - 1 / fator_n);
        
        for (let i = 0; i < meses; i++) {
            rendaMensal.push(renda);
        }
        return rendaMensal;
    }

    // Estratégia ESGOTÁVEL (capital será consumido)
    const rendaPMT = (patrimonioAtual * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));

    for (let i = 0; i < meses; i++) {
        rendaMensal.push(rendaPMT);
        patrimonioAtual = patrimonioAtual * (1 + taxaMensal) - rendaPMT;
        if (patrimonioAtual < 0) patrimonioAtual = 0;
    }

    return rendaMensal;
}

// ===============================================================
// EXPORTAR PARA O WIZARD (ATUALIZADO)
// ===============================================================

if (typeof window !== "undefined") {
    window.executarSimulacaoWizard = executarSimulacaoWizard;
    window.gerarRendaMensalAoLongoDoTempo = gerarRendaMensalAoLongoDoTempo;
    window.PERFIS_RENTABILIDADE = PERFIS_RENTABILIDADE; // ← NOVA EXPORTAÇÃO
}

