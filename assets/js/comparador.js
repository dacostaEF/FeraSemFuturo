/* ============================================
   COMPARADOR INTELIGENTE DE INVESTIMENTOS
   JavaScript para cálculos e comparações
   ============================================ */

// DADOS SIMULADOS DE INVESTIMENTOS (na prática viria de API)
const investmentData = {
    cdb: [
        { 
            id: 'nubank-cdb', 
            name: 'Nubank', 
            subtitle: 'CDB 100% CDI',
            rate: 100, 
            rateType: 'cdi',
            tax: 'IR regressivo',
            liquidity: 'D+0',
            minValue: 1,
            adminTax: 0,
            insurance: 'FGC até R$ 250k',
            icon: '🏦'
        },
        { 
            id: 'inter-cdb', 
            name: 'Inter', 
            subtitle: 'CDB 110% CDI',
            rate: 110, 
            rateType: 'cdi',
            tax: 'IR regressivo',
            liquidity: 'D+1',
            minValue: 1,
            adminTax: 0,
            insurance: 'FGC até R$ 250k',
            icon: '💳'
        },
        { 
            id: 'xp-cdb', 
            name: 'XP Investimentos', 
            subtitle: 'CDB 115% CDI',
            rate: 115, 
            rateType: 'cdi',
            tax: 'IR regressivo',
            liquidity: 'No vencimento',
            minValue: 1000,
            adminTax: 0,
            insurance: 'FGC até R$ 250k',
            icon: '📈'
        },
        { 
            id: 'btg-cdb', 
            name: 'BTG Pactual', 
            subtitle: 'CDB 120% CDI',
            rate: 120, 
            rateType: 'cdi',
            tax: 'IR regressivo',
            liquidity: 'D+90',
            minValue: 5000,
            adminTax: 0,
            insurance: 'FGC até R$ 250k',
            icon: '🏛️'
        }
    ],
    lci: [
        { 
            id: 'safra-lci', 
            name: 'Banco Safra', 
            subtitle: 'LCI 95% CDI',
            rate: 95, 
            rateType: 'cdi',
            tax: 'Isento IR',
            liquidity: 'D+90',
            minValue: 1000,
            adminTax: 0,
            insurance: 'FGC até R$ 250k',
            icon: '🏛️'
        },
        { 
            id: 'daycoval-lca', 
            name: 'Daycoval', 
            subtitle: 'LCA 92% CDI',
            rate: 92, 
            rateType: 'cdi',
            tax: 'Isento IR',
            liquidity: 'No vencimento',
            minValue: 1000,
            adminTax: 0,
            insurance: 'FGC até R$ 250k',
            icon: '💰'
        },
        { 
            id: 'btg-lci', 
            name: 'BTG Pactual', 
            subtitle: 'LCI 98% CDI',
            rate: 98, 
            rateType: 'cdi',
            tax: 'Isento IR',
            liquidity: 'D+90',
            minValue: 5000,
            adminTax: 0,
            insurance: 'FGC até R$ 250k',
            icon: '🏡'
        }
    ],
    tesouro: [
        { 
            id: 'tesouro-selic', 
            name: 'Tesouro Selic', 
            subtitle: '100% Selic',
            rate: 100, 
            rateType: 'selic',
            tax: 'IR regressivo',
            liquidity: 'D+1',
            minValue: 30,
            adminTax: 0.20,
            insurance: 'Governo Federal',
            icon: '🇧🇷'
        },
        { 
            id: 'tesouro-ipca', 
            name: 'Tesouro IPCA+ 2029', 
            subtitle: 'IPCA + 5,5% a.a.',
            rate: 5.5, 
            rateType: 'ipca',
            tax: 'IR regressivo',
            liquidity: 'D+1',
            minValue: 30,
            adminTax: 0.20,
            insurance: 'Governo Federal',
            icon: '📊'
        },
        { 
            id: 'tesouro-prefixado', 
            name: 'Tesouro Prefixado 2027', 
            subtitle: '12,5% a.a.',
            rate: 12.5, 
            rateType: 'prefixado',
            tax: 'IR regressivo',
            liquidity: 'D+1',
            minValue: 30,
            adminTax: 0.20,
            insurance: 'Governo Federal',
            icon: '📌'
        }
    ],
    poupanca: [
        { 
            id: 'poupanca', 
            name: 'Poupança', 
            subtitle: 'Rendimento tradicional',
            rate: 0.5, 
            rateType: 'mes',
            tax: 'Isento IR',
            liquidity: 'D+0',
            minValue: 1,
            adminTax: 0,
            insurance: 'FGC até R$ 250k',
            icon: '🐷'
        }
    ]
};

// CARREGAR OPÇÕES ESPECÍFICAS
function loadSubOptions() {
    const type = document.getElementById('investmentType').value;
    const subtypeSelect = document.getElementById('investmentSubtype');
    
    subtypeSelect.innerHTML = '<option value="">Selecione um produto</option>';
    
    if (type && investmentData[type]) {
        subtypeSelect.disabled = false;
        investmentData[type].forEach(investment => {
            const option = document.createElement('option');
            option.value = investment.id;
            option.textContent = `${investment.name} - ${investment.subtitle}`;
            subtypeSelect.appendChild(option);
        });
    } else {
        subtypeSelect.disabled = true;
    }
}

// CALCULAR INVESTIMENTO
function calculateInvestment(investment, amount, months) {
    const cdiRate = 13.65; // CDI anual (jan/2025)
    const selicRate = 13.75; // Selic anual (jan/2025)
    const ipcaRate = 4.5; // IPCA anual estimado
    
    let annualRate;
    
    switch(investment.rateType) {
        case 'cdi':
            annualRate = (cdiRate * investment.rate) / 100;
            break;
        case 'selic':
            annualRate = (selicRate * investment.rate) / 100;
            break;
        case 'ipca':
            annualRate = ipcaRate + investment.rate;
            break;
        case 'prefixado':
            annualRate = investment.rate;
            break;
        case 'mes':
            // Poupança: converter de mensal para anual
            annualRate = (Math.pow(1 + investment.rate/100, 12) - 1) * 100;
            break;
        default:
            annualRate = investment.rate;
    }
    
    // Converter para taxa mensal
    const monthlyRate = Math.pow(1 + annualRate/100, 1/12) - 1;
    
    // Calcular valor futuro
    let futureValue = amount * Math.pow(1 + monthlyRate, months);
    
    // Calcular rendimento bruto
    const grossProfit = futureValue - amount;
    
    // Aplicar impostos
    let taxRate = 0;
    let taxAmount = 0;
    
    if (investment.tax === 'IR regressivo') {
        if (months <= 6) taxRate = 0.225; // 22,5%
        else if (months <= 12) taxRate = 0.20; // 20%
        else if (months <= 24) taxRate = 0.175; // 17,5%
        else taxRate = 0.15; // 15%
        
        taxAmount = grossProfit * taxRate;
        futureValue -= taxAmount;
    }
    
    // Taxa de administração (cobrada sobre o valor total)
    let adminFee = 0;
    if (investment.adminTax > 0) {
        adminFee = (futureValue * (investment.adminTax / 100) * (months / 12));
        futureValue -= adminFee;
    }
    
    const netProfit = futureValue - amount;
    
    return {
        finalValue: futureValue,
        grossProfit: grossProfit,
        netProfit: netProfit,
        taxAmount: taxAmount,
        taxRate: taxRate * 100,
        adminFee: adminFee,
        rentability: (netProfit / amount) * 100,
        monthlyRate: monthlyRate * 100
    };
}

// COMPARAR INVESTIMENTOS
function compareInvestments() {
    const type = document.getElementById('investmentType').value;
    const amount = parseFloat(document.getElementById('investmentAmount').value);
    const months = parseInt(document.getElementById('investmentTime').value);
    
    if (!type || !amount || !months) {
        alert('⚠️ Por favor, preencha todos os campos!');
        return;
    }
    
    if (amount < 1000) {
        alert('⚠️ Valor mínimo para comparação: R$ 1.000');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    
    // Scroll suave até o loading
    document.getElementById('loading').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Simular processamento (API call)
    setTimeout(() => {
        const investments = investmentData[type];
        const results = [];
        
        // Calcular cada investimento
        investments.forEach(investment => {
            // Verificar valor mínimo
            if (amount >= investment.minValue) {
                const calculation = calculateInvestment(investment, amount, months);
                results.push({
                    ...investment,
                    ...calculation
                });
            }
        });
        
        // Ordenar por melhor rentabilidade líquida
        results.sort((a, b) => b.rentability - a.rentability);
        
        // Mostrar resultados
        displayResults(results, amount, months);
        
        // Esconder loading e mostrar resultados
        document.getElementById('loading').style.display = 'none';
        document.getElementById('resultsContainer').style.display = 'block';
        
        // Scroll suave até os resultados
        document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1500);
}

// MOSTRAR RESULTADOS
function displayResults(results, amount, months) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    if (results.length === 0) {
        resultsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>Nenhum investimento disponível</h3>
                <p>O valor informado é inferior ao mínimo necessário para os produtos desta categoria.</p>
            </div>
        `;
        return;
    }
    
    results.forEach((investment, index) => {
        const card = document.createElement('div');
        
        // Definir classe do card baseado na posição
        let cardClass = 'investment-card';
        let badge = '';
        
        if (index === 0) {
            cardClass += ' best';
            badge = '<div class="card-badge">🥇 MELHOR OPÇÃO</div>';
        } else if (index === 1) {
            cardClass += ' good';
            badge = '<div class="card-badge alternative">🥈 BOA ALTERNATIVA</div>';
        } else {
            cardClass += ' average';
        }
        
        card.className = cardClass;
        
        // Montar HTML do card
        card.innerHTML = `
            ${badge}
            <div class="card-header">
                <div class="card-icon">${investment.icon}</div>
                <div class="card-info">
                    <div class="card-title">${investment.name}</div>
                    <div class="card-subtitle">${investment.subtitle}</div>
                </div>
            </div>
            
            <div class="card-details">
                <div class="detail-item">
                    <span class="detail-label">Taxa Nominal:</span>
                    <span class="detail-value neutral">${investment.rate}% ${investment.rateType.toUpperCase()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Rentabilidade Líquida:</span>
                    <span class="detail-value positive">${investment.rentability.toFixed(2)}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Impostos:</span>
                    <span class="detail-value ${investment.tax === 'Isento IR' ? 'positive' : 'neutral'}">${investment.tax}</span>
                </div>
                ${investment.taxAmount > 0 ? `
                <div class="detail-item">
                    <span class="detail-label">IR descontado:</span>
                    <span class="detail-value negative">-R$ ${investment.taxAmount.toFixed(2)}</span>
                </div>
                ` : ''}
                ${investment.adminFee > 0 ? `
                <div class="detail-item">
                    <span class="detail-label">Taxa Admin (${investment.adminTax}% a.a.):</span>
                    <span class="detail-value negative">-R$ ${investment.adminFee.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">Liquidez:</span>
                    <span class="detail-value neutral">${investment.liquidity}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Garantia:</span>
                    <span class="detail-value neutral">${investment.insurance}</span>
                </div>
            </div>
            
            <div class="final-value">
                <div class="final-amount">R$ ${formatCurrency(investment.finalValue)}</div>
                <div class="rentability">+ R$ ${formatCurrency(investment.netProfit)} de lucro líquido</div>
                <span class="rentability-label">em ${months} ${months === 1 ? 'mês' : 'meses'}</span>
            </div>
        `;
        
        resultsGrid.appendChild(card);
    });
    
    // Atualizar dica dinâmica
    updateDynamicTip(results, months);
}

// ATUALIZAR DICA DINÂMICA
function updateDynamicTip(results, months) {
    const tipElement = document.getElementById('comparadorTip');
    
    if (results.length < 2) {
        tipElement.textContent = 'Experimente comparar diferentes tipos de investimentos para tomar a melhor decisão!';
        return;
    }
    
    const best = results[0];
    const worst = results[results.length - 1];
    const difference = best.finalValue - worst.finalValue;
    
    let tip = '';
    
    if (months <= 6) {
        tip = `Em prazos curtos (até 6 meses), o IR é maior (22,5%). A diferença entre a melhor e pior opção é de R$ ${formatCurrency(difference)}. LCI/LCA (isentas de IR) podem ser vantajosas!`;
    } else if (months <= 12) {
        tip = `No prazo de 1 ano, o IR é de 20%. Investimentos isentos (LCI/LCA) ou com maior percentual do CDI são suas melhores opções. Diferença de R$ ${formatCurrency(difference)} entre as opções.`;
    } else if (months <= 24) {
        tip = `Com 2 anos, o IR cai para 17,5%. A diferença acumulada entre a melhor e pior opção é de R$ ${formatCurrency(difference)}. Vale a pena escolher bem!`;
    } else {
        tip = `No longo prazo (acima de 2 anos), o IR é de apenas 15%. Os juros compostos fazem mágica: a diferença entre opções pode chegar a R$ ${formatCurrency(difference)}!`;
    }
    
    tipElement.textContent = tip;
}

// FORMATAR MOEDA
function formatCurrency(value) {
    return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Comparador Inteligente carregado com sucesso!');
    
    // Desabilitar campo de subtipo inicialmente
    document.getElementById('investmentSubtype').disabled = true;
});

