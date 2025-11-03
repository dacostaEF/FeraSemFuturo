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
    document.getElementById('tesouro-liquido').textContent = formatarMoeda(rendimentoLiquidoTesouro);
    
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
    
    // Mostrar resultados
    document.getElementById('resultado-meta').style.display = 'block';
    document.getElementById('resultado-meta').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
