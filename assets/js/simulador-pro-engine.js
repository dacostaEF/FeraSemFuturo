// ======================================================================
//  SIMULADOR PRO — ENGINE UNIFICADA (versão baseada no Wizard)
// ======================================================================

// Converte taxa anual para taxa mensal efetiva
function taxaMensalEfetiva(taxaAnual) {
    return Math.pow(1 + taxaAnual, 1 / 12) - 1;
}

// Acumulação mensal até a aposentadoria
function projetarAcumulacaoMensal(idadeAtual, idadeApos, aporteMensal, aporteAnual, patrimonioAtual, taxaMensal) {
    const meses = (idadeApos - idadeAtual) * 12;
    const historico = [];
    let saldo = patrimonioAtual;

    for (let m = 0; m <= meses; m++) {
        historico.push(saldo);

        saldo = saldo * (1 + taxaMensal);
        saldo += aporteMensal;

        if (m % 12 === 0 && m !== 0) {
            saldo += aporteAnual;
        }
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
        anosPeriodo,
        rendaDesejada,
        inssInformado
    } = params;

    // Valor padrão para idadeFinal se não fornecido
    const idadeFinalUsada = idadeFinal || (idadeApos + 30); // Padrão: 30 anos após aposentadoria

    // Conversões
    const taxaMensal = taxaMensalEfetiva(retornoAnual - (INFLACAO_MEDIA / 100));

    // ============================================================
    // 1. ACUMULAÇÃO ATÉ A APOSENTADORIA
    // ============================================================
    const acumulacao = projetarAcumulacaoMensal(
        idadeAtual,
        idadeApos,
        aporteMensal,
        aporteAnual,
        patrimonioInicial,
        taxaMensal
    );
    const patrimonioFinal = acumulacao.saldoFinal;

    // ============================================================
    // 2. CÁLCULO DA RENDA MENSAL (vitalícia e por período)
    // ============================================================
    const rendaVital = rendaVitalicia(patrimonioFinal, taxaMensal);
    let rendaPeriodoMensal = 0;
    if (tipoRenda === "periodo" && anosPeriodo > 0) {
        rendaPeriodoMensal = rendaPorPeriodo(patrimonioFinal, taxaMensal, anosPeriodo);
    }

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
            taxaMensal,
            anosPeriodo
        );
    }

    // ============================================================
    // 5. HERANÇA
    // ============================================================
    let heranca = 0;
    if (tipoRenda === "vitalicia") {
        heranca = patrimonioFinal; // capital preservado
    } else {
        heranca = 0;               // período = consome capital
    }

    // ============================================================
    // 6. GERAR RENDA MENSAL DETALHADA (para gráficos)
    // ============================================================
    const taxaAnualReal = retornoAnual - (INFLACAO_MEDIA / 100);
    const estrategia = tipoRenda === "vitalicia" ? "perpetua" : "esgotavel";
    const rendaMensalDetalhada = gerarRendaMensalAoLongoDoTempo(
        patrimonioFinal,
        taxaAnualReal,
        idadeApos,
        idadeFinalUsada,
        estrategia
    );

    // ============================================================
    // 7. OBJETO FINAL
    // ============================================================
    return {
        patrimonioFinal,
        rendaVital,
        rendaPeriodoMensal,
        valorINSS,
        acumulacaoMensal: acumulacao.historico,
        curvaVitalicia,
        curvaConsumo,
        anosPeriodo,
        idadeFinal: idadeFinalUsada,
        rendaTotalVital: rendaVital + valorINSS,
        rendaTotalPeriodo: rendaPeriodoMensal + valorINSS,
        heranca,
        rendaMensalDetalhada,  // 🟧 NOVO: renda mensal detalhada para gráficos
        taxaMensal,  // 🟧 NOVO: taxa mensal real para cálculos
        tipoRenda,  // 🟧 NOVO: tipo de renda selecionado
        estrategia  // 🟧 NOVO: estratégia (perpetua ou esgotavel)
    };
};

