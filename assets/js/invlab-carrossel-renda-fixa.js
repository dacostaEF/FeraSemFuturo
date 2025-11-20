/**
 * ============================================
 * INVLAB CARROSSEL - RENDA FIXA
 * Indicadores: Selic, CDI, IPCA, IGP-M, Poupança, Dólar
 * ============================================
 */

class InvlabCarouselRendaFixa {
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

            // 🚀 Renderiza IMEDIATAMENTE com dados de fallback
            this.data = {
                selic: 13.75,
                cdi: 13.65,
                ipca: 4.5,
                igpm: 3.8,
                poupanca: 0.5,
                dolar: 5.85
            };
            
            this.render();
            console.log('⚡ Carrossel RENDA FIXA renderizado instantaneamente');
            
            // Atualiza dados reais em background
            this.updateDataInBackground();
            
        } catch (error) {
            console.error('❌ Erro ao inicializar carrossel:', error);
            this.showError();
        }
    }

    async updateDataInBackground() {
        try {
            console.log('🔄 Atualizando dados de Renda Fixa...');
            
            const bcbData = await this.bcbApi.getAllData().catch(error => {
                console.warn('⚠️ Falha na API BCB, mantendo valores fallback:', error);
                return null;
            });
            
            if (bcbData) {
                this.data = { ...this.data, ...bcbData };
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

        console.log('✅ Carrossel RENDA FIXA renderizado com sucesso!');
    }

    createSlides() {
        const slides = [];
        
        // SELIC
        slides.push({
            type: 'selic',
            label: 'SELIC',
            value: `${this.bcbApi.formatPercent(this.data.selic, 2)}`
        });

        // CDI
        slides.push({
            type: 'cdi',
            label: 'CDI',
            value: `${this.bcbApi.formatPercent(this.data.cdi, 2)}`
        });

        // IPCA
        slides.push({
            type: 'ipca',
            label: 'IPCA',
            value: `${this.bcbApi.formatPercent(this.data.ipca, 2)}`
        });

        // IGP-M
        slides.push({
            type: 'igpm',
            label: 'IGP-M',
            value: `${this.bcbApi.formatPercent(this.data.igpm || 3.8, 2)}`
        });

        // POUPANÇA
        const poupancaAnual = this.bcbApi.calcularPoupancaAnual(this.data.selic, this.data.poupanca);
        slides.push({
            type: 'poupanca',
            label: 'Poupança',
            value: `${this.bcbApi.formatPercent(poupancaAnual, 2)}`
        });

        // DÓLAR
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
    console.log('🚀 Inicializando INVLAB Carrossel RENDA FIXA...');
    
    if (typeof BCBApiClient === 'undefined') {
        console.error('❌ BCBApiClient não carregado!');
        return;
    }
    
    const carouselContainer = document.getElementById('invlab-carousel-container');
    
    if (carouselContainer) {
        window.invlabCarouselRendaFixa = new InvlabCarouselRendaFixa('invlab-carousel-container');
    } else {
        console.warn('⚠️ Container do carrossel não encontrado.');
    }
});

