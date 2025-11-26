// ===============================================================
//  SIMULADOR INVLAB - MOTOR COMPLETO (WIZARD)
//  Arquivo: simulador-wizard-engine.js
//  Autor: Noah | InvLab Premium
// ===============================================================

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
function acumulacaoComJuros(aporteMensal, anos, taxaAnual, aporteExtraAnual = 0) {
    const meses = anos * 12;
    const jurosMensal = taxaMensal(taxaAnual);
    let saldo = 0;

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
    const taxaMensalReal = taxaMensal(taxaAnual - INFLACAO_MEDIA);
    const meses = expectativaAnos * 12;

    if (taxaMensalReal <= 0) {
        return patrimonio / meses; // fallback
    }

    const rendaMensal = (patrimonio * taxaMensalReal) /
        (1 - Math.pow(1 + taxaMensalReal, -meses));

    return rendaMensal;
}

// Projeção mês a mês do patrimônio (para gráficos)
function projetarPatrimonioMensal(aporteMensal, anos, taxaAnual, aporteExtraAnual = 0) {
    const jurosMensal = taxaMensal(taxaAnual);
    const meses = anos * 12;
    let saldo = 0;
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

    // 2. Definir taxa anual baseada no perfil
    const taxaAnualEscolhida = PERFIS_RENTABILIDADE[perfil];

    // 3. Calcular o tempo até a aposentadoria
    const anosAteAposentadoria = idadeAposent - idadeAtual;

    // 4. Patrimônio acumulado até lá (com o que já tem + aportes futuros)
    const acumuladoAportes = acumulacaoComJuros(
        aporteMensal,
        anosAteAposentadoria,
        taxaAnualEscolhida,
        aporteExtraAnual
    );

    const patrimonioTotalProjetado = patrimonioAtual + acumuladoAportes;

    // 5. NOVO: Calcular renda baseada na estratégia escolhida
    const taxaAnualReal = taxaAnualEscolhida - INFLACAO_MEDIA;
    const taxaMensalReal = Math.pow(1 + taxaAnualReal, 1/12) - 1;

    let rendaRealPossivel = 0;

    // Estratégia 1: Vitalícia perpétua (só juros, capital preservado)
    if (tipoRenda === "vitalicia" && estrategia === "perpetua") {
        rendaRealPossivel = patrimonioTotalProjetado * taxaMensalReal;
    }

    // Estratégia 2: Período determinado ou esgotável (consome capital com juros)
    else if (tipoRenda === "periodo" || estrategia === "esgotavel") {
        const anos = tipoRenda === "periodo" ? anosPeriodo : anosDuracao;
        const meses = anos * 12;
        
        if (taxaMensalReal > 0) {
            rendaRealPossivel = (patrimonioTotalProjetado * taxaMensalReal) / 
                               (1 - Math.pow(1 + taxaMensalReal, -meses));
        } else {
            // Fallback se taxa for zero ou negativa
            rendaRealPossivel = patrimonioTotalProjetado / meses;
        }
    }

    // Fallback: se nada definido, usa vitalícia
    else {
        rendaRealPossivel = patrimonioTotalProjetado * taxaMensalReal;
    }

    // 6. Projeção mês mês (gráficos)
    const dadosMensais = projetarPatrimonioMensal(
        aporteMensal,
        anosAteAposentadoria,
        taxaAnualEscolhida,
        aporteExtraAnual
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
    let aporteNecessario = null;
    if (deficitOuSobra < 0) {
        const meses = anosAteAposentadoria * 12;
        const juros = taxaMensal(taxaAnualEscolhida);
        
        let patrimonioNecessario = 0;
        patrimonioNecessario = patrimonioTotalProjetado + (Math.abs(deficitOuSobra) * 12);
        
        aporteNecessario = (patrimonioNecessario - patrimonioTotalProjetado) / meses;
    }

    // 11. Retornar objeto completo
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
        taxaAnualEscolhida,
        perfil,
        tipoRenda,
        estrategia
    };
}

// ===============================================================
// EXPORTAR PARA O WIZARD
// ===============================================================

if (typeof window !== "undefined") {
    window.executarSimulacaoWizard = executarSimulacaoWizard;
}

