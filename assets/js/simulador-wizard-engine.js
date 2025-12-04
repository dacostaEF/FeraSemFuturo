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
    const pv = Number(patrimonioInicial);
    const pmt = Number(rendaMensal);
    const i = taxaMensalReal;

    const dados = [];

    for (let m = 0; m <= mesesTotal; m++) {
        let saldo;

        if (m === 0) {
            saldo = pv;
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
// 🟦 RENDA PRESERVANDO 20% DO PATRIMÔNIO
// ============================================================
function calcularRendaPreservar20(pv, taxaMensalReal, idadeApos, idadeFinal) {
    const meses = (idadeFinal - idadeApos) * 12;
    if (meses <= 0) return { rendaMensal: 0, mesesDuracao: 0, heranca: pv * 0.20 };

    const FV = pv * 0.20; // 20% preservado
    const i = taxaMensalReal;

    // Fórmula correta de PMT com valor residual (annuity immediate)
    const rendaMensal =
        (i * (pv - FV / Math.pow(1 + i, meses))) /
        (1 - 1 / Math.pow(1 + i, meses));

    return {
        rendaMensal,
        mesesDuracao: meses,
        heranca: FV
    };
}

// ============================================================
// 🟦 PROJEÇÃO DE PATRIMÔNIO PRESERVANDO 20%
// ============================================================
function projetarPatrimonioPreservar20(pv, renda, taxaMensalReal, meses) {
    const H = pv * 0.20; // Herança mínima = 20% do patrimônio inicial
    let saldo = pv;
    const dados = [];
    const tolerancia = H * 0.001; // Tolerância de 0.1% do piso para comparação
    
    // Adiciona o ponto inicial
    dados.push({
        mes: 0,
        saldo: saldo
    });
    
    for (let m = 1; m <= meses; m++) {
        // Aplica juros e subtrai renda
        saldo = saldo * (1 + taxaMensalReal) - renda;
        
        // Se é o último mês, garante que está exatamente em H e encerra
        if (m === meses) {
            saldo = H; // Garante valor exato no último mês
            dados.push({
                mes: m,
                saldo: saldo
            });
            break; // encerra a curva no ponto exato
        }
        
        // Se chegou ao piso de 20% (com tolerância), ajusta para H e encerra
        // Isso garante que a curva pare quando tocar os 20%, não continue
        if (saldo <= H + tolerancia) {
            saldo = H; // Garante valor exato
            dados.push({
                mes: m,
                saldo: saldo
            });
            break; // encerra a curva no ponto exato
        }
        
        // Adiciona o ponto atual
        dados.push({
            mes: m,
            saldo: saldo
        });
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
    const idadeFinal = Number(dadosWizard.idadeFinal) || null;  // Nova: idade de longevidade
    const mostrarTodasCurvas = dadosWizard.mostrarTodasCurvas || false;  // Nova: flag múltiplas curvas

    // 2. Definir taxa anual baseada no perfil
    // ✅ VALIDAÇÃO: Verificar se perfil é válido antes de usar
    if (!perfil || !PERFIS_RENTABILIDADE[perfil]) {
        console.error("❌ Perfil de investidor inválido ou não informado:", perfil);
        // Retornar erro estruturado em vez de deixar NaN propagar
        return {
            erro: true,
            mensagem: "Perfil de investidor não informado ou inválido. Por favor, selecione um perfil válido.",
            perfil: perfil
        };
    }
    
    const taxaAnualEscolhida = PERFIS_RENTABILIDADE[perfil];
    
    // ✅ VALIDAÇÃO: Verificar se taxaAnualEscolhida é válida (não undefined/NaN)
    if (isNaN(taxaAnualEscolhida) || taxaAnualEscolhida === undefined || taxaAnualEscolhida === null) {
        console.error("❌ Taxa anual escolhida inválida:", taxaAnualEscolhida);
        return {
            erro: true,
            mensagem: "Erro ao calcular taxa de rentabilidade. Por favor, verifique o perfil selecionado.",
            taxaAnualEscolhida: taxaAnualEscolhida
        };
    }

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
    
    // ✅ VALIDAÇÃO: Verificar se patrimônioTotalProjetado é válido
    if (isNaN(patrimonioTotalProjetado) || patrimonioTotalProjetado < 0) {
        console.error("❌ Patrimônio total projetado inválido:", patrimonioTotalProjetado);
        return {
            erro: true,
            mensagem: "Erro ao calcular patrimônio projetado. Por favor, verifique os dados informados.",
            patrimonioTotalProjetado: patrimonioTotalProjetado
        };
    }

    // 5. NOVO: Calcular renda baseada na estratégia escolhida
    const taxaAnualReal = taxaAnualEscolhida - INFLACAO_MEDIA;
    const taxaMensalReal = Math.pow(1 + taxaAnualReal, 1/12) - 1;
    
    // ✅ VALIDAÇÃO: Verificar se taxas calculadas são válidas
    if (isNaN(taxaMensalReal) || isNaN(taxaAnualReal)) {
        console.error("❌ Taxas calculadas inválidas:", { taxaAnualReal, taxaMensalReal, taxaAnualEscolhida });
        return {
            erro: true,
            mensagem: "Erro ao calcular taxas de rentabilidade. Por favor, verifique os dados informados.",
            taxas: { taxaAnualReal, taxaMensalReal, taxaAnualEscolhida }
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
    // Se for "periodo" + "perpetua" com idadeFinal, usar "preservar20"
    else if (tipoRenda === "periodo" && idadeFinal) {
        if (estrategia === "perpetua") {
            // Usar estratégia "preservar20" quando for "periodo" + "perpetua" com idadeFinal
            const calc = calcularRendaPreservar20(
                patrimonioTotalProjetado,
                taxaMensalReal,
                idadeAposent,
                idadeFinal
            );
            rendaRealPossivel = calc.rendaMensal;
        } else {
            // Caso contrário, usar cálculo normal de período
            const calc = calcularRendaPeriodo(
                patrimonioTotalProjetado,
                taxaMensalReal,
                idadeAposent,
                idadeFinal
            );
            rendaRealPossivel = calc.rendaMensal;
        }
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
    // ✅ CORREÇÃO DOSE 5: Herança deve respeitar a estratégia escolhida
    // - "Preservar capital" (perpetua) → herança = patrimônio total
    // - "Usar capital gradualmente" (esgotavel) → herança = saldo final (pode ser 0)
    let heranca = 0;
    
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

        // ✅ CORREÇÃO: Herança baseada na estratégia, não apenas no saldo final
        // Se for "Preservar capital", herança = patrimônio total (não consome principal)
        // Se for "Usar capital", herança = saldo final (pode ser 0 ou parcial)
        if (estrategia === "perpetua") {
            // Preservar capital → herança = patrimônio total (não foi consumido)
            heranca = patrimonioTotalProjetado;
        } else {
            // Usar capital gradualmente → herança = saldo final (pode ser 0)
            heranca = projecaoPosAposentadoria[projecaoPosAposentadoria.length - 1]?.saldo || 0;
        }

        // MULTIPLAS CURVAS
        if (mostrarTodasCurvas) {
            console.log("🟣 Gerando curvas extras para 'periodo + idadeFinal':", { tipoRenda, idadeFinal, mostrarTodasCurvas });
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
            console.log("🟣 Curvas extras geradas:", curvasExtras.length);
        } else {
            console.log("🟣 Curvas extras NÃO geradas: mostrarTodasCurvas =", mostrarTodasCurvas);
        }
    }
    // ESTRATÉGIA 1: RENDA VITALÍCIA + PRESERVAR CAPITAL
    // Patrimônio permanece constante (só juros são consumidos)
    // ✅ CORREÇÃO: Renda PERPÉTUA deve ir até 116 anos (não limitada a 30 ou 95 anos)
    else if (tipoRenda === "vitalicia" && estrategia === "perpetua") {
        // Calcular anos até 116 anos (padrão de longevidade estendido)
        const idadeMaxima = 116;
        const anosProjecao = idadeMaxima - idadeAposent;
        projecaoPosAposentadoria = projetarPatrimonioVitalicia(
            patrimonioTotalProjetado,
            taxaMensalReal,
            anosProjecao  // Projeção até 116 anos (perpétua)
        );
        // ✅ CORREÇÃO: Herança = patrimônio total (capital preservado)
        heranca = patrimonioTotalProjetado;
    }
    // ESTRATÉGIA 2: RENDA POR PERÍODO + PRESERVAR CAPITAL
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
            
            // Herança = 20% do patrimônio inicial (valor mínimo preservado)
            heranca = patrimonioTotalProjetado * 0.20;
            
            // 🟣 NOVO: Gerar curvas extras para "Preservar 20%"
            if (mostrarTodasCurvas) {
                console.log("🟣 Gerando curvas extras para 'periodo + perpetua (preservar20)':", { tipoRenda, estrategia, mostrarTodasCurvas });
                const idades = [95, 105, 115];
                idades.forEach(idFinal => {
                    const calc = calcularRendaPreservar20(patrimonioTotalProjetado, taxaMensalReal, idadeAposent, idFinal);
                    const anosAposAposentadoria = idFinal - idadeAposent;
                    const mesesExtra = anosAposAposentadoria * 12;
                    const curva = projetarPatrimonioPreservar20(
                        patrimonioTotalProjetado,
                        calc.rendaMensal,
                        taxaMensalReal,
                        mesesExtra
                    );
                    curvasExtras.push({ idade: idFinal, curva: curva });
                });
                console.log("🟣 Curvas extras geradas:", curvasExtras.length);
            }
        } else {
            // Sem idadeFinal, manter comportamento original (patrimônio constante)
            const meses = anosPeriodo * 12;
            projecaoPosAposentadoria = projetarPatrimonioVitalicia(
                patrimonioTotalProjetado,
                taxaMensalReal,
                anosPeriodo  // Projeção pelo período determinado
            );
            // ✅ CORREÇÃO: Herança = patrimônio total (capital preservado)
            heranca = patrimonioTotalProjetado;
            
            // 🟣 NOVO: Gerar curvas extras para "Renda por Período + Preservar Capital"
            if (mostrarTodasCurvas) {
                console.log("🟣 Gerando curvas extras para 'periodo + perpetua':", { tipoRenda, estrategia, mostrarTodasCurvas });
                const idades = [95, 105, 115];
                idades.forEach(idFinal => {
                    const anosProjecao = idFinal - idadeAposent;
                    const curva = projetarPatrimonioVitalicia(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        anosProjecao
                    );
                    curvasExtras.push({ idade: idFinal, curva: curva });
                });
                console.log("🟣 Curvas extras geradas:", curvasExtras.length);
            } else {
                console.log("🟣 Curvas extras NÃO geradas: mostrarTodasCurvas =", mostrarTodasCurvas);
            }
        }
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
        
        // ✅ CORREÇÃO: Herança = saldo final (pode ser 0 se consumir tudo)
        heranca = projecaoPosAposentadoria[projecaoPosAposentadoria.length - 1]?.saldo || 0;
        
        // 🟣 NOVO: Gerar curvas extras para "Renda por Período + Usar Capital Gradualmente"
        if (mostrarTodasCurvas) {
            console.log("🟣 Gerando curvas extras para 'periodo + esgotavel':", { tipoRenda, estrategia, mostrarTodasCurvas });
            const idades = [95, 105, 115];
            idades.forEach(idFinal => {
                const calc = calcularRendaPeriodo(patrimonioTotalProjetado, taxaMensalReal, idadeAposent, idFinal);
                const anosAposAposentadoria = idFinal - idadeAposent;
                const mesesExtra = anosAposAposentadoria * 12;
                const curva = projetarConsumoLongevidade(
                    patrimonioTotalProjetado,
                    calc.rendaMensal,
                    taxaMensalReal,
                    mesesExtra
                );
                curvasExtras.push({ idade: idFinal, curva: curva });
            });
            console.log("🟣 Curvas extras geradas:", curvasExtras.length);
        } else {
            console.log("🟣 Curvas extras NÃO geradas: mostrarTodasCurvas =", mostrarTodasCurvas);
        }
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
        
        // Herança = 20% do patrimônio inicial (valor mínimo preservado)
        heranca = patrimonioTotalProjetado * 0.20;
        
        // 🟣 NOVO: Gerar curvas extras para "Preservar 20%"
        if (mostrarTodasCurvas) {
            console.log("🟣 Gerando curvas extras para 'preservar20':", { estrategia, mostrarTodasCurvas });
            const idades = [95, 105, 115];
            idades.forEach(idFinal => {
                const calc = calcularRendaPreservar20(patrimonioTotalProjetado, taxaMensalReal, idadeAposent, idFinal);
                const anosAposAposentadoria = idFinal - idadeAposent;
                const mesesExtra = anosAposAposentadoria * 12;
                const curva = projetarPatrimonioPreservar20(
                    patrimonioTotalProjetado,
                    calc.rendaMensal,
                    taxaMensalReal,
                    mesesExtra
                );
                curvasExtras.push({ idade: idFinal, curva: curva });
            });
            console.log("🟣 Curvas extras geradas:", curvasExtras.length);
        } else {
            console.log("🟣 Curvas extras NÃO geradas: mostrarTodasCurvas =", mostrarTodasCurvas);
        }
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
        
        // ✅ CORREÇÃO: Herança = saldo final (pode ser 0 se consumir tudo)
        heranca = projecaoPosAposentadoria[projecaoPosAposentadoria.length - 1]?.saldo || 0;
    }
    
    // ✅ CORREÇÃO: Garantir que herança foi calculada (fallback para casos não cobertos)
    // Se ainda não foi definida, calcular baseado na estratégia
    if (heranca === undefined || (heranca === 0 && estrategia === "perpetua" && projecaoPosAposentadoria.length === 0)) {
        if (estrategia === "perpetua") {
            heranca = patrimonioTotalProjetado;  // Capital preservado
        } else {
            heranca = 0;  // Capital consumido
        }
    }

    // 13. Gerar renda mensal detalhada para o modal
    let rendaMensalDetalhada = [];
    let rendasMensaisExtras = [];  // 🟣 NOVO: rendas mensais para curvas extras
    
    // ✅ CORREÇÃO DOSE 4: Determinar idade final baseada na estratégia
    // Para vitalícia perpétua, usar 95 anos (padrão de longevidade) em vez de 30 anos
    // Isso é mais consistente com o conceito de "vitalícia" e alinha com as curvas extras
    let idadeFinalParaRenda;
    
    // ✅ CORREÇÃO: Verificar Renda Vitalícia Perpétua PRIMEIRO (antes de usar idadeFinal)
    // Isso garante que mesmo se idadeFinal for definida, a perpétua use 116 anos
    if (tipoRenda === "vitalicia" && estrategia === "perpetua") {
        // ✅ CORREÇÃO: Vitalícia PERPÉTUA → usar 116 anos (padrão de longevidade estendido)
        // Renda perpétua não deve ter limite, mas para fins de visualização usamos 116 anos
        idadeFinalParaRenda = 116;
    } else if (idadeFinal) {
        // Se tem idadeFinal, usar ela (estratégia otimizada ou esgotável com longevidade)
        idadeFinalParaRenda = idadeFinal;
    } else if ((tipoRenda === "periodo" && estrategia === "esgotavel") || (tipoRenda === "vitalicia" && estrategia === "esgotavel")) {
        // Estratégia esgotável sem idadeFinal: usar anosPeriodo ou anosDuracao
        if (anosPeriodo) {
            idadeFinalParaRenda = idadeAposent + anosPeriodo;
        } else if (anosDuracao) {
            idadeFinalParaRenda = idadeAposent + anosDuracao;
        } else {
            idadeFinalParaRenda = idadeAposent + 30; // Fallback
        }
    } else if (tipoRenda === "periodo" && estrategia === "perpetua") {
        // Período com capital preservado: usar anosPeriodo
        if (anosPeriodo) {
            idadeFinalParaRenda = idadeAposent + anosPeriodo;
        } else {
            idadeFinalParaRenda = idadeAposent + 30; // Fallback
        }
    } else if (estrategia === "preservar20") {
        // Preservar 20%: usar idadeFinal se disponível, senão 116 anos (padrão estendido)
        if (idadeFinal) {
            idadeFinalParaRenda = idadeFinal;
        } else {
            idadeFinalParaRenda = 116; // ✅ CORREÇÃO: usar 116 anos em vez de 95
        }
    } else {
        // Fallback genérico: 116 anos (padrão de longevidade estendido)
        idadeFinalParaRenda = 116;
    }
    
    rendaMensalDetalhada = gerarRendaMensalAoLongoDoTempo(
        patrimonioTotalProjetado,
        taxaAnualReal,
        idadeAposent,
        idadeFinalParaRenda,
        estrategia
    );
    
    // 🟣 NOVO: Gerar rendas mensais para curvas extras (quando mostrarTodasCurvas está ativo)
    if (mostrarTodasCurvas && curvasExtras && curvasExtras.length > 0) {
        console.log("🟣 Gerando rendas mensais extras para curvas:", curvasExtras);
        
        curvasExtras.forEach(curvaObj => {
            let rendaMensalExtra = [];
            
            // Para "Renda por Período", calcular renda via PMT para cada idade
            if (tipoRenda === "periodo") {
                const meses = (curvaObj.idade - idadeAposent) * 12;
                
                if (estrategia === "perpetua") {
                    // Para "Preservar Capital", a renda é constante (só juros) - mesma para todas as idades
                    // MAS: mesmo preservando capital, podemos calcular rendas diferentes baseadas em PMT
                    // para mostrar o trade-off entre renda e preservação
                    const calc = calcularRendaPeriodo(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        idadeAposent,
                        curvaObj.idade
                    );
                    // Usar PMT calculado (que será menor para idades maiores)
                    rendaMensalExtra = new Array(meses).fill(calc.rendaMensal);
                    console.log(`✅ Renda mensal (Preservar Capital - PMT) para ${curvaObj.idade} anos: R$ ${calc.rendaMensal.toFixed(2)}/mês`);
                } else if (estrategia === "esgotavel") {
                    // Para "Usar Capital Gradualmente", calcular PMT para consumir até a idade final
                    // Cada idade terá uma renda DIFERENTE (maior para 95, menor para 115)
                    const calc = calcularRendaPeriodo(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        idadeAposent,
                        curvaObj.idade
                    );
                    // Gerar renda mensal constante (PMT) para todos os meses até aquela idade
                    rendaMensalExtra = new Array(meses).fill(calc.rendaMensal);
                    console.log(`✅ Renda mensal (Usar Capital) para ${curvaObj.idade} anos: R$ ${calc.rendaMensal.toFixed(2)}/mês`);
                } else if (estrategia === "preservar20") {
                    // Para "Preservar 20%", calcular renda que preserva 20% do patrimônio
                    const calc = calcularRendaPreservar20(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        idadeAposent,
                        curvaObj.idade
                    );
                    rendaMensalExtra = new Array(meses).fill(calc.rendaMensal);
                    console.log(`✅ Renda mensal (Preservar 20%) para ${curvaObj.idade} anos: R$ ${calc.rendaMensal.toFixed(2)}/mês`);
                }
            } 
            // Para "Renda Vitalícia", a renda é constante (só juros) - mesma para todas as idades
            else if (tipoRenda === "vitalicia") {
                if (estrategia === "preservar20") {
                    // Para "Preservar 20%" com vitalícia, calcular renda que preserva 20%
                    const calc = calcularRendaPreservar20(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        idadeAposent,
                        curvaObj.idade
                    );
                    const meses = (curvaObj.idade - idadeAposent) * 12;
                    rendaMensalExtra = new Array(meses).fill(calc.rendaMensal);
                    console.log(`✅ Renda mensal (Preservar 20% - Vitalícia) para ${curvaObj.idade} anos: R$ ${calc.rendaMensal.toFixed(2)}/mês`);
                } else {
                    const renda = patrimonioTotalProjetado * taxaMensalReal;
                    const meses = (curvaObj.idade - idadeAposent) * 12;
                    rendaMensalExtra = new Array(meses).fill(renda);
                }
            }
            
            rendasMensaisExtras.push({
                idade: curvaObj.idade,
                rendaMensal: rendaMensalExtra
            });
        });
        
        console.log("🟣 Rendas mensais extras geradas:", rendasMensaisExtras);
    }

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
        rendasMensaisExtras,  // 🟣 NOVO: rendas mensais para curvas extras (95, 105, 115)
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

    // Estratégia PRESERVAR 20% (capital desce até 20% do inicial)
    if (estrategia === "preservar20") {
        const H = patrimonio * 0.20; // Herança = 20% do patrimônio inicial
        const P_menos_H = patrimonio - H; // Patrimônio disponível para consumo
        const renda = (P_menos_H * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));
        
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

