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
        dados.push({ mes: m, saldo: saldo });

        if (m < mesesTotal) {
            saldo = saldo * (1 + taxaMensal) - pmt;

            // Limite para evitar números negativos por arredondamento
            if (saldo < 0) saldo = 0;
        }
    }
    return dados;
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
        
        // Se chegou ao piso de 20% (com tolerância), ajusta para H e preenche até o final
        if (saldo <= H + tolerancia) {
            saldo = H; // Garante valor exato
            
            // Empurra saldo para o final mantendo H
            for (let k = m; k <= meses; k++) {
                dados.push({
                    mes: k,
                    saldo: H
                });
            }
            
            return dados; // Retorna com todos os meses preenchidos até o final
        }
        
        // Adiciona o ponto atual
        dados.push({
            mes: m,
            saldo: saldo
        });
    }
    
    // Se chegou até aqui sem tocar o piso, garantir que o último mês está em H
    if (dados.length > 0) {
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
    const idadeFinal = Number(dadosWizard.idadeFinal) || null;  // Nova: idade de longevidade
    const mostrarTodasCurvas = dadosWizard.mostrarTodasCurvas || false;  // Nova: flag múltiplas curvas

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
    const taxaAnualReal = taxaAnualEscolhida - INFLACAO_MEDIA;
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

        // ✅ CORREÇÃO: Herança sempre baseada no saldo final da projeção
        // Isso garante consistência com o gráfico e correção matemática
        heranca = projecaoPosAposentadoria?.[projecaoPosAposentadoria.length - 1]?.saldo || 0;

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
        // ✅ CORREÇÃO: Herança sempre baseada no saldo final da projeção
        heranca = projecaoPosAposentadoria?.[projecaoPosAposentadoria.length - 1]?.saldo || 0;
        
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
            
            // Caso 2 — preservar 20% do patrimônio inicial
            heranca = patrimonioTotalProjetado * 0.20;
            
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
        projecaoPosAposentadoria = projetarPatrimonioPorPeriodo(
            patrimonioTotalProjetado,
            rendaRealPossivel,
            taxaMensalReal,
            meses
        );
        
        // ✅ CORREÇÃO: Herança = saldo final (pode ser 0 se consumir tudo)
        heranca = projecaoPosAposentadoria[projecaoPosAposentadoria.length - 1]?.saldo || 0;
        
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
                    // ================================================
                    // Correção BUG #13 - renda correta para cada idade extra
                    // ================================================
                    let rendaExtraMensal = 0;
                    
                    if (idadeFinal && idadeFinal > idadeAposent) {
                        // Preservar capital com idadeFinal definida → usar preservar20
                        const res = calcularRendaPreservar20(
                            patrimonioTotalProjetado,
                            taxaMensalReal,
                            idadeAposent,
                            curvaObj.idade
                        );
                        rendaExtraMensal = res.rendaMensal;
                    } else {
                        // Preservar capital sem idadeFinal → só juros (constante)
                        rendaExtraMensal = patrimonioTotalProjetado * taxaMensalReal;
                    }
                    
                    // Usar renda calculada corretamente
                    rendaMensalExtra = new Array(meses).fill(rendaExtraMensal);
                    console.log(`✅ Renda mensal (Preservar Capital) para ${curvaObj.idade} anos: R$ ${rendaExtraMensal.toFixed(2)}/mês`);
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

    // =====================================================
    // CURVAS EXTRAS (95, 105, 115 anos)
    // Sempre geradas quando mostrarTodasCurvas = true
    // Usa a mesma estratégia da curva principal
    // =====================================================
    if (mostrarTodasCurvas) {
        console.log("🟣 Gerando curvas extras centralizadas:", { tipoRenda, estrategia, mostrarTodasCurvas });
        curvasExtras = [];
        const idadesExtras = [95, 105, 115];

        idadesExtras.forEach(idadeAlvo => {
            if (idadeAlvo > idadeAposent) {
                const meses = (idadeAlvo - idadeAposent) * 12;
                let curva;

                // Usar mesma estratégia da curva principal
                if (estrategia === "perpetua" && tipoRenda === "vitalicia") {
                    // Renda Vitalícia Perpétua: patrimônio constante
                    const anosProjecao = idadeAlvo - idadeAposent;
                    curva = projetarPatrimonioVitalicia(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        anosProjecao
                    );
                }
                else if (estrategia === "perpetua" && tipoRenda === "periodo") {
                    // Renda por Período + Preservar Capital: pode ser preservar20 ou vitalicia
                    if (idadeFinal && idadeFinal > idadeAposent) {
                        // Se tem idadeFinal, usar estratégia "preservar20"
                        const calc = calcularRendaPreservar20(
                            patrimonioTotalProjetado,
                            taxaMensalReal,
                            idadeAposent,
                            idadeAlvo
                        );
                        curva = projetarPatrimonioPreservar20(
                            patrimonioTotalProjetado,
                            calc.rendaMensal,
                            taxaMensalReal,
                            meses
                        );
                    } else {
                        // Sem idadeFinal, usar vitalicia (patrimônio constante)
                        const anosProjecao = idadeAlvo - idadeAposent;
                        curva = projetarPatrimonioVitalicia(
                            patrimonioTotalProjetado,
                            taxaMensalReal,
                            anosProjecao
                        );
                    }
                }
                else if (estrategia === "preservar20") {
                    // Preservar 20%: patrimônio desce até 20%
                    const calc = calcularRendaPreservar20(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        idadeAposent,
                        idadeAlvo
                    );
                    curva = projetarPatrimonioPreservar20(
                        patrimonioTotalProjetado,
                        calc.rendaMensal,
                        taxaMensalReal,
                        meses
                    );
                }
                else if (estrategia === "esgotavel") {
                    // Esgotável: patrimônio zera na idade alvo
                    const pmtEspecifico = calcularPMTEsgotavel(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        meses
                    );
                    curva = projetarCurvaEsgotavel(
                        patrimonioTotalProjetado,
                        pmtEspecifico,
                        taxaMensalReal,
                        meses
                    );
                }
                else {
                    // Fallback: usar vitalicia (patrimônio constante)
                    const anosProjecao = idadeAlvo - idadeAposent;
                    curva = projetarPatrimonioVitalicia(
                        patrimonioTotalProjetado,
                        taxaMensalReal,
                        anosProjecao
                    );
                }

                if (curva) {
                    curvasExtras.push({
                        idade: idadeAlvo,
                        curva: curva
                    });
                }
            }
        });

        console.log("🟣 Curvas extras geradas (centralizadas):", curvasExtras.length);
    } else {
        console.log("🟣 Curvas extras NÃO geradas: mostrarTodasCurvas =", mostrarTodasCurvas);
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

