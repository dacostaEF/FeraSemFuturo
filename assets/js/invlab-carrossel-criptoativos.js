/**
 * ============================================
 * INVLAB CARROSSEL - CRIPTOATIVOS
 * Indicadores: Bitcoin, Ethereum, Dólar
 * ============================================
 */

class InvlabCarouselCriptoativos {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bcbApi = new BCBApiClient();
        this.cryptoApi = window.CryptoApiClient ? new CryptoApiClient() : null;
        this.data = null;
        this.init();
    }

    async init() {
        try {
            if (!this.container) {
                console.error('❌ Container do carrossel não encontrado!');
                return;
            }

            // 🚀 Renderiza IMEDIATAMENTE com dados de fallback
            this.data = {
                bitcoin: 285000,
                ethereum: 15800,
                dolar: 5.85
            };
            
            this.render();
            console.log('⚡ Carrossel CRIPTOATIVOS renderizado instantaneamente');
            
            // Atualiza dados reais em background
            this.updateDataInBackground();
            
        } catch (error) {
            console.error('❌ Erro ao inicializar carrossel:', error);
            this.showError();
        }
    }

    async updateDataInBackground() {
        try {
            console.log('🔄 Atualizando dados de Criptoativos...');
            
            // BCB (Dólar)
            const bcbData = await this.bcbApi.getAllData().catch(error => {
                console.warn('⚠️ Falha na API BCB, mantendo valores fallback:', error);
                return null;
            });
            
            // Cripto (Bitcoin, Ethereum)
            let cryptoData = null;
            if (this.cryptoApi) {
                cryptoData = await this.cryptoApi.getCryptoPrices().catch(error => {
                    console.warn('⚠️ Falha na API Cripto, mantendo valores fallback:', error);
                    return null;
                });
            }
            
            let hasUpdates = false;
            if (bcbData) {
                this.data = { ...this.data, ...bcbData };
                hasUpdates = true;
            }
            if (cryptoData) {
                this.data = { ...this.data, ...cryptoData };
                hasUpdates = true;
            }
            
            if (hasUpdates) {
                console.log('✅ Dados atualizados, re-renderizando carrossel');
                this.render();
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao atualizar dados em background:', error);
        }
    }

    showError() {
        if (this.container) {
            this.container.innerHTML = '<div class="invlab-carousel-error">Erro ao carregar dados econômicos. Tente recarregar a página.</div>';
        }
    }

    render() {
        if (!this.container || !this.data) return;

        this.container.innerHTML = '';

        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'invlab-carousel-wrapper';

        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'invlab-carousel-slides';

        const slides = this.createSlides();

        // Renderiza slides 5x para garantir movimento contínuo
        for (let i = 0; i < 5; i++) {
            slides.forEach(slideData => {
                const slide = this.createSlide(slideData);
                slidesContainer.appendChild(slide);
            });
        }

        carouselWrapper.appendChild(slidesContainer);
        this.container.appendChild(carouselWrapper);

        console.log('✅ Carrossel CRIPTOATIVOS renderizado com sucesso!');
    }

    createSlides() {
        const slides = [];
        
        // BITCOIN
        const bitcoinValue = this.data.bitcoin || 285000;
        slides.push({
            type: 'bitcoin',
            label: 'Bitcoin',
            value: `${this.cryptoApi ? this.cryptoApi.formatCryptoPrice(bitcoinValue) : 'R$ ' + Math.floor(bitcoinValue/1000) + 'k'}`
        });

        // ETHEREUM
        const ethereumValue = this.data.ethereum || 15800;
        slides.push({
            type: 'ethereum',
            label: 'Ethereum',
            value: `${this.cryptoApi ? this.cryptoApi.formatCryptoPrice(ethereumValue) : 'R$ ' + Math.floor(ethereumValue/1000) + 'k'}`
        });

        // DÓLAR (impacta cripto)
        slides.push({
            type: 'dolar',
            label: 'Dólar',
            value: `R$ ${this.bcbApi.formatCurrency(this.data.dolar, 2)}`
        });

        return slides;
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
    console.log('🚀 Inicializando INVLAB Carrossel CRIPTOATIVOS...');
    
    if (typeof BCBApiClient === 'undefined') {
        console.error('❌ BCBApiClient não carregado!');
        return;
    }
    
    if (typeof CryptoApiClient === 'undefined') {
        console.warn('⚠️ CryptoApiClient não carregado. Usando valores fallback.');
    }
    
    const carouselContainer = document.getElementById('invlab-carousel-container');
    
    if (carouselContainer) {
        window.invlabCarouselCriptoativos = new InvlabCarouselCriptoativos('invlab-carousel-container');
    } else {
        console.warn('⚠️ Container do carrossel não encontrado.');
    }
});

