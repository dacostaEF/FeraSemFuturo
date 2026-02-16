/**
 * ============================================
 * INVLAB CARROSSEL - RENDA VARIÁVEL
 * Indicadores: Ibovespa, Selic, Dólar, Euro
 * ============================================
 */

class InvlabCarouselRendaVariavel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bcbApi = new BCBApiClient();
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

            // 🚀 Renderiza IMEDIATAMENTE com dados de fallback
            this.data = {
                ibovespa: 186000,
                selic: 13.75,
                dolar: 5.85,
                euro: 6.20
            };
            
            this.render();
            console.log('⚡ Carrossel RENDA VARIÁVEL renderizado instantaneamente');
            
            // Atualiza dados reais em background
            this.updateDataInBackground();
            
        } catch (error) {
            console.error('❌ Erro ao inicializar carrossel:', error);
            this.showError();
        }
    }

    async updateDataInBackground() {
        try {
            console.log('🔄 Atualizando dados de Renda Variável...');
            
            // BCB (Selic, Dólar, Euro)
            const bcbData = await this.bcbApi.getAllData().catch(error => {
                console.warn('⚠️ Falha na API BCB, mantendo valores fallback:', error);
                return null;
            });
            
            // Bolsa (Ibovespa)
            let stockData = null;
            if (this.stockApi) {
                stockData = await this.stockApi.getIbovespa().catch(error => {
                    console.warn('⚠️ Falha na API Bolsa, mantendo valores fallback:', error);
                    return null;
                });
            }
            
            let hasUpdates = false;
            if (bcbData) {
                this.data = { ...this.data, ...bcbData };
                hasUpdates = true;
            }
            if (stockData) {
                this.data = { ...this.data, ...stockData };
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

        console.log('✅ Carrossel RENDA VARIÁVEL renderizado com sucesso!');
    }

    createSlides() {
        const slides = [];
        
        // IBOVESPA
        const ibovespaValue = this.data.ibovespa || 186000;
        slides.push({
            type: 'ibovespa',
            label: 'IBOVESPA',
            value: `${this.stockApi ? this.stockApi.formatIbovespa(ibovespaValue) : ibovespaValue.toLocaleString('pt-BR')} pts`
        });

        // SELIC (afeta ações)
        slides.push({
            type: 'selic',
            label: 'SELIC',
            value: `${this.bcbApi.formatPercent(this.data.selic, 2)}`
        });

        // DÓLAR
        slides.push({
            type: 'dolar',
            label: 'Dólar',
            value: `R$ ${this.bcbApi.formatCurrency(this.data.dolar, 2)}`
        });

        // EURO
        slides.push({
            type: 'euro',
            label: 'Euro',
            value: `R$ ${this.bcbApi.formatCurrency(this.data.euro || 6.20, 2)}`
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
    console.log('🚀 Inicializando INVLAB Carrossel RENDA VARIÁVEL...');
    
    if (typeof BCBApiClient === 'undefined') {
        console.error('❌ BCBApiClient não carregado!');
        return;
    }
    
    if (typeof StockApiClient === 'undefined') {
        console.warn('⚠️ StockApiClient não carregado. Usando valores fallback.');
    }
    
    const carouselContainer = document.getElementById('invlab-carousel-container');
    
    if (carouselContainer) {
        window.invlabCarouselRendaVariavel = new InvlabCarouselRendaVariavel('invlab-carousel-container');
    } else {
        console.warn('⚠️ Container do carrossel não encontrado.');
    }
});

