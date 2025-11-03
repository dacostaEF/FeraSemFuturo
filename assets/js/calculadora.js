// ==========================================
// GESTÃO DE TABS
// ==========================================

function switchTab(tabName) {
    // Remover active de todas as tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativar tab clicada
    event.target.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
}

function formatarPorcentagem(valor) {
    return valor.toFixed(2) + '%';
}

// ==========================================
// TAB 1: COMPARAÇÃO POUPANÇA VS TESOURO
// ==========================================

function calcularComparacao() {
    const valorInicial = parseFloat(document.getElementById('valorInicial1').value) || 0;
    const aporteMensal = parseFloat(document.getElementById('aporteMensal1').value) || 0;
    const prazoMeses = parseInt(document.getElementById('prazo1').value) || 12;
    
    // Taxas (estimadas)
    const taxaPoupanca = 0.005; // ~0.5% ao mês (~6% ao ano)
    const taxaSelic = 0.0107; // ~1.07% ao mês (~13.65% ao ano)
    const taxaCustodiaTesouro = 0.002; // 0.2% ao ano (B3)
    const limiteIsencaoCustodia = 10000; // Isenção até R$ 10.000 por CPF
    
    // Cálculo Poupança
    let saldoPoupanca = valorInicial;
    for (let i = 0; i < prazoMeses; i++) {
        saldoPoupanca = saldoPoupanca * (1 + taxaPoupanca) + aporteMensal;
    }
    const totalInvestidoPoupanca = valorInicial + (aporteMensal * prazoMeses);
    const rendimentoPoupanca = saldoPoupanca - totalInvestidoPoupanca;
    
    // Cálculo Tesouro Selic (com IR e custódia)
    let saldoTesouro = valorInicial;
    for (let i = 0; i < prazoMeses; i++) {
        saldoTesouro = saldoTesouro * (1 + taxaSelic) + aporteMensal;
    }
    
    const totalInvestidoTesouro = valorInicial + (aporteMensal * prazoMeses);
    const rendimentoBrutoTesouro = saldoTesouro - totalInvestidoTesouro;
    
    // Calcular IR (22.5% para até 6 meses, 20% para 6-12 meses, 17.5% para 12-24 meses, 15% acima de 24 meses)
    let aliquotaIR;
    if (prazoMeses <= 6) {
        aliquotaIR = 0.225;
    } else if (prazoMeses <= 12) {
        aliquotaIR = 0.20;
    } else if (prazoMeses <= 24) {
        aliquotaIR = 0.175;
    } else {
        aliquotaIR = 0.15;
    }
    
    const impostoRenda = rendimentoBrutoTesouro * aliquotaIR;
    
    // Custódia: cobrada apenas sobre o valor excedente a R$ 10.000
    const valorExcedente = Math.max(0, saldoTesouro - limiteIsencaoCustodia);
    const custodiaAnual = valorExcedente * taxaCustodiaTesouro * (prazoMeses / 12);
    
    const totalImpostos = impostoRenda + custodiaAnual;
    const rendimentoLiquidoTesouro = rendimentoBrutoTesouro - totalImpostos;
    const saldoFinalTesouro = totalInvestidoTesouro + rendimentoLiquidoTesouro;
    
    // Diferença
    const diferenca = saldoFinalTesouro - saldoPoupanca;
    
    // Exibir resultados
    document.getElementById('poupanca-final').textContent = formatarMoeda(saldoPoupanca);
    document.getElementById('poupanca-investido').textContent = formatarMoeda(totalInvestidoPoupanca);
    document.getElementById('poupanca-rendimento').textContent = formatarMoeda(rendimentoPoupanca);
    
    document.getElementById('tesouro-final').textContent = formatarMoeda(saldoFinalTesouro);
    document.getElementById('tesouro-investido').textContent = formatarMoeda(totalInvestidoTesouro);
    document.getElementById('tesouro-bruto').textContent = formatarMoeda(rendimentoBrutoTesouro);
    document.getElementById('tesouro-impostos').textContent = formatarMoeda(totalImpostos);
    
    // Rendimento líquido em VERDE (destaque positivo)
    const liquidoElement = document.getElementById('tesouro-liquido');
    liquidoElement.textContent = formatarMoeda(rendimentoLiquidoTesouro);
    liquidoElement.style.color = '#10B981';
    liquidoElement.style.fontWeight = '700';
    
    document.getElementById('diferenca-valor').textContent = formatarMoeda(diferenca);
    
    if (diferenca > 0) {
        document.getElementById('diferenca-texto').textContent = 
            `Você ganharia R$ ${diferenca.toFixed(2)} a mais no Tesouro Selic em ${prazoMeses} meses!`;
    } else {
        document.getElementById('diferenca-texto').textContent = 
            `Neste cenário, a poupança seria mais vantajosa em R$ ${Math.abs(diferenca).toFixed(2)}.`;
    }
    
    // Mostrar resultados
    document.getElementById('resultado-comparacao').style.display = 'block';
    document.getElementById('resultado-comparacao').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==========================================
// TAB 2: JUROS COMPOSTOS
// ==========================================

function calcularJuros() {
    const valorInicial = parseFloat(document.getElementById('valorInicial2').value) || 0;
    const aporteMensal = parseFloat(document.getElementById('aporteMensal2').value) || 0;
    const taxaAnual = parseFloat(document.getElementById('taxaAnual').value) || 0;
    const prazoMeses = parseInt(document.getElementById('prazo2').value) || 12;
    
    // Converter taxa anual para mensal
    const taxaMensal = Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1;
    
    // Cálculo dos juros compostos
    let saldo = valorInicial;
    for (let i = 0; i < prazoMeses; i++) {
        saldo = saldo * (1 + taxaMensal) + aporteMensal;
    }
    
    const totalInvestido = valorInicial + (aporteMensal * prazoMeses);
    const ganhoJuros = saldo - totalInvestido;
    const rentabilidade = (ganhoJuros / totalInvestido) * 100;
    
    // Exibir resultados
    document.getElementById('juros-final').textContent = formatarMoeda(saldo);
    document.getElementById('juros-investido').textContent = formatarMoeda(totalInvestido);
    document.getElementById('juros-ganho').textContent = formatarMoeda(ganhoJuros);
    document.getElementById('juros-percent').textContent = formatarPorcentagem(rentabilidade);
    
    // Explicação motivacional
    const anos = Math.floor(prazoMeses / 12);
    const meses = prazoMeses % 12;
    const periodo = anos > 0 ? `${anos} ano${anos > 1 ? 's' : ''}${meses > 0 ? ` e ${meses} meses` : ''}` : `${meses} meses`;
    
    document.getElementById('juros-explicacao').textContent = 
        `Em ${periodo}, investindo ${formatarMoeda(aporteMensal)} por mês a ${taxaAnual}% ao ano, ` +
        `você transformaria ${formatarMoeda(totalInvestido)} em ${formatarMoeda(saldo)}. ` +
        `Isso significa que ${formatarMoeda(ganhoJuros)} vieram dos juros compostos trabalhando para você!`;
    
    // Atualizar barras visuais
    const totalGeral = totalInvestido + ganhoJuros;
    const percentInvestido = (totalInvestido / totalGeral) * 100;
    const percentGanho = (ganhoJuros / totalGeral) * 100;
    
    document.getElementById('bar-juros-investido').style.width = percentInvestido + '%';
    document.getElementById('bar-juros-investido-valor').textContent = formatarMoeda(totalInvestido);
    document.getElementById('bar-juros-ganho').style.width = percentGanho + '%';
    document.getElementById('bar-juros-ganho-valor').textContent = formatarMoeda(ganhoJuros);
    
    // Mostrar resultados
    document.getElementById('resultado-juros').style.display = 'block';
    document.getElementById('resultado-juros').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==========================================
// TAB 3: SIMULADOR DE METAS
// ==========================================

function calcularMeta() {
    const metaValor = parseFloat(document.getElementById('metaValor').value) || 0;
    const metaInicial = parseFloat(document.getElementById('metaInicial').value) || 0;
    const metaPrazo = parseInt(document.getElementById('metaPrazo').value) || 12;
    const metaTaxa = parseFloat(document.getElementById('metaTaxa').value) || 0;
    
    if (metaValor <= metaInicial) {
        alert('Você já tem mais do que sua meta! 🎉');
        return;
    }
    
    // Converter taxa anual para mensal
    const taxaMensal = Math.pow(1 + (metaTaxa / 100), 1 / 12) - 1;
    
    // Fórmula para calcular PMT (aporte necessário)
    // FV = PV * (1+r)^n + PMT * [((1+r)^n - 1) / r]
    // PMT = (FV - PV * (1+r)^n) / (((1+r)^n - 1) / r)
    
    const fatorJuros = Math.pow(1 + taxaMensal, metaPrazo);
    const valorFuturoInicial = metaInicial * fatorJuros;
    const valorRestante = metaValor - valorFuturoInicial;
    
    let aporteMensal;
    if (taxaMensal === 0) {
        // Se taxa for 0, é uma divisão simples
        aporteMensal = valorRestante / metaPrazo;
    } else {
        aporteMensal = valorRestante / ((fatorJuros - 1) / taxaMensal);
    }
    
    // Verificar se é viável
    if (aporteMensal < 0) {
        alert('Seu valor inicial já é suficiente para atingir a meta com os juros! 🎉');
        return;
    }
    
    const totalInvestido = metaInicial + (aporteMensal * metaPrazo);
    const ganhoJuros = metaValor - totalInvestido;
    const ganhoJurosExibicao = Math.max(0, ganhoJuros); // Nunca mostra negativo
    
    // Exibir resultados
    document.getElementById('meta-aporte').textContent = formatarMoeda(aporteMensal);
    document.getElementById('meta-objetivo').textContent = formatarMoeda(metaValor);
    document.getElementById('meta-tem').textContent = formatarMoeda(metaInicial);
    document.getElementById('meta-tempo').textContent = `${metaPrazo} meses`;
    document.getElementById('meta-total-investido').textContent = formatarMoeda(totalInvestido);
    document.getElementById('meta-ganho').textContent = formatarMoeda(ganhoJurosExibicao);
    
    // Mensagem motivacional
    const anos = Math.floor(metaPrazo / 12);
    const meses = metaPrazo % 12;
    const periodo = anos > 0 ? `${anos} ano${anos > 1 ? 's' : ''}${meses > 0 ? ` e ${meses} meses` : ''}` : `${meses} meses`;
    
    document.getElementById('meta-motivacao').textContent = 
        `Investindo ${formatarMoeda(aporteMensal)} por mês durante ${periodo}, ` +
        `você alcançará sua meta de ${formatarMoeda(metaValor)}! ` +
        `Os juros compostos farão ${formatarMoeda(ganhoJurosExibicao)} do trabalho por você. ` +
        `Comece hoje mesmo! 🚀`;
    
    // Atualizar barras visuais
    const percentInvestido = (totalInvestido / metaValor) * 100;
    const percentGanho = (ganhoJurosExibicao / metaValor) * 100;
    
    document.getElementById('bar-meta-investido').style.width = percentInvestido + '%';
    document.getElementById('bar-meta-investido-valor').textContent = formatarMoeda(totalInvestido);
    document.getElementById('bar-meta-ganho').style.width = percentGanho + '%';
    document.getElementById('bar-meta-ganho-valor').textContent = formatarMoeda(ganhoJurosExibicao);
    
    // Mostrar resultados
    document.getElementById('resultado-meta').style.display = 'block';
    document.getElementById('resultado-meta').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==========================================
// TAB 4: COMPARADOR RENDA FIXA
// ==========================================

function calcularRendaFixa() {
    const valorInicial = parseFloat(document.getElementById('valorInicialRF').value) || 0;
    const aporteMensal = parseFloat(document.getElementById('aporteMensalRF').value) || 0;
    const prazoMeses = parseInt(document.getElementById('prazoRF').value) || 12;
    const taxaCDBPercent = parseFloat(document.getElementById('taxaCDB').value) || 100;
    const taxaLCIPercent = parseFloat(document.getElementById('taxaLCI').value) || 90;
    
    // Taxas base
    const taxaPoupancaMensal = 0.005; // 0,5% ao mês
    const taxaCDIAnual = 0.1365; // 13,65% ao ano
    const taxaCDIMensal = Math.pow(1 + taxaCDIAnual, 1/12) - 1;
    
    // Cálculo 1: POUPANÇA
    let saldoPoupanca = valorInicial;
    for (let i = 0; i < prazoMeses; i++) {
        saldoPoupanca = saldoPoupanca * (1 + taxaPoupancaMensal) + aporteMensal;
    }
    const totalInvestidoPoupanca = valorInicial + (aporteMensal * prazoMeses);
    const rendimentoPoupanca = saldoPoupanca - totalInvestidoPoupanca;
    
    // Cálculo 2: CDB (com IR)
    const taxaCDBMensal = ((taxaCDBPercent / 100) * taxaCDIMensal);
    let saldoCDB = valorInicial;
    for (let i = 0; i < prazoMeses; i++) {
        saldoCDB = saldoCDB * (1 + taxaCDBMensal) + aporteMensal;
    }
    const totalInvestidoCDB = valorInicial + (aporteMensal * prazoMeses);
    const rendimentoBrutoCDB = saldoCDB - totalInvestidoCDB;
    
    // IR regressivo no CDB
    let aliquotaIR;
    if (prazoMeses <= 6) {
        aliquotaIR = 0.225;
    } else if (prazoMeses <= 12) {
        aliquotaIR = 0.20;
    } else if (prazoMeses <= 24) {
        aliquotaIR = 0.175;
    } else {
        aliquotaIR = 0.15;
    }
    const IRCDB = rendimentoBrutoCDB * aliquotaIR;
    const rendimentoLiquidoCDB = rendimentoBrutoCDB - IRCDB;
    const saldoFinalCDB = totalInvestidoCDB + rendimentoLiquidoCDB;
    
    // Cálculo 3: LCI/LCA (isento de IR)
    const taxaLCIMensal = ((taxaLCIPercent / 100) * taxaCDIMensal);
    let saldoLCI = valorInicial;
    for (let i = 0; i < prazoMeses; i++) {
        saldoLCI = saldoLCI * (1 + taxaLCIMensal) + aporteMensal;
    }
    const totalInvestidoLCI = valorInicial + (aporteMensal * prazoMeses);
    const rendimentoLCI = saldoLCI - totalInvestidoLCI;
    
    // Exibir resultados
    document.getElementById('rf-poupanca-final').textContent = formatarMoeda(saldoPoupanca);
    document.getElementById('rf-poupanca-investido').textContent = formatarMoeda(totalInvestidoPoupanca);
    document.getElementById('rf-poupanca-rendimento').textContent = formatarMoeda(rendimentoPoupanca);
    
    document.getElementById('rf-cdb-final').textContent = formatarMoeda(saldoFinalCDB);
    document.getElementById('rf-cdb-investido').textContent = formatarMoeda(totalInvestidoCDB);
    document.getElementById('rf-cdb-bruto').textContent = formatarMoeda(rendimentoBrutoCDB);
    document.getElementById('rf-cdb-ir').textContent = formatarMoeda(IRCDB);
    document.getElementById('rf-cdb-liquido').textContent = formatarMoeda(rendimentoLiquidoCDB);
    
    document.getElementById('rf-lci-final').textContent = formatarMoeda(saldoLCI);
    document.getElementById('rf-lci-investido').textContent = formatarMoeda(totalInvestidoLCI);
    document.getElementById('rf-lci-rendimento').textContent = formatarMoeda(rendimentoLCI);
    
    // Criar ranking
    const investimentos = [
        { nome: 'CDB', valor: saldoFinalCDB },
        { nome: 'LCI/LCA', valor: saldoLCI },
        { nome: 'Poupança', valor: saldoPoupanca }
    ];
    
    investimentos.sort((a, b) => b.valor - a.valor);
    
    let rankingHTML = '';
    investimentos.forEach((inv, index) => {
        const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        const classe = index === 0 ? 'first' : '';
        rankingHTML += `
            <div class="ranking-item ${classe}">
                <span class="ranking-position">${emoji}</span>
                <span class="ranking-name">${inv.nome}</span>
                <span class="ranking-value">${formatarMoeda(inv.valor)}</span>
            </div>
        `;
    });
    
    document.getElementById('rf-ranking').innerHTML = rankingHTML;
    
    // Mostrar resultados
    document.getElementById('resultado-rendafixa').style.display = 'block';
    document.getElementById('resultado-rendafixa').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==========================================
// TAB 5: SIMULADOR DE APOSENTADORIA
// ==========================================

function calcularAposentadoria() {
    const idadeAtual = parseInt(document.getElementById('idadeAtual').value) || 30;
    const idadeAlvo = parseInt(document.getElementById('idadeAlvo').value) || 60;
    const rendaMensal = parseFloat(document.getElementById('rendaMensal').value) || 8000;
    const patrimonioAtual = parseFloat(document.getElementById('patrimonioAtual').value) || 0;
    const retornoAnual = parseFloat(document.getElementById('retornoEsperado').value) || 10;
    
    // Validações
    if (idadeAlvo <= idadeAtual) {
        alert('A idade de aposentadoria deve ser maior que sua idade atual!');
        return;
    }
    
    // Cálculos
    const anosAteAposentadoria = idadeAlvo - idadeAtual;
    const mesesAteAposentadoria = anosAteAposentadoria * 12;
    
    // Regra dos 4% (FIRE): Patrimônio = Renda Anual / 0.04
    const rendaAnual = rendaMensal * 12;
    const patrimonioNecessario = rendaAnual / 0.04;
    
    // Converter taxa anual para mensal
    const taxaMensal = Math.pow(1 + (retornoAnual / 100), 1 / 12) - 1;
    
    // Calcular valor futuro do patrimônio atual
    const valorFuturoPatrimonioAtual = patrimonioAtual * Math.pow(1 + taxaMensal, mesesAteAposentadoria);
    
    // Calcular quanto falta acumular
    const valorRestante = patrimonioNecessario - valorFuturoPatrimonioAtual;
    
    // Calcular aporte mensal necessário (PMT)
    let aporteMensal;
    if (valorRestante <= 0) {
        aporteMensal = 0;
    } else {
        const fatorJuros = Math.pow(1 + taxaMensal, mesesAteAposentadoria);
        aporteMensal = valorRestante / ((fatorJuros - 1) / taxaMensal);
    }
    
    const totalInvestido = patrimonioAtual + (aporteMensal * mesesAteAposentadoria);
    const ganhoJuros = patrimonioNecessario - totalInvestido;
    
    // Exibir resultados
    document.getElementById('apos-patrimonio').textContent = formatarMoeda(patrimonioNecessario);
    document.getElementById('apos-tempo').textContent = `${anosAteAposentadoria} anos`;
    document.getElementById('apos-tem').textContent = formatarMoeda(patrimonioAtual);
    document.getElementById('apos-aporte').textContent = formatarMoeda(aporteMensal);
    document.getElementById('apos-total').textContent = formatarMoeda(totalInvestido);
    document.getElementById('apos-juros').textContent = formatarMoeda(Math.max(0, ganhoJuros));
    
    // Insight: começar 5 anos antes
    const idadeAlvoMais5 = idadeAlvo + 5;
    const anosMais5 = idadeAlvoMais5 - idadeAtual;
    const mesesMais5 = anosMais5 * 12;
    const valorFuturoMais5 = patrimonioAtual * Math.pow(1 + taxaMensal, mesesMais5);
    const valorRestanteMais5 = patrimonioNecessario - valorFuturoMais5;
    const fatorJurosMais5 = Math.pow(1 + taxaMensal, mesesMais5);
    const aporteMensalMais5 = valorRestanteMais5 <= 0 ? 0 : valorRestanteMais5 / ((fatorJurosMais5 - 1) / taxaMensal);
    
    const economia = aporteMensal - aporteMensalMais5;
    
    document.getElementById('apos-insight').textContent = 
        aporteMensal === 0 
        ? `Parabéns! Seu patrimônio atual já é suficiente para se aposentar com ${formatarMoeda(rendaMensal)}/mês usando a regra dos 4%! 🎉`
        : `Se você começasse a investir 5 anos DEPOIS (aos ${idadeAtual + 5} anos), precisaria investir ${formatarMoeda(aporteMensalMais5)}/mês. ` +
          `Começando agora, você economiza ${formatarMoeda(Math.abs(economia))}/mês! O tempo é seu maior aliado! ⏰`;
    
    // Mostrar resultados
    document.getElementById('resultado-aposentadoria').style.display = 'block';
    document.getElementById('resultado-aposentadoria').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
