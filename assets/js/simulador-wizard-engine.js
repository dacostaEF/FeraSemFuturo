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
    let saldo = patrimonioInicial;
    let dados = [];

    for (let m = 0; m <= mesesTotal; m++) {
        if (m === 0) {
            dados.push({ mes: m, saldo: saldo });
        } else {
            // Aplica juros e subtrai a renda mensal
            saldo = saldo * (1 + taxaMensalReal) - rendaMensal;
            if (saldo < 0) saldo = 0;  // Não pode ficar negativo
            
            dados.push({ mes: m, saldo: saldo });
        }
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
    const idadeFinal = Number(dadosWizard.idadeFinal) || null;  // Nova: idade de longevidade
    const mostrarTodasCurvas = dadosWizard.mostrarTodasCurvas || false;  // Nova: flag múltiplas curvas

    // 2. Definir taxa anual baseada no perfil
    const taxaAnualEscolhida = PERFIS_RENTABILIDADE[perfil];

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

    // 5. NOVO: Calcular renda baseada na estratégia escolhida
    const taxaAnualReal = taxaAnualEscolhida - INFLACAO_MEDIA;
    const taxaMensalReal = Math.pow(1 + taxaAnualReal, 1/12) - 1;

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
    // Renda menor (só juros), mas por período limitado
    // Patrimônio permanece intacto durante e após o período
    else if (tipoRenda === "periodo" && estrategia === "perpetua") {
        rendaRealPossivel = patrimonioTotalProjetado * taxaMensalReal;
    }

    // ============================================================
    // 🟣 ESTRATÉGIA OTIMIZADA: RENDA POR PERÍODO COM LONGEVIDADE
    // ============================================================
    // Nova estratégia: consome capital até idadeFinal (ex: 115 anos)
    // Renda média (maior que vitalícia, menor que esgotável rápido)
    else if (tipoRenda === "periodo" && idadeFinal) {
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
        
        if (taxaMensalReal > 0) {
            rendaRealPossivel = (patrimonioTotalProjetado * taxaMensalReal) / 
                               (1 - Math.pow(1 + taxaMensalReal, -meses));
        } else {
            // Fallback se taxa for zero ou negativa
            rendaRealPossivel = patrimonioTotalProjetado / meses;
        }
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
        
        if (taxaMensalReal > 0) {
            rendaRealPossivel = (patrimonioTotalProjetado * taxaMensalReal) / 
                               (1 - Math.pow(1 + taxaMensalReal, -meses));
        } else {
            rendaRealPossivel = patrimonioTotalProjetado / meses;
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
    // CORREÇÃO OFICIAL: Cálculo REAL do aporte necessário
    // Fórmula PMT com juros compostos (padrão bancário)
    // ===============================================================
    let aporteNecessario = null;
    if (deficitOuSobra < 0) {
        const meses = anosAteAposentadoria * 12;
        const jurosNominalMensal = taxaMensal(taxaAnualEscolhida);
        
        // Quanto de renda falta para atingir a meta
        const rendaFaltante = Math.abs(deficitOuSobra);
        
        // Patrimônio necessário para gerar essa renda faltante (vitalícia perpétua)
        const patrimonioNecessario = rendaFaltante / taxaMensalReal;
        
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
    let heranca = 0;
    // Herança = patrimônio preservado (não consumido)
    if (estrategia === "perpetua") {
        heranca = patrimonioTotalProjetado;  // Capital preservado (vitalícia ou período)
    } else {
        heranca = 0;  // Capital consumido (esgotável)
    }

    // 12. Projeção pós-aposentadoria (para gráfico completo)
    let projecaoPosAposentadoria = [];
    let curvasExtras = [];  // Nova: múltiplas curvas de longevidade
    
    // 🟣 ESTRATÉGIA OTIMIZADA: RENDA POR PERÍODO COM LONGEVIDADE
    // Patrimônio diminui suavemente até idadeFinal
    if (tipoRenda === "periodo" && idadeFinal) {
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

        heranca = projecaoPosAposentadoria[projecaoPosAposentadoria.length - 1]?.saldo || 0;

        // MULTIPLAS CURVAS
        if (mostrarTodasCurvas) {
            const idades = [95, 105, 115];
            idades.forEach(idFinal => {
                const c = calcularRendaPeriodo(patrimonioTotalProjetado, taxaMensalReal, idadeAposent, idFinal);
                const curva = projetarConsumoLongevidade(
                    patrimonioTotalProjetado,
                    c.rendaMensal,
                    taxaMensalReal,
                    c.mesesDuracao
                );
                curvasExtras.push({ idade: idFinal, curva: curva });
            });
        }
    }
    // ESTRATÉGIA 1: RENDA VITALÍCIA + PRESERVAR CAPITAL
    // Patrimônio permanece constante (só juros são consumidos)
    else if (tipoRenda === "vitalicia" && estrategia === "perpetua") {
        projecaoPosAposentadoria = projetarPatrimonioVitalicia(
            patrimonioTotalProjetado,
            taxaMensalReal,
            30  // 30 anos de projeção pós-aposentadoria
        );
    }
    // ESTRATÉGIA 2: RENDA POR PERÍODO + PRESERVAR CAPITAL
    // Patrimônio permanece constante durante o período
    else if (tipoRenda === "periodo" && estrategia === "perpetua") {
        const meses = anosPeriodo * 12;
        projecaoPosAposentadoria = projetarPatrimonioVitalicia(
            patrimonioTotalProjetado,
            taxaMensalReal,
            anosPeriodo  // Projeção pelo período determinado
        );
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
        projecaoPosAposentadoria = projetarPatrimonioPorPeriodo(
            patrimonioTotalProjetado,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );
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
        projecaoPosAposentadoria = projetarPatrimonioPorPeriodo(
            patrimonioTotalProjetado,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );
    }

    // 13. Gerar renda mensal detalhada para o modal
    let rendaMensalDetalhada = [];
    let idadeFinalParaRenda = idadeFinal || (idadeAposent + 30); // Fallback: 30 anos se não tiver idadeFinal
    
    // Determinar idade final baseada na estratégia
    if (idadeFinal) {
        // Se tem idadeFinal, usar ela (estratégia otimizada ou esgotável com longevidade)
        idadeFinalParaRenda = idadeFinal;
    } else if ((tipoRenda === "periodo" && estrategia === "esgotavel") || (tipoRenda === "vitalicia" && estrategia === "esgotavel")) {
        // Estratégia esgotável sem idadeFinal: usar anosPeriodo ou anosDuracao
        if (anosPeriodo) {
            idadeFinalParaRenda = idadeAposent + anosPeriodo;
        } else if (anosDuracao) {
            idadeFinalParaRenda = idadeAposent + anosDuracao;
        }
    } else if (tipoRenda === "periodo" && estrategia === "perpetua") {
        // Período com capital preservado: usar anosPeriodo
        if (anosPeriodo) {
            idadeFinalParaRenda = idadeAposent + anosPeriodo;
        }
    }
    // Se for vitalícia perpétua, idadeFinalParaRenda já está como fallback (30 anos)
    
    rendaMensalDetalhada = gerarRendaMensalAoLongoDoTempo(
        patrimonioTotalProjetado,
        taxaAnualReal,
        idadeAposent,
        idadeFinalParaRenda,
        estrategia
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
        curvasExtras,  // 🟣 NOVO: múltiplas curvas de longevidade
        idadeFinal,  // 🟣 NOVO: idade de longevidade escolhida
        rendaMensalDetalhada,  // 🟧 NOVO: renda mensal detalhada para o modal
        idadeAposentadoria: idadeAposent  // 🟧 NOVO: idade de aposentadoria para o modal
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
// EXPORTAR PARA O WIZARD
// ===============================================================

if (typeof window !== "undefined") {
    window.executarSimulacaoWizard = executarSimulacaoWizard;
    window.gerarRendaMensalAoLongoDoTempo = gerarRendaMensalAoLongoDoTempo;
}

