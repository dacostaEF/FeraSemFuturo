// ======================================================================
//  SIMULADOR PRO — ENGINE UNIFICADA (versão baseada no Wizard)
// ======================================================================

// Converte taxa anual para taxa mensal efetiva
function taxaMensalEfetiva(taxaAnual) {
    return Math.pow(1 + taxaAnual, 1 / 12) - 1;
}

// Acumulação mensal até a aposentadoria (igual ao Wizard)
function projetarAcumulacaoMensal(idadeAtual, idadeApos, aporteMensal, aporteAnual, patrimonioAtual, taxaMensal) {
    const meses = (idadeApos - idadeAtual) * 12;
    const historico = [];
    let saldo = Number(patrimonioAtual);  // Começa com patrimônio inicial

    // Adicionar ponto inicial (mês 0)
    historico.push(saldo);

    // Loop começa em m=1 (igual ao Wizard)
    for (let m = 1; m <= meses; m++) {
        // Aplica juros e adiciona aporte mensal
        saldo = saldo * (1 + taxaMensal) + Number(aporteMensal);

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

    // Estratégia ESGOTÁVEL (capital será consumido)
    const rendaPMT = (patrimonioAtual * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));

    for (let i = 0; i < meses; i++) {
        rendaMensal.push(rendaPMT);
        patrimonioAtual = patrimonioAtual * (1 + taxaMensal) - rendaPMT;
        if (patrimonioAtual < 0) patrimonioAtual = 0;
    }

    return rendaMensal;
}

// Constante de inflação média
const INFLACAO_MEDIA = 4.5; // 4.5% a.a.

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
        inssInformado
    } = params;

    // Valor padrão para idadeFinal se não fornecido
    const idadeFinalUsada = idadeFinal || (idadeApos + 30); // Padrão: 30 anos após aposentadoria

    // ============================================================
    // TAXAS: NOMINAL para acumulação, REAL para renda
    // ============================================================
    // Taxa NOMINAL mensal (para acumulação) - igual ao Wizard
    const taxaMensalNominal = taxaMensalEfetiva(retornoAnual);
    
    // Taxa REAL mensal (para cálculo de renda) - igual ao Wizard
    const taxaAnualReal = retornoAnual - (INFLACAO_MEDIA / 100);
    const taxaMensalReal = taxaMensalEfetiva(taxaAnualReal);

    // ============================================================
    // 1. ACUMULAÇÃO ATÉ A APOSENTADORIA (usa taxa NOMINAL)
    // ============================================================
    const acumulacao = projetarAcumulacaoMensal(
        idadeAtual,
        idadeApos,
        aporteMensal,
        aporteAnual,
        patrimonioInicial,
        taxaMensalNominal  // ✅ CORREÇÃO: usar taxa NOMINAL na acumulação
    );
    const patrimonioFinal = acumulacao.saldoFinal;

    // ============================================================
    // 2. CÁLCULO DA RENDA MENSAL (baseado na estratégia, igual ao Wizard)
    // ============================================================
    // Determinar estratégia final
    const estrategiaFinal = estrategia || (tipoRenda === "vitalicia" ? "perpetua" : "perpetua");
    
    let rendaRealPossivel = 0;
    
    // ESTRATÉGIA 1: RENDA VITALÍCIA + PRESERVAR CAPITAL
    if (tipoRenda === "vitalicia" && estrategiaFinal === "perpetua") {
        rendaRealPossivel = patrimonioFinal * taxaMensalReal;
    }
    // ESTRATÉGIA 2: RENDA POR PERÍODO + PRESERVAR CAPITAL
    else if (tipoRenda === "periodo" && estrategiaFinal === "perpetua") {
        rendaRealPossivel = patrimonioFinal * taxaMensalReal;
    }
    // ESTRATÉGIA OTIMIZADA: RENDA POR PERÍODO COM LONGEVIDADE (idadeFinal)
    else if (tipoRenda === "periodo" && idadeFinalUsada) {
        const meses = (idadeFinalUsada - idadeApos) * 12;
        if (taxaMensalReal > 0 && meses > 0) {
            rendaRealPossivel = (patrimonioFinal * taxaMensalReal) / (1 - Math.pow(1 + taxaMensalReal, -meses));
        } else {
            rendaRealPossivel = patrimonioFinal / meses;
        }
    }
    // ESTRATÉGIA 3: RENDA POR PERÍODO + USAR CAPITAL GRADUALMENTE
    else if (tipoRenda === "periodo" && estrategiaFinal === "esgotavel") {
        let meses;
        if (idadeFinalUsada) {
            meses = (idadeFinalUsada - idadeApos) * 12;
        } else {
            meses = anosPeriodo * 12;
        }
        if (taxaMensalReal > 0 && meses > 0) {
            rendaRealPossivel = (patrimonioFinal * taxaMensalReal) / (1 - Math.pow(1 + taxaMensalReal, -meses));
        } else {
            rendaRealPossivel = patrimonioFinal / meses;
        }
    }
    // ESTRATÉGIA 4: RENDA VITALÍCIA + USAR CAPITAL GRADUALMENTE (não recomendado, mas tratado)
    else if (tipoRenda === "vitalicia" && estrategiaFinal === "esgotavel") {
        let meses;
        if (idadeFinalUsada) {
            meses = (idadeFinalUsada - idadeApos) * 12;
        } else {
            meses = 30 * 12; // fallback: 30 anos
        }
        if (taxaMensalReal > 0 && meses > 0) {
            rendaRealPossivel = (patrimonioFinal * taxaMensalReal) / (1 - Math.pow(1 + taxaMensalReal, -meses));
        } else {
            rendaRealPossivel = patrimonioFinal / meses;
        }
    }
    // Fallback: vitalícia perpétua
    else {
        rendaRealPossivel = patrimonioFinal * taxaMensalReal;
    }
    
    // Manter compatibilidade com código existente
    const rendaVital = rendaRealPossivel;  // Para compatibilidade
    const rendaPeriodoMensal = tipoRenda === "periodo" ? rendaRealPossivel : 0;

    // ============================================================
    // 3. CÁLCULO DO INSS
    // ============================================================
    const valorINSS = estimarINSS(rendaDesejada, inssInformado);

    // ============================================================
    // 4. PROJEÇÕES PÓS-APOSENTADORIA
    // ============================================================
    let curvaVitalicia = projetarPatrimonioPreservado(
        patrimonioFinal, idadeAtual, idadeApos, idadeFinalUsada
    );
    let curvaConsumo = [];
    if (tipoRenda === "periodo" && anosPeriodo > 0) {
        curvaConsumo = projetarPatrimonioConsumo(
            patrimonioFinal,
            rendaPeriodoMensal,
            taxaMensalReal,  // ✅ CORREÇÃO: usar taxa REAL
            anosPeriodo
        );
    }

    // ============================================================
    // 5. HERANÇA (baseada na estratégia, não no tipo de renda)
    // ============================================================
    let heranca = 0;
    // estrategiaFinal já foi determinada acima (linha 186)
    
    // Herança = patrimônio preservado (não consumido)
    if (estrategiaFinal === "perpetua") {
        heranca = patrimonioFinal;  // Capital preservado (vitalícia ou período com preservação)
    } else {
        heranca = 0;  // Capital consumido (esgotável)
    }

    // ============================================================
    // 6. GERAR RENDA MENSAL DETALHADA (para gráficos)
    // ============================================================
    // taxaAnualReal já foi calculada acima
    // estrategiaFinal já foi determinada acima
    const rendaMensalDetalhada = gerarRendaMensalAoLongoDoTempo(
        patrimonioFinal,
        taxaAnualReal,
        idadeApos,
        idadeFinalUsada,
        estrategiaFinal  // ✅ CORREÇÃO: usar estrategiaFinal
    );

    // ============================================================
    // 7. OBJETO FINAL
    // ============================================================
    return {
        patrimonioFinal,
        rendaVital,  // Mantido para compatibilidade
        rendaPeriodoMensal,  // Mantido para compatibilidade
        rendaRealPossivel,  // ✅ NOVO: renda calculada baseada na estratégia (igual ao Wizard)
        valorINSS,
        acumulacaoMensal: acumulacao.historico,
        curvaVitalicia,
        curvaConsumo,
        anosPeriodo,
        idadeFinal: idadeFinalUsada,
        rendaTotalVital: rendaRealPossivel + valorINSS,  // ✅ CORREÇÃO: usar rendaRealPossivel
        rendaTotalPeriodo: rendaRealPossivel + valorINSS,  // ✅ CORREÇÃO: usar rendaRealPossivel
        heranca,
        rendaMensalDetalhada,  // 🟧 NOVO: renda mensal detalhada para gráficos
        taxaMensalReal,  // ✅ CORREÇÃO: taxa mensal REAL (para cálculos de renda)
        tipoRenda,  // 🟧 NOVO: tipo de renda selecionado
        estrategia: estrategiaFinal  // ✅ CORREÇÃO: estratégia final determinada
    };
};

