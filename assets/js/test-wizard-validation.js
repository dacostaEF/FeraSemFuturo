// ================================================================
// 🧪 SCRIPT DE TESTE - VALIDAÇÃO DO WIZARD
// Execute este script no console do navegador após carregar a página
// ================================================================

console.log("🧪 INICIANDO TESTES DE VALIDAÇÃO DO WIZARD...\n");

// ================================================================
// TESTE 1: Verificar se as funções existem
// ================================================================
function testarFuncoesExistentes() {
    console.log("📋 TESTE 1: Verificando funções...");
    
    const funcoes = [
        'executarSimulacaoWizard',
        'acumulacaoComJuros',
        'projetarPatrimonioVitalicia',
        'projetarPatrimonioPorPeriodo'
    ];
    
    let todasExistem = true;
    funcoes.forEach(fn => {
        const existe = typeof window[fn] !== 'undefined' || typeof eval(fn) !== 'undefined';
        console.log(`  ${existe ? '✅' : '❌'} ${fn}`);
        if (!existe) todasExistem = false;
    });
    
    return todasExistem;
}

// ================================================================
// TESTE 2: Cenário A - Usuário sem patrimônio
// ================================================================
function testarCenarioA() {
    console.log("\n📋 TESTE 2: Cenário A - Usuário sem patrimônio");
    
    const dados = {
        idadeAtual: 30,
        idadeAposentadoria: 65,
        rendaAtual: 5000,
        rendaDesejada: 6000,
        gastosEssenciais: 3000,
        inssEstimado: 0,
        aporteMensal: 500,
        aporteExtraAnual: 0,
        perfilInvestidor: 'moderado',
        patrimonioAtual: 0,
        tipoRenda: 'vitalicia',
        estrategia: 'perpetua',
        anosPeriodo: 20,
        anosDuracao: 30
    };
    
    console.log("  Dados de entrada:", dados);
    
    // Teste Vitalícia
    dados.tipoRenda = 'vitalicia';
    dados.estrategia = 'perpetua';
    const resultadoVitalicia = window.executarSimulacaoWizard(dados);
    
    console.log("\n  💚 VITALÍCIA:");
    console.log(`    Patrimônio: R$ ${resultadoVitalicia.patrimonioTotalProjetado.toLocaleString('pt-BR')}`);
    console.log(`    Renda Mensal: R$ ${resultadoVitalicia.rendaRealPossivel.toFixed(2)}`);
    console.log(`    Herança: R$ ${resultadoVitalicia.heranca.toLocaleString('pt-BR')}`);
    console.log(`    Projeção pós-aposentadoria: ${resultadoVitalicia.projecaoPosAposentadoria.length} meses`);
    
    // Validações Vitalícia
    const vitaliciaOK = 
        resultadoVitalicia.heranca > 0 &&
        resultadoVitalicia.heranca === resultadoVitalicia.patrimonioTotalProjetado &&
        resultadoVitalicia.projecaoPosAposentadoria.length > 0 &&
        resultadoVitalicia.projecaoPosAposentadoria[0].saldo === resultadoVitalicia.patrimonioTotalProjetado;
    
    console.log(`  ${vitaliciaOK ? '✅' : '❌'} Validações Vitalícia: ${vitaliciaOK ? 'PASSOU' : 'FALHOU'}`);
    
    // Teste Período
    dados.tipoRenda = 'periodo';
    const resultadoPeriodo = window.executarSimulacaoWizard(dados);
    
    console.log("\n  ⏱️ PERÍODO (20 anos):");
    console.log(`    Patrimônio: R$ ${resultadoPeriodo.patrimonioTotalProjetado.toLocaleString('pt-BR')}`);
    console.log(`    Renda Mensal: R$ ${resultadoPeriodo.rendaRealPossivel.toFixed(2)}`);
    console.log(`    Herança: R$ ${resultadoPeriodo.heranca}`);
    console.log(`    Projeção pós-aposentadoria: ${resultadoPeriodo.projecaoPosAposentadoria.length} meses`);
    
    // Verificar se a renda do período é maior que vitalícia
    const rendaPeriodoMaior = resultadoPeriodo.rendaRealPossivel > resultadoVitalicia.rendaRealPossivel;
    
    // Verificar se o patrimônio chega a zero no final
    const ultimoMes = resultadoPeriodo.projecaoPosAposentadoria[resultadoPeriodo.projecaoPosAposentadoria.length - 1];
    const patrimonioZerou = ultimoMes.saldo <= 0.01; // Tolerância para arredondamento
    
    // Validações Período
    const periodoOK = 
        resultadoPeriodo.heranca === 0 &&
        rendaPeriodoMaior &&
        patrimonioZerou &&
        resultadoPeriodo.projecaoPosAposentadoria.length === (20 * 12) + 1;
    
    console.log(`  ${periodoOK ? '✅' : '❌'} Validações Período: ${periodoOK ? 'PASSOU' : 'FALHOU'}`);
    console.log(`    Renda período > vitalícia: ${rendaPeriodoMaior ? '✅' : '❌'}`);
    console.log(`    Patrimônio zerou: ${patrimonioZerou ? '✅' : '❌'} (último valor: R$ ${ultimoMes.saldo.toFixed(2)})`);
    
    return vitaliciaOK && periodoOK;
}

// ================================================================
// TESTE 3: Cenário B - Usuário com patrimônio alto
// ================================================================
function testarCenarioB() {
    console.log("\n📋 TESTE 3: Cenário B - Usuário com patrimônio alto (R$ 400k)");
    
    const dados = {
        idadeAtual: 40,
        idadeAposentadoria: 65,
        rendaAtual: 10000,
        rendaDesejada: 15000,
        gastosEssenciais: 5000,
        inssEstimado: 0,
        aporteMensal: 1000,
        aporteExtraAnual: 0,
        perfilInvestidor: 'moderado',
        patrimonioAtual: 400000,
        tipoRenda: 'periodo',
        estrategia: 'perpetua',
        anosPeriodo: 20,
        anosDuracao: 30
    };
    
    const resultado = window.executarSimulacaoWizard(dados);
    
    console.log("  Resultados:");
    console.log(`    Patrimônio: R$ ${resultado.patrimonioTotalProjetado.toLocaleString('pt-BR')}`);
    console.log(`    Renda Mensal: R$ ${resultado.rendaRealPossivel.toFixed(2)}`);
    console.log(`    Herança: R$ ${resultado.heranca}`);
    
    // Validações
    const patrimonioAlto = resultado.patrimonioTotalProjetado > 1000000; // Deve ser > 1M
    const rendaAlta = resultado.rendaRealPossivel > 5000; // Renda alta
    
    const cenarioBOK = patrimonioAlto && rendaAlta;
    
    console.log(`  ${cenarioBOK ? '✅' : '❌'} Validações: ${cenarioBOK ? 'PASSOU' : 'FALHOU'}`);
    console.log(`    Patrimônio alto: ${patrimonioAlto ? '✅' : '❌'}`);
    console.log(`    Renda alta: ${rendaAlta ? '✅' : '❌'}`);
    
    return cenarioBOK;
}

// ================================================================
// TESTE 4: Verificar retorno completo do motor
// ================================================================
function testarRetornoCompleto() {
    console.log("\n📋 TESTE 4: Verificar retorno completo do motor");
    
    const dados = {
        idadeAtual: 30,
        idadeAposentadoria: 65,
        rendaAtual: 5000,
        rendaDesejada: 6000,
        gastosEssenciais: 3000,
        inssEstimado: 0,
        aporteMensal: 500,
        aporteExtraAnual: 0,
        perfilInvestidor: 'moderado',
        patrimonioAtual: 0,
        tipoRenda: 'vitalicia',
        estrategia: 'perpetua',
        anosPeriodo: 20,
        anosDuracao: 30
    };
    
    const resultado = window.executarSimulacaoWizard(dados);
    
    const camposEsperados = [
        'anosAteAposentadoria',
        'patrimonioTotalProjetado',
        'rendaRealPossivel',
        'rendaTotalPrevista',
        'rendaDesejada',
        'heranca',
        'projecaoPosAposentadoria',
        'taxaMensalReal',
        'anosPeriodo',
        'tipoRenda',
        'estrategia'
    ];
    
    console.log("  Campos esperados no retorno:");
    let todosPresentes = true;
    camposEsperados.forEach(campo => {
        const existe = campo in resultado;
        console.log(`    ${existe ? '✅' : '❌'} ${campo}`);
        if (!existe) todosPresentes = false;
    });
    
    // Verificar tipos
    console.log("\n  Verificando tipos:");
    const tiposOK = 
        typeof resultado.heranca === 'number' &&
        Array.isArray(resultado.projecaoPosAposentadoria) &&
        typeof resultado.taxaMensalReal === 'number' &&
        typeof resultado.anosPeriodo === 'number';
    
    console.log(`    ${tiposOK ? '✅' : '❌'} Tipos corretos`);
    
    return todosPresentes && tiposOK;
}

// ================================================================
// TESTE 5: Verificar cálculo de taxa real
// ================================================================
function testarTaxaReal() {
    console.log("\n📋 TESTE 5: Verificar cálculo de taxa real");
    
    const dados = {
        idadeAtual: 30,
        idadeAposentadoria: 65,
        rendaAtual: 5000,
        rendaDesejada: 6000,
        gastosEssenciais: 3000,
        inssEstimado: 0,
        aporteMensal: 500,
        aporteExtraAnual: 0,
        perfilInvestidor: 'moderado', // 8% a.a.
        patrimonioAtual: 0,
        tipoRenda: 'vitalicia',
        estrategia: 'perpetua',
        anosPeriodo: 20,
        anosDuracao: 30
    };
    
    const resultado = window.executarSimulacaoWizard(dados);
    
    // Taxa nominal = 8% (0.08)
    // Inflação = 4.5% (0.045)
    // Taxa real esperada = 8% - 4.5% = 3.5% (0.035)
    const taxaRealEsperada = 0.035;
    const taxaRealCalculada = resultado.taxaAnualEscolhida - 0.045;
    const taxaMensalEsperada = Math.pow(1 + taxaRealEsperada, 1/12) - 1;
    
    console.log(`    Taxa nominal: ${(resultado.taxaAnualEscolhida * 100).toFixed(1)}%`);
    console.log(`    Taxa real esperada: ${(taxaRealEsperada * 100).toFixed(2)}%`);
    console.log(`    Taxa real calculada: ${(taxaRealCalculada * 100).toFixed(2)}%`);
    console.log(`    Taxa mensal real: ${(resultado.taxaMensalReal * 100).toFixed(4)}%`);
    
    const taxaOK = Math.abs(taxaRealCalculada - taxaRealEsperada) < 0.0001 &&
                   Math.abs(resultado.taxaMensalReal - taxaMensalEsperada) < 0.0001;
    
    console.log(`  ${taxaOK ? '✅' : '❌'} Cálculo de taxa: ${taxaOK ? 'PASSOU' : 'FALHOU'}`);
    
    return taxaOK;
}

// ================================================================
// EXECUTAR TODOS OS TESTES
// ================================================================
function executarTodosTestes() {
    console.log("=".repeat(60));
    console.log("🧪 EXECUTANDO SUITE COMPLETA DE TESTES\n");
    
    const resultados = {
        funcoes: testarFuncoesExistentes(),
        cenarioA: testarCenarioA(),
        cenarioB: testarCenarioB(),
        retornoCompleto: testarRetornoCompleto(),
        taxaReal: testarTaxaReal()
    };
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMO DOS TESTES:\n");
    
    Object.keys(resultados).forEach(teste => {
        const status = resultados[teste] ? '✅ PASSOU' : '❌ FALHOU';
        console.log(`  ${teste}: ${status}`);
    });
    
    const todosPassaram = Object.values(resultados).every(r => r === true);
    
    console.log("\n" + "=".repeat(60));
    console.log(todosPassaram ? "✅ TODOS OS TESTES PASSARAM!" : "❌ ALGUNS TESTES FALHARAM");
    console.log("=".repeat(60));
    
    return resultados;
}

// Exportar para uso no console
if (typeof window !== "undefined") {
    window.testarWizard = executarTodosTestes;
    window.testarCenarioA = testarCenarioA;
    window.testarCenarioB = testarCenarioB;
    console.log("\n💡 Para executar os testes, digite no console:");
    console.log("   testarWizard()");
}

