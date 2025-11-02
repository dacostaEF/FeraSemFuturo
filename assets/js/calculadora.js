// Taxas atuais (novembro 2024)
const TAXA_POUPANCA_MENSAL = 0.005; // 0,5% ao mês
const TAXA_SELIC_ANUAL = 0.1375; // 13,75% ao ano
const TAXA_CUSTODIA = 0.002; // 0,20% ao ano

// Tabela regressiva de IR
function calcularIR(meses) {
    if (meses <= 6) return 0.225; // 22,5%
    if (meses <= 12) return 0.20; // 20%
    if (meses <= 24) return 0.175; // 17,5%
    return 0.15; // 15%
}

// Formata número para moeda
function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Define prazo rápido
function setPrazo(meses) {
    document.getElementById('prazo').value = meses;
}

// Cálculo da Poupança
function calcularPoupanca(valorInicial, aporteMensal, meses) {
    let saldo = valorInicial;
    let totalInvestido = valorInicial;
    
    for (let i = 0; i < meses; i++) {
        // Aplica rendimento
        saldo = saldo * (1 + TAXA_POUPANCA_MENSAL);
        
        // Adiciona aporte
        if (i < meses) {
            saldo += aporteMensal;
            totalInvestido += aporteMensal;
        }
    }
    
    return {
        investido: totalInvestido,
        rendimento: saldo - totalInvestido,
        valorFinal: saldo,
        ir: 0
    };
}

// Cálculo do Tesouro Selic
function calcularTesouro(valorInicial, aporteMensal, meses) {
    const taxaMensal = Math.pow(1 + TAXA_SELIC_ANUAL, 1/12) - 1;
    let saldo = valorInicial;
    let totalInvestido = valorInicial;
    
    for (let i = 0; i < meses; i++) {
        // Aplica rendimento
        saldo = saldo * (1 + taxaMensal);
        
        // Adiciona aporte
        if (i < meses) {
            saldo += aporteMensal;
            totalInvestido += aporteMensal;
        }
    }
    
    const rendimentoBruto = saldo - totalInvestido;
    
    // Calcula IR
    const aliquotaIR = calcularIR(meses);
    const ir = rendimentoBruto * aliquotaIR;
    
    // Calcula taxa de custódia (0,20% ao ano sobre o saldo final)
    const anos = meses / 12;
    const taxaCustodia = saldo * TAXA_CUSTODIA * anos;
    
    const valorFinal = saldo - ir - taxaCustodia;
    
    return {
        investido: totalInvestido,
        rendimento: rendimentoBruto,
        valorFinal: valorFinal,
        ir: ir,
        taxaCustodia: taxaCustodia
    };
}

// Função principal de cálculo
function calcular() {
    // Pega os valores
    const valorInicial = parseFloat(document.getElementById('valorInicial').value) || 0;
    const aporteMensal = parseFloat(document.getElementById('aporteMensal').value) || 0;
    const prazo = parseInt(document.getElementById('prazo').value) || 1;
    
    // Valida
    if (valorInicial <= 0 && aporteMensal <= 0) {
        alert('Por favor, insira um valor inicial ou aporte mensal!');
        return;
    }
    
    if (prazo <= 0) {
        alert('Por favor, insira um prazo válido!');
        return;
    }
    
    // Calcula
    const poupanca = calcularPoupanca(valorInicial, aporteMensal, prazo);
    const tesouro = calcularTesouro(valorInicial, aporteMensal, prazo);
    
    // Mostra resultados
    mostrarResultados(poupanca, tesouro, prazo);
    
    // Scroll suave até os resultados
    document.getElementById('resultados').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Mostra os resultados na tela
function mostrarResultados(poupanca, tesouro, meses) {
    // Mostra a seção
    const resultados = document.getElementById('resultados');
    resultados.style.display = 'block';
    
    // Poupança
    document.getElementById('investidoPoupanca').textContent = formatMoney(poupanca.investido);
    document.getElementById('rendimentoPoupanca').textContent = formatMoney(poupanca.rendimento);
    document.getElementById('finalPoupanca').textContent = formatMoney(poupanca.valorFinal);
    
    // Tesouro
    document.getElementById('investidoTesouro').textContent = formatMoney(tesouro.investido);
    document.getElementById('rendimentoTesouro').textContent = formatMoney(tesouro.rendimento);
    document.getElementById('irTesouro').textContent = '-' + formatMoney(tesouro.ir);
    document.getElementById('taxaTesouro').textContent = '-' + formatMoney(tesouro.taxaCustodia);
    document.getElementById('finalTesouro').textContent = formatMoney(tesouro.valorFinal);
    
    // Diferença
    const diferenca = tesouro.valorFinal - poupanca.valorFinal;
    document.getElementById('diferenca').textContent = formatMoney(diferenca);
    
    // Texto da diferença
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    let periodoTexto = '';
    
    if (anos > 0) {
        periodoTexto = `${anos} ano${anos > 1 ? 's' : ''}`;
        if (mesesRestantes > 0) {
            periodoTexto += ` e ${mesesRestantes} ${mesesRestantes > 1 ? 'meses' : 'mês'}`;
        }
    } else {
        periodoTexto = `${meses} ${meses > 1 ? 'meses' : 'mês'}`;
    }
    
    const percentualGanho = ((diferenca / poupanca.valorFinal) * 100).toFixed(1);
    document.getElementById('diferencaTexto').textContent = 
        `Em ${periodoTexto}, você ganha ${percentualGanho}% a mais no Tesouro Direto!`;
    
    // Barras visuais
    const maxValor = Math.max(poupanca.valorFinal, tesouro.valorFinal);
    const poupancaPercent = (poupanca.valorFinal / maxValor) * 100;
    const tesouroPercent = (tesouro.valorFinal / maxValor) * 100;
    
    setTimeout(() => {
        document.getElementById('barPoupanca').style.width = poupancaPercent + '%';
        document.getElementById('barTesouro').style.width = tesouroPercent + '%';
        document.getElementById('barValuePoupanca').textContent = formatMoney(poupanca.valorFinal);
        document.getElementById('barValueTesouro').textContent = formatMoney(tesouro.valorFinal);
    }, 100);
}

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
    console.log('Calculadora carregada!');
    
    // Calcula automaticamente ao mudar inputs (opcional)
    /*
    ['valorInicial', 'aporteMensal', 'prazo'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            if (document.getElementById('resultados').style.display === 'block') {
                calcular();
            }
        });
    });
    */
});

