/**
 * ============================================
 * INVLAB CARROSSEL - Indicadores Econômicos
 * Carrossel com dados reais do Banco Central
 * ============================================
 */

class InvlabCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bcbApi = new BCBApiClient();
        this.cryptoApi = window.CryptoApiClient ? new CryptoApiClient() : null;
        this.stockApi = window.StockApiClient ? new StockApiClient() : null;
        this.data = null;
        this.init();
    }

    async init() {
        try {
            if (!this.container) {
                console.error('❌ Container do carrossel não encontrado!');
                return;
            }

            // 🚀 OTIMIZAÇÃO: Renderiza IMEDIATAMENTE com dados de fallback (CURADORIA PROFISSIONAL)
            this.data = {
                // Taxas e Indicadores Macro (anualizadas)
                selic: 12.25,           // % a.a
                cdi: 12.15,             // % a.a
                ipca: 4.50,             // acumulado 12m
                igpm: -0.20,            // acumulado 12m
                poupanca: 8.00,         // % a.a simulado pela SELIC
                dolar: 6.2,             // variação % 12m
                
                // Renda Variável (performance 12 meses)
                ibovespa: 9.0,          // % 12m
                ivvb11: 15.3,           // % 12m
                smal11: 13.5,           // % 12m
                divo11: 12.1,           // % 12m
                
                // Criptoativos (performance 12 meses)
                bitcoin: 92,            // % 12m
                ethereum: 54            // % 12m
            };
            
            // Renderiza primeiro (instantâneo)
            this.render();
            console.log('⚡ Carrossel renderizado instantaneamente com dados de fallback');
            
            // Atualiza dados reais em background (não bloqueia)
            this.updateDataInBackground();
            
        } catch (error) {
            console.error('❌ Erro ao inicializar carrossel:', error);
            this.showError();
        }
    }

    async updateDataInBackground() {
        try {
            console.log('🔄 Atualizando dados em background...');
            
            // Busca dados do BCB (obrigatório)
            const bcbData = await this.bcbApi.getAllData().catch(error => {
                console.warn('⚠️ Falha na API BCB, mantendo valores fallback:', error);
                return null;
            });
            
            // Busca dados de cripto (opcional)
            let cryptoData = null;
            if (this.cryptoApi) {
                cryptoData = await this.cryptoApi.getCryptoPrices().catch(error => {
                    console.warn('⚠️ Falha na API Cripto, mantendo valores fallback:', error);
                    return null;
                });
            }
            
            // Busca dados da bolsa (opcional)
            let stockData = null;
            if (this.stockApi) {
                stockData = await this.stockApi.getIbovespa().catch(error => {
                    console.warn('⚠️ Falha na API Bolsa, mantendo valores fallback:', error);
                    return null;
                });
            }
            
            // Atualiza apenas se conseguiu dados novos
            let hasUpdates = false;
            if (bcbData) {
                this.data = { ...this.data, ...bcbData };
                hasUpdates = true;
            }
            if (cryptoData) {
                this.data = { ...this.data, ...cryptoData };
                hasUpdates = true;
            }
            if (stockData) {
                this.data = { ...this.data, ...stockData };
                hasUpdates = true;
            }
            
            // Re-renderiza suavemente se houve atualizações
            if (hasUpdates) {
                console.log('✅ Dados atualizados, re-renderizando carrossel');
                this.render();
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao atualizar dados em background:', error);
            // Mantém os dados fallback
        }
    }

    showLoading() {
        // Removido - não mostra loading, renderiza direto com fallback
        // Para melhor performance percebida
    }

    showError() {
        if (this.container) {
            this.container.innerHTML = '<div class="invlab-carousel-error">Erro ao carregar dados econômicos. Tente recarregar a página.</div>';
        }
    }

    render() {
        if (!this.container || !this.data) return;

        this.container.innerHTML = '';

        // Container principal do carrossel
        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'invlab-carousel-wrapper';

        // Container dos slides com movimento contínuo
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'invlab-carousel-slides';

        // Define os slides com os textos do Noah
        const slides = this.createSlides();

        // Renderiza slides 5x para garantir movimento contínuo sem áreas vazias
        for (let i = 0; i < 5; i++) {
            slides.forEach(slideData => {
                const slide = this.createSlide(slideData);
                slidesContainer.appendChild(slide);
            });
        }

        carouselWrapper.appendChild(slidesContainer);
        this.container.appendChild(carouselWrapper);

        console.log('✅ Carrossel renderizado com sucesso!');
    }

    createSlides() {
        // Formato simplificado: apenas "Nome: Valor"
        
        // ============================================
        // 📊 MACROECONOMIA E RENDA FIXA (anualizadas)
        // ============================================
        
        // SLIDE 1 - SELIC (a.a)
        const selicSlide = {
            type: 'selic',
            label: 'SELIC',
            value: `${this.bcbApi.formatPercent(this.data.selic, 2)} a.a`
        };

        // SLIDE 2 - CDI (a.a)
        const cdiSlide = {
            type: 'cdi',
            label: 'CDI',
            value: `${this.bcbApi.formatPercent(this.data.cdi, 2)} a.a`
        };

        // SLIDE 3 - IPCA (acumulado 12 meses)
        const ipcaSlide = {
            type: 'ipca',
            label: 'IPCA',
            value: `${this.bcbApi.formatPercent(this.data.ipca, 2)} (12m)`
        };

        // SLIDE 4 - IGP-M (acumulado 12 meses)
        const igpmSlide = {
            type: 'igpm',
            label: 'IGP-M',
            value: `${this.bcbApi.formatPercent(this.data.igpm, 2)} (12m)`
        };

        // SLIDE 5 - POUPANÇA (a.a)
        const poupancaSlide = {
            type: 'poupanca',
            label: 'Poupança',
            value: `${this.bcbApi.formatPercent(this.data.poupanca, 2)} a.a`
        };

        // SLIDE 6 - DÓLAR (variação 12 meses)
        const dolarSlide = {
            type: 'dolar',
            label: 'Dólar',
            value: `${this.data.dolar >= 0 ? '+' : ''}${this.bcbApi.formatPercent(this.data.dolar, 1)} (12m)`
        };

        // ============================================
        // 📈 RENDA VARIÁVEL (performance 12 meses)
        // ============================================
        
        // SLIDE 7 - IBOVESPA (12m)
        const ibovespaSlide = {
            type: 'ibovespa',
            label: 'IBOVESPA',
            value: `+${this.bcbApi.formatPercent(this.data.ibovespa, 1)} (12m)`
        };

        // SLIDE 8 - IVVB11 (S&P 500 - 12m)
        const ivvb11Slide = {
            type: 'ivvb11',
            label: 'IVVB11',
            value: `+${this.bcbApi.formatPercent(this.data.ivvb11, 1)} (12m)`
        };

        // SLIDE 9 - SMAL11 (Small Caps - 12m)
        const smal11Slide = {
            type: 'smal11',
            label: 'SMAL11',
            value: `+${this.bcbApi.formatPercent(this.data.smal11, 1)} (12m)`
        };

        // SLIDE 10 - DIVO11 (Dividendos - 12m)
        const divo11Slide = {
            type: 'divo11',
            label: 'DIVO11',
            value: `+${this.bcbApi.formatPercent(this.data.divo11, 1)} (12m)`
        };

        // ============================================
        // ₿ CRIPTOATIVOS (performance 12 meses)
        // ============================================
        
        // SLIDE 11 - BITCOIN (12m)
        const bitcoinSlide = {
            type: 'bitcoin',
            label: 'Bitcoin',
            value: `+${this.bcbApi.formatPercent(this.data.bitcoin, 0)} (12m)`
        };

        // SLIDE 12 - ETHEREUM (12m)
        const ethereumSlide = {
            type: 'ethereum',
            label: 'Ethereum',
            value: `+${this.bcbApi.formatPercent(this.data.ethereum, 0)} (12m)`
        };

        return [selicSlide, cdiSlide, ipcaSlide, igpmSlide, poupancaSlide, dolarSlide, ibovespaSlide, ivvb11Slide, smal11Slide, divo11Slide, bitcoinSlide, ethereumSlide];
    }

    createSlide(slideData) {
        const slide = document.createElement('div');
        slide.className = `invlab-carousel-slide ${slideData.type}`;

        slide.innerHTML = `
            <div class="invlab-slide-content">
                <div class="invlab-slide-label">${slideData.label}:</div>
                <div class="invlab-slide-value">${slideData.value}</div>
            </div>
        `;

        // Carrossel meramente informativo - sem ações de clique

        return slide;
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Inicializa o carrossel quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando INVLAB Carrossel...');
    
    // Verifica se a API principal (BCB) está disponível
    if (typeof BCBApiClient === 'undefined') {
        console.error('❌ BCBApiClient não carregado! Carrossel não será exibido.');
        return;
    }
    
    // Avisos se APIs opcionais não estiverem disponíveis
    if (typeof CryptoApiClient === 'undefined') {
        console.warn('⚠️ CryptoApiClient não carregado. Usando valores fallback para cripto.');
    }
    if (typeof StockApiClient === 'undefined') {
        console.warn('⚠️ StockApiClient não carregado. Usando valores fallback para bolsa.');
    }
    
    const carouselContainer = document.getElementById('invlab-carousel-container');
    
    if (carouselContainer) {
        window.invlabCarousel = new InvlabCarousel('invlab-carousel-container');
    } else {
        console.warn('⚠️ Container do carrossel não encontrado. O carrossel não será exibido.');
    }
});

// Função global para reinicializar o carrossel (útil para debugging)
window.reloadInvlabCarousel = () => {
    if (window.invlabCarousel) {
        window.invlabCarousel.destroy();
        window.invlabCarousel = new InvlabCarousel('invlab-carousel-container');
    }
};

// Função para limpar todo o cache
window.clearInvlabCache = () => {
    localStorage.removeItem('invlab_bcb_data');
    localStorage.removeItem('invlab_crypto_data');
    localStorage.removeItem('invlab_stock_data');
    console.log('✅ Cache limpo! Recarregue a página.');
};

