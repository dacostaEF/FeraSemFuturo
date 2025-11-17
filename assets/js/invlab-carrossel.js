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
        this.data = null;
        this.init();
    }

    async init() {
        try {
            if (!this.container) {
                console.error('❌ Container do carrossel não encontrado!');
                return;
            }

            this.showLoading();
            this.data = await this.bcbApi.getAllData();
            this.render();
        } catch (error) {
            console.error('❌ Erro ao inicializar carrossel:', error);
            this.showError();
        }
    }

    showLoading() {
        if (this.container) {
            this.container.innerHTML = '<div class="invlab-carousel-loading">Carregando indicadores econômicos</div>';
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
            label: 'Selic',
            value: `${this.bcbApi.formatPercent(this.data.selic, 2)}`
        };

        // SLIDE 2 - IPCA
        const ipcaSlide = {
            type: 'ipca',
            label: 'IPCA',
            value: `${this.bcbApi.formatPercent(this.data.ipca, 2)}`
        };

        // SLIDE 3 - CDI
        const cdiSlide = {
            type: 'cdi',
            label: 'CDI',
            value: `${this.bcbApi.formatPercent(this.data.cdi, 2)}`
        };

        // SLIDE 4 - POUPANÇA
        const poupancaAnual = this.bcbApi.calcularPoupancaAnual(this.data.selic, this.data.poupanca);
        const poupancaSlide = {
            type: 'poupanca',
            label: 'Poupança',
            value: `${this.bcbApi.formatPercent(poupancaAnual, 2)}`
        };

        // SLIDE 5 - DÓLAR
        const dolarSlide = {
            type: 'dolar',
            label: 'Dólar',
            value: `R$ ${this.bcbApi.formatCurrency(this.data.dolar, 2)}`
        };

        return [selicSlide, ipcaSlide, cdiSlide, poupancaSlide, dolarSlide];
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

