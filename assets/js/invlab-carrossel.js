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

            // 🚀 OTIMIZAÇÃO: Renderiza IMEDIATAMENTE com dados de fallback
            this.data = {
                selic: 13.75, ipca: 4.5, ipca15: 4.3, igpm: 3.8,
                cdi: 13.65, poupanca: 0.5, dolar: 5.85, euro: 6.20,
                bitcoin: 285000, ethereum: 15800, ibovespa: 125000
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
        
        // SLIDE 1 - SELIC
        const selicSlide = {
            type: 'selic',
            label: 'SELIC',
            value: `${this.bcbApi.formatPercent(this.data.selic, 2)}`
        };

        // SLIDE 2 - CDI
        const cdiSlide = {
            type: 'cdi',
            label: 'CDI',
            value: `${this.bcbApi.formatPercent(this.data.cdi, 2)}`
        };

        // SLIDE 3 - IPCA
        const ipcaSlide = {
            type: 'ipca',
            label: 'IPCA',
            value: `${this.bcbApi.formatPercent(this.data.ipca, 2)}`
        };

        // SLIDE 4 - IGP-M
        const igpmSlide = {
            type: 'igpm',
            label: 'IGP-M',
            value: `${this.bcbApi.formatPercent(this.data.igpm || 3.8, 2)}`
        };

        // SLIDE 5 - POUPANÇA
        const poupancaAnual = this.bcbApi.calcularPoupancaAnual(this.data.selic, this.data.poupanca);
        const poupancaSlide = {
            type: 'poupanca',
            label: 'Poupança',
            value: `${this.bcbApi.formatPercent(poupancaAnual, 2)}`
        };

        // SLIDE 6 - DÓLAR
        const dolarSlide = {
            type: 'dolar',
            label: 'Dólar',
            value: `R$ ${this.bcbApi.formatCurrency(this.data.dolar, 2)}`
        };

        // SLIDE 7 - EURO
        const euroSlide = {
            type: 'euro',
            label: 'Euro',
            value: `R$ ${this.bcbApi.formatCurrency(this.data.euro || 6.20, 2)}`
        };

        // SLIDE 8 - IBOVESPA
        const ibovespaValue = this.data.ibovespa || 125000;
        const ibovespaSlide = {
            type: 'ibovespa',
            label: 'IBOVESPA',
            value: `${this.stockApi ? this.stockApi.formatIbovespa(ibovespaValue) : ibovespaValue.toLocaleString('pt-BR')} pts`
        };

        // SLIDE 9 - BITCOIN
        const bitcoinValue = this.data.bitcoin || 285000;
        const bitcoinSlide = {
            type: 'bitcoin',
            label: 'Bitcoin',
            value: `${this.cryptoApi ? this.cryptoApi.formatCryptoPrice(bitcoinValue) : 'R$ ' + Math.floor(bitcoinValue/1000) + 'k'}`
        };

        // SLIDE 10 - ETHEREUM
        const ethereumValue = this.data.ethereum || 15800;
        const ethereumSlide = {
            type: 'ethereum',
            label: 'Ethereum',
            value: `${this.cryptoApi ? this.cryptoApi.formatCryptoPrice(ethereumValue) : 'R$ ' + Math.floor(ethereumValue/1000) + 'k'}`
        };

        return [selicSlide, cdiSlide, ipcaSlide, igpmSlide, poupancaSlide, dolarSlide, euroSlide, ibovespaSlide, bitcoinSlide, ethereumSlide];
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

