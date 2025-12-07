// ======================================================================
//  SIMULADOR PRO — ENGINE UNIFICADA (versão baseada no Wizard)
// ======================================================================

// Converte taxa anual para taxa mensal efetiva
function taxaMensalEfetiva(taxaAnual) {
    return Math.pow(1 + taxaAnual, 1 / 12) - 1;
}

// Acumulação mensal até a aposentadoria (igual ao Wizard)
// ✅ NOVO: Suporta taxa administrativa (taxaAdmMensal)
function projetarAcumulacaoMensal(idadeAtual, idadeApos, aporteMensal, aporteAnual, patrimonioAtual, taxaMensal, taxaAdmMensal = 0) {
    const meses = (idadeApos - idadeAtual) * 12;
    const historico = [];
    let saldo = Number(patrimonioAtual);  // Começa com patrimônio inicial

    // Adicionar ponto inicial (mês 0)
    historico.push(saldo);

    // Loop começa em m=1 (igual ao Wizard)
    for (let m = 1; m <= meses; m++) {
        // ✅ CORREÇÃO: Taxa administrativa reduz o retorno, não o saldo diretamente
        // Taxa efetiva = taxa nominal - taxa administrativa
        const taxaEfetivaMensal = taxaMensal - taxaAdmMensal;
        
        // Aplica juros (com taxa reduzida pela administrativa) e adiciona aporte mensal
        saldo = saldo * (1 + taxaEfetivaMensal) + Number(aporteMensal);

        // Aporte extra anual no final de cada ano (m % 12 === 0)
        if (aporteAnual > 0 && m % 12 === 0) {
            saldo += Number(aporteAnual);
        }

        historico.push(saldo);
    }

    return { historico, saldoFinal: saldo };
}

// Renda vitalícia (preserva capital)
function rendaVitalicia(patrimonio, taxaMensal) {
    return patrimonio * taxaMensal;
}

// Renda que zera capital em N anos
function rendaPorPeriodo(patrimonio, taxaMensal, anos) {
    const meses = anos * 12;
    return patrimonio * (taxaMensal / (1 - Math.pow(1 + taxaMensal, -meses)));
}

// Projeção do patrimônio consumindo capital (curva descendente)
function projetarPatrimonioConsumo(patrimonioInicial, rendaMensal, taxaMensal, anos) {
    const historico = [];
    let saldo = patrimonioInicial;
    const meses = anos * 12;

    for (let i = 0; i <= meses; i++) {
        historico.push(saldo);

        saldo = saldo * (1 + taxaMensal) - rendaMensal;

        if (saldo < 0) saldo = 0;
    }

    return historico;
}

// Projeção do patrimônio preservando capital (linha horizontal)
function projetarPatrimonioPreservado(patrimonio, idadeAtual, idadeApos, idadeFinal) {
    const anos = idadeFinal - idadeApos;
    const meses = anos * 12;
    const historico = [];

    for (let i = 0; i <= meses; i++) historico.push(patrimonio);

    return historico;
}

// Estimativa do INSS (40% da renda desejada por padrão)
// Lógica: "" (vazio) = auto (40%), "0" ou 0 = ignorar, número > 0 = usar
function estimarINSS(rendaDesejada, inssInformado) {
    // Se for string vazia ou null/undefined → estimar automaticamente
    if (!inssInformado || inssInformado === "" || inssInformado === null) {
        return rendaDesejada * 0.40;
    }
    
    // Converter para número
    const valorNumerico = parseFloat(inssInformado);
    
    // Se for NaN ou <= 0 → ignorar INSS (retornar 0)
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
        return 0;
    }
    
    // Se for número válido > 0 → usar o valor informado
    return valorNumerico;
}

// Gerar renda mensal ao longo do tempo (para gráficos)
// ✅ CORREÇÃO: Suportar os 3 casos (igual ao Wizard)
function gerarRendaMensalAoLongoDoTempo(patrimonio, taxaAnualReal, idadeApos, idadeFinal, estrategia) {
    const meses = (idadeFinal - idadeApos) * 12;
    const taxaMensal = Math.pow(1 + taxaAnualReal, 1/12) - 1;

    let rendaMensal = [];
    let patrimonioAtual = patrimonio;

    // Estratégia PERPÉTUA (capital preservado)
    if (estrategia === "perpetua" || estrategia === undefined) {
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
    // ✅ CORREÇÃO: Calcular com taxa REAL (igual ao gráfico do Wizard)
    // Isso garante que o gráfico e o card mostrem o mesmo valor (R$ 7.120)
    const rendaPMT = (patrimonioAtual * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));

    for (let i = 0; i < meses; i++) {
        rendaMensal.push(rendaPMT);
        patrimonioAtual = patrimonioAtual * (1 + taxaMensal) - rendaPMT;
        if (patrimonioAtual < 0) patrimonioAtual = 0;
    }

    return rendaMensal;
}

// Constante de inflação média
const INFLACAO_MEDIA = 0.045; // 4.5% a.a. (decimal, igual ao Wizard)

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
// 🔧 FUNÇÕES AUXILIARES PARA CURVAS ESGOTÁVEIS
// ============================================================

// Função auxiliar — calcular PMT esgotável para um n meses (usa taxa NOMINAL)
function calcularPMTEsgotavel(pv, taxaMensal, meses) {
    if (meses <= 0) return 0;

    // Fórmula do PMT para esgotar capital (renda esgotável)
    const fator = Math.pow(1 + taxaMensal, meses);
    const pmt = pv * (taxaMensal * fator) / (fator - 1);

    return pmt;
}

// Função auxiliar — projetar curva usando PMT específico (usa taxa NOMINAL)
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

// Exporte funções
window.simuladorProEngine = {
    taxaMensalEfetiva,
    projetarAcumulacaoMensal,
    rendaVitalicia,
    rendaPorPeriodo,
    projetarPatrimonioConsumo,
    projetarPatrimonioPreservado,
    estimarINSS
};

// ======================================================================
// EXECUTAR SIMULAÇÃO COMPLETA (Engine PRO)
// ======================================================================
window.simuladorProEngine.executarSimulacaoCompleta = function (params) {
    const {
        idadeAtual,
        idadeApos,
        idadeFinal,
        aporteMensal,
        aporteAnual,
        patrimonioInicial,
        retornoAnual,
        tipoRenda,
        estrategia,  // ✅ NOVO: estratégia (perpetua ou esgotavel)
        anosPeriodo,
        rendaDesejada,
        inssInformado,
        taxaAdmAnual = 0  // ✅ NOVO: taxa administrativa anual (decimal, ex: 0.015 para 1.5%)
    } = params;

    // ✅ PADRONIZAÇÃO: Sempre usar 95 anos como idade final (igual ao Wizard)
    const idadeFinalUsada = 95;

    // ============================================================
    // TAXAS: NOMINAL para acumulação, REAL para renda
    // ============================================================
    // Taxa NOMINAL mensal (para acumulação) - igual ao Wizard
    const taxaMensalNominal = taxaMensalEfetiva(retornoAnual);
    
    // Taxa REAL mensal (para cálculo de renda) - igual ao Wizard
    const taxaAnualReal = retornoAnual - INFLACAO_MEDIA; // INFLACAO_MEDIA já é decimal (0.045)
    const taxaMensalReal = taxaMensalEfetiva(taxaAnualReal);

    // ============================================================
    // 1. ACUMULAÇÃO ATÉ A APOSENTADORIA (usa taxa NOMINAL)
    // ============================================================
    // ✅ NOVO: Converter taxa administrativa anual para mensal
    const taxaAdmMensal = taxaMensalEfetiva(taxaAdmAnual);
    
    const acumulacao = projetarAcumulacaoMensal(
        idadeAtual,
        idadeApos,
        aporteMensal,
        aporteAnual,
        patrimonioInicial,
        taxaMensalNominal,  // ✅ CORREÇÃO: usar taxa NOMINAL na acumulação
        taxaAdmMensal  // ✅ NOVO: aplicar taxa administrativa
    );
    const patrimonioFinal = acumulacao.saldoFinal;

    // ============================================================
    // 2. CÁLCULO DA RENDA MENSAL (baseado na estratégia, igual ao Wizard)
    // ============================================================
    // Determinar estratégia final
    const estrategiaFinal = estrategia || (tipoRenda === "vitalicia" ? "perpetua" : "perpetua");
    
    let rendaRealPossivel = 0;
    
    // ✅ CORREÇÃO: Detectar Caso 2 PRIMEIRO (periodo + perpetua + idadeFinal > idadeApos)
    // ESTRATÉGIA 1: RENDA VITALÍCIA + PRESERVAR CAPITAL
    if (tipoRenda === "vitalicia" && estrategiaFinal === "perpetua") {
        rendaRealPossivel = patrimonioFinal * taxaMensalReal;
    }
    // ESTRATÉGIA 2: RENDA POR PERÍODO + PRESERVAR CAPITAL (PRESERVAR 20%)
    // ✅ CORREÇÃO CRÍTICA: Detectar Caso 2 corretamente
    else if (tipoRenda === "periodo" && estrategiaFinal === "perpetua" && idadeFinalUsada > idadeApos) {
        // CASO 2: Renda por período + preservar capital até idadeFinal
        // Renda intermediária que consome capital gradualmente até 20% aos 95 anos
        const calc = calcularRendaPreservar20(
            patrimonioFinal,
            taxaMensalReal,
            idadeApos,
            idadeFinalUsada
        );
        rendaRealPossivel = calc.rendaMensal;
    }
    // ESTRATÉGIA 2 (fallback): RENDA POR PERÍODO + PRESERVAR CAPITAL (sem idadeFinal)
    else if (tipoRenda === "periodo" && estrategiaFinal === "perpetua") {
        // Sem idadeFinal: renda vitalícia (só juros, patrimônio constante)
        rendaRealPossivel = patrimonioFinal * taxaMensalReal;
    }
    // ESTRATÉGIA 3: RENDA POR PERÍODO + USAR CAPITAL GRADUALMENTE (ESGOTÁVEL)
    // ✅ CORREÇÃO CRÍTICA: Usar taxa REAL para esgotável (igual ao gráfico do Wizard)
    // O gráfico usa gerarRendaMensalAoLongoDoTempo que calcula com taxa REAL
    // Por isso devemos usar taxa REAL aqui também para manter consistência
    else if (tipoRenda === "periodo" && estrategiaFinal === "esgotavel") {
        const meses = (idadeFinalUsada - idadeApos) * 12;
        // PMT usando **taxa REAL** – CORRETO (igual ao gráfico do Wizard)
        // Isso garante que o card mostre o mesmo valor do gráfico (R$ 7.120)
        rendaRealPossivel = calcularPMTEsgotavel(
            patrimonioFinal,
            taxaMensalReal,  // ✅ CORREÇÃO: usar taxa REAL, não nominal
            meses
        );
    }
    // ESTRATÉGIA 4: RENDA VITALÍCIA + USAR CAPITAL GRADUALMENTE (não recomendado, mas tratado)
    // ✅ CORREÇÃO CRÍTICA: Usar taxa REAL para esgotável (igual ao gráfico do Wizard)
    else if (tipoRenda === "vitalicia" && estrategiaFinal === "esgotavel") {
        const meses = (idadeFinalUsada - idadeApos) * 12;
        // PMT usando **taxa REAL** – CORRETO (igual ao gráfico do Wizard)
        rendaRealPossivel = calcularPMTEsgotavel(
            patrimonioFinal,
            taxaMensalReal,  // ✅ CORREÇÃO: usar taxa REAL, não nominal
            meses
        );
    }
    // Fallback: vitalícia perpétua
    else {
        rendaRealPossivel = patrimonioFinal * taxaMensalReal;
    }
    
    // Manter compatibilidade com código existente
    const rendaVital = rendaRealPossivel;  // Para compatibilidade
    const rendaPeriodoMensal = tipoRenda === "periodo" ? rendaRealPossivel : 0;

    // ============================================================
    // ✅ CORREÇÃO CRÍTICA: Variável única para exibição no card
    // ============================================================
    // Esta variável garante que todos os casos (1, 2 e 3) usem a mesma fonte
    // NUNCA usar taxa nominal diretamente para calcular renda exibida
    // O rendaRealPossivel já foi calculado corretamente acima baseado na estratégia
    const rendaMensalFinal = rendaRealPossivel;

    // ============================================================
    // 3. CÁLCULO DO INSS
    // ============================================================
    const valorINSS = estimarINSS(rendaDesejada, inssInformado);

    // ============================================================
    // 4. PROJEÇÕES PÓS-APOSENTADORIA (igual ao Wizard)
    // ============================================================
    let projecaoPosAposentadoria = [];
    
    // ESTRATÉGIA 1: RENDA VITALÍCIA + PRESERVAR CAPITAL
    // Patrimônio permanece constante (só juros são consumidos)
    if (tipoRenda === "vitalicia" && estrategiaFinal === "perpetua") {
        // Calcular anos até 116 anos (padrão de longevidade estendido, igual ao Wizard)
        const idadeMaxima = 116;
        const anosProjecao = idadeMaxima - idadeApos;
        const meses = anosProjecao * 12;
        projecaoPosAposentadoria = [];
        for (let m = 0; m <= meses; m++) {
            projecaoPosAposentadoria.push({ mes: m, saldo: patrimonioFinal });
        }
    }
    // ESTRATÉGIA 2: RENDA POR PERÍODO + PRESERVAR CAPITAL (PRESERVAR 20%)
    // ✅ CORREÇÃO CRÍTICA: Detectar Caso 2 corretamente
    else if (tipoRenda === "periodo" && estrategiaFinal === "perpetua" && idadeFinalUsada > idadeApos) {
        const anosAposAposentadoria = idadeFinalUsada - idadeApos;
        const meses = anosAposAposentadoria * 12;
        
        projecaoPosAposentadoria = projetarPatrimonioPreservar20(
            patrimonioFinal,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );
    }
    // ESTRATÉGIA 2 (fallback): RENDA POR PERÍODO + PRESERVAR CAPITAL (sem idadeFinal)
    else if (tipoRenda === "periodo" && estrategiaFinal === "perpetua") {
        // Sem idadeFinal, manter comportamento original (patrimônio constante)
        const anosAposAposentadoria = idadeFinalUsada - idadeApos;
        const meses = anosAposAposentadoria * 12;
        projecaoPosAposentadoria = [];
        for (let m = 0; m <= meses; m++) {
            projecaoPosAposentadoria.push({ mes: m, saldo: patrimonioFinal });
        }
    }
    // ESTRATÉGIA 3: RENDA POR PERÍODO + USAR CAPITAL GRADUALMENTE (ESGOTÁVEL)
    // ✅ CORREÇÃO: Usar taxa REAL e projetarCurvaEsgotavel (igual ao gráfico)
    else if (tipoRenda === "periodo" && estrategiaFinal === "esgotavel") {
        const meses = (idadeFinalUsada - idadeApos) * 12;
        // Curva esgotável usando taxa REAL (igual ao gráfico)
        projecaoPosAposentadoria = projetarCurvaEsgotavel(
            patrimonioFinal,
            rendaRealPossivel,
            taxaMensalReal,  // ✅ CORREÇÃO: usar taxa REAL, não nominal
            meses
        );
    }
    // ESTRATÉGIA 4: RENDA VITALÍCIA + USAR CAPITAL GRADUALMENTE (não recomendado)
    // ✅ CORREÇÃO: Usar taxa REAL e projetarCurvaEsgotavel (igual ao gráfico)
    else if (tipoRenda === "vitalicia" && estrategiaFinal === "esgotavel") {
        const meses = (idadeFinalUsada - idadeApos) * 12;
        // Curva esgotável usando taxa REAL (igual ao gráfico)
        projecaoPosAposentadoria = projetarCurvaEsgotavel(
            patrimonioFinal,
            rendaRealPossivel,
            taxaMensalReal,  // ✅ CORREÇÃO: usar taxa REAL, não nominal
            meses
        );
    }
    // Fallback: vitalícia perpétua
    else {
        const anosAposAposentadoria = idadeFinalUsada - idadeApos;
        const meses = anosAposAposentadoria * 12;
        projecaoPosAposentadoria = [];
        for (let m = 0; m <= meses; m++) {
            projecaoPosAposentadoria.push({ mes: m, saldo: patrimonioFinal });
        }
    }
    
    // Manter compatibilidade com código existente
    let curvaVitalicia = [];
    let curvaConsumo = [];
    if (projecaoPosAposentadoria.length > 0) {
        // Converter para formato antigo se necessário
        curvaVitalicia = projecaoPosAposentadoria.map(p => p.saldo);
        curvaConsumo = projecaoPosAposentadoria.map(p => p.saldo);
    }

    // ============================================================
    // 5. HERANÇA (baseada na estratégia, igual ao Wizard)
    // ============================================================
    let heranca = 0;
    
    // Caso 1 — patrimônio permanece intacto
    if (tipoRenda === "vitalicia" && estrategiaFinal === "perpetua") {
        heranca = patrimonioFinal;
    }
    // Caso 2 — preservar 20% do patrimônio inicial
    else if (tipoRenda === "periodo" && estrategiaFinal === "perpetua" && idadeFinalUsada > idadeApos) {
        heranca = patrimonioFinal * 0.20;
    }
    // Caso 3 — esgotável: pegar o saldo final real
    else {
        heranca = projecaoPosAposentadoria?.[projecaoPosAposentadoria.length - 1]?.saldo || 0;
    }

    // ============================================================
    // 6. GERAR RENDA MENSAL DETALHADA (para gráficos)
    // ============================================================
    // ✅ CORREÇÃO: Para Caso 2 (periodo + perpetua + idadeFinal), usar estratégia "preservar20"
    let estrategiaParaRenda = estrategiaFinal;
    if (tipoRenda === "periodo" && estrategiaFinal === "perpetua" && idadeFinalUsada > idadeApos) {
        estrategiaParaRenda = "preservar20";
    }
    
    // ✅ CORREÇÃO: Gerar renda mensal detalhada para gráficos
    // Para esgotável, não precisa passar rendaJaCalculada pois agora rendaRealPossivel já usa taxa REAL
    const rendaMensalDetalhada = gerarRendaMensalAoLongoDoTempo(
        patrimonioFinal,
        taxaAnualReal,
        idadeApos,
        idadeFinalUsada,
        estrategiaParaRenda
    );

    // ============================================================
    // 7. OBJETO FINAL
    // ============================================================
    return {
        patrimonioFinal,
        rendaVital,  // Mantido para compatibilidade
        rendaPeriodoMensal,  // Mantido para compatibilidade
        rendaRealPossivel,  // ✅ NOVO: renda calculada baseada na estratégia (igual ao Wizard)
        rendaMensalFinal,  // ✅ CORREÇÃO CRÍTICA: Variável única para exibição no card (sempre igual a rendaRealPossivel)
        valorINSS,
        acumulacaoMensal: acumulacao.historico,
        curvaVitalicia,  // Mantido para compatibilidade
        curvaConsumo,  // Mantido para compatibilidade
        projecaoPosAposentadoria,  // ✅ NOVO: projeção pós-aposentadoria (formato igual ao Wizard)
        anosPeriodo,
        idadeFinal: idadeFinalUsada,  // ✅ PADRONIZADO: sempre 95
        rendaTotalVital: rendaRealPossivel + valorINSS,  // ✅ CORREÇÃO: usar rendaRealPossivel
        rendaTotalPeriodo: rendaRealPossivel + valorINSS,  // ✅ CORREÇÃO: usar rendaRealPossivel
        heranca,
        rendaMensalDetalhada,  // ✅ NOVO: renda mensal detalhada para gráficos
        taxaMensalReal,  // ✅ CORREÇÃO: taxa mensal REAL (para cálculos de renda)
        taxaMensalNominal,  // ✅ NOVO: taxa mensal NOMINAL (para acumulação e esgotável)
        tipoRenda,  // ✅ NOVO: tipo de renda selecionado
        estrategia: estrategiaFinal  // ✅ CORREÇÃO: estratégia final determinada
    };
};

// =====================================================
// 📊 FUNÇÕES PARA ACORDEON 3 - COMPARAÇÕES
// =====================================================

/**
 * Calcula acumulação de previdência privada (com taxa administrativa de 2% a.a.)
 * @param {number} aporteMensal - Aporte mensal
 * @param {number} anos - Anos de acumulação
 * @param {number} retornoAnual - Retorno anual nominal (ex: 0.08 para 8%)
 * @param {number} patrimonioInicial - Patrimônio inicial (opcional, padrão 0)
 * @param {number} aporteExtraAnual - Aporte extra anual (opcional, padrão 0)
 * @returns {Object} {nominal: valorNominal, real: valorReal}
 */
function acumulacaoPrevidencia(aporteMensal, anos, retornoAnual, patrimonioInicial = 0, aporteExtraAnual = 0) {
    // Taxa líquida após descontar 2% de taxa administrativa
    const taxaLiquida = retornoAnual - 0.02;
    
    // Converter para taxa mensal
    const taxaMensal = taxaMensalEfetiva(taxaLiquida);
    const taxaMensalInflacao = taxaMensalEfetiva(INFLACAO_MEDIA);
    const meses = anos * 12;
    
    let valorNominal = Number(patrimonioInicial);
    
    for (let m = 1; m <= meses; m++) {
        valorNominal = valorNominal * (1 + taxaMensal) + aporteMensal;
        
        // Aporte extra anual no final de cada ano
        if (aporteExtraAnual > 0 && m % 12 === 0) {
            valorNominal += Number(aporteExtraAnual);
        }
    }
    
    // Calcular valor real (descontando inflação)
    const valorReal = valorNominal / Math.pow(1 + INFLACAO_MEDIA, anos);
    
    return { nominal: valorNominal, real: valorReal };
}

/**
 * Calcula renda vitalícia (simples ou reversível)
 * @param {number} patrimonio - Patrimônio acumulado
 * @param {number} retornoAnual - Retorno anual nominal (ex: 0.08 para 8%)
 * @param {string} tipo - "simples" ou "reversivel"
 * @returns {number} Renda mensal vitalícia
 */
function rendaVitaliciaComparacao(patrimonio, retornoAnual, tipo) {
    // Taxa mensal nominal (aproximada)
    const taxaMensal = retornoAnual / 12;
    
    // Fatores: simples = 1.20 (renda maior, consome capital), reversivel = 0.80 (renda menor, preserva mais)
    const fator = tipo === "simples" ? 1.20 : 0.80;
    
    return patrimonio * taxaMensal * fator;
}

/**
 * Calcula todas as comparações do Acordeão 3
 * @param {Object} resultadoSimulacao - Resultado da simulação principal
 * @param {number} aporteMensal - Aporte mensal usado na simulação
 * @param {number} anos - Anos até aposentadoria
 * @param {number} retornoAnual - Retorno anual nominal
 * @returns {Object} Objeto com todos os valores de comparação
 */
function calcularComparacoesAcordeao3(resultadoSimulacao, aporteMensal, anos, retornoAnual) {
    // 1. Acumulação de previdência privada (com taxa de 2%)
    const prev = acumulacaoPrevidencia(aporteMensal, anos, retornoAnual);
    
    // 2. Renda vitalícia simples (consome capital)
    const rendaPrevSimples = rendaVitaliciaComparacao(prev.nominal, retornoAnual, "simples");
    
    // 3. Renda vitalícia reversível (preserva mais capital)
    const rendaPrevRev = rendaVitaliciaComparacao(prev.nominal, retornoAnual, "reversivel");
    
    // 4. Herança do investimento próprio (vem do resultado da simulação)
    const herancaOwn = resultadoSimulacao.heranca || 0;
    
    // 5. Herança da vitalícia reversível (20% do patrimônio nominal)
    const herancaRev = prev.nominal * 0.20;
    
    // 6. Herança da vitalícia simples (sempre 0, pois consome todo o capital)
    const herancaSimple = 0;
    
    return {
        // Patrimônios acumulados
        patrimonioProprio: resultadoSimulacao.patrimonioFinal || 0,
        patrimonioPrevidencia: prev.nominal,
        
        // Rendas mensais
        rendaProprio: resultadoSimulacao.rendaMensalFinal || resultadoSimulacao.rendaRealPossivel || 0,
        rendaPrevSimples: rendaPrevSimples,
        rendaPrevRev: rendaPrevRev,
        
        // Heranças
        herancaOwn: herancaOwn,
        herancaRev: herancaRev,
        herancaSimple: herancaSimple,
        
        // Dados auxiliares
        prev: prev
    };
}

// ✅ Adicionar funções do Acordeão 3 ao objeto exportado
window.simuladorProEngine.calcularComparacoesAcordeao3 = calcularComparacoesAcordeao3;
window.simuladorProEngine.acumulacaoPrevidencia = acumulacaoPrevidencia;
window.simuladorProEngine.rendaVitaliciaComparacao = rendaVitaliciaComparacao;

// =====================================================
// 🚨 FUNÇÕES PARA ACORDEON 4 - PREVIDÊNCIA PRIVADA
// =====================================================

/**
 * Calcula os modelos de previdência privada baseados no patrimônio final
 * @param {number} patrimonioFinal - Patrimônio final do cenário base
 * @param {number} rendaMensal - Renda mensal do cenário base
 * @returns {Object} Objeto com os resultados dos modelos 1 e 2
 */
function calcularModelosPrevidencia(patrimonioFinal, rendaMensal) {
    // Modelo 1 – taxas altas
    let taxaAdm1 = 0.02;      // 2% a.a.
    let carregamento1 = 0.02; // 2% sobre aportes
    let custos1 = 0.005;      // 0.5% a.a.
    let reducao1 = patrimonioFinal * (taxaAdm1 + custos1);
    let patrimonio1 = patrimonioFinal - reducao1;
    let renda1 = rendaMensal * (patrimonio1 / patrimonioFinal);

    // Modelo 2 – taxas moderadas
    let taxaAdm2 = 0.01;
    let carregamento2 = 0.00;
    let custos2 = 0.003;
    let reducao2 = patrimonioFinal * (taxaAdm2 + custos2);
    let patrimonio2 = patrimonioFinal - reducao2;
    let renda2 = rendaMensal * (patrimonio2 / patrimonioFinal);

    return {
        m1: { patrimonio: patrimonio1, renda: renda1 },
        m2: { patrimonio: patrimonio2, renda: renda2 }
    };
}

// ✅ Adicionar função ao objeto exportado
window.simuladorProEngine.calcularModelosPrevidencia = calcularModelosPrevidencia;

