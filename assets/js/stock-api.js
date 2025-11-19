/**
 * ============================================
 * INVLAB - Cliente API Yahoo Finance
 * Integração para índice Ibovespa
 * ============================================
 */

class StockApiClient {
    constructor() {
        this.baseURL = 'https://query1.finance.yahoo.com/v8/finance/chart';
        this.cacheKey = 'invlab_stock_data';
        this.cacheExpiry = 15 * 60 * 1000; // 15 minutos
    }

    /**
     * Busca cotação do Ibovespa
     * @returns {Promise<Object>} - Objeto com dados do Ibovespa
     */
    async getIbovespa() {
        try {
            // Tenta buscar do cache primeiro
            const cached = this.getFromCache();
            if (cached) {
                console.log('📊 Ibovespa carregado do cache');
                return cached;
            }

            console.log('📡 Buscando cotação do Ibovespa...');

            const url = `${this.baseURL}/^BVSP`;
            
            // Timeout de 3 segundos para não travar o carrossel
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(url, {
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar Ibovespa: ${response.status}`);
            }
            
            const data = await response.json();
            
            const quote = data.chart?.result?.[0]?.meta?.regularMarketPrice;
            
            const stockData = {
                ibovespa: quote || 125000,  // Fallback
                timestamp: Date.now()
            };

            // Salva no cache
            this.saveToCache(stockData);

            console.log('✅ Ibovespa carregado:', stockData);
            return stockData;

        } catch (error) {
            console.warn('⚠️ Ibovespa usando fallback (API indisponível):', error.message);
            
            // Retorna valor fallback
            return {
                ibovespa: 125000,
                timestamp: Date.now()
            };
        }
    }

    /**
     * Salva dados no cache do navegador
     * @param {Object} data - Dados a serem salvos
     */
    saveToCache(data) {
        try {
            const cacheData = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('⚠️ Erro ao salvar cache stock:', error);
        }
    }

    /**
     * Busca dados do cache se ainda válidos
     * @returns {Object|null} - Dados do cache ou null
     */
    getFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const now = Date.now();
            
            // Cache de 15 minutos
            if (now - cacheData.timestamp < this.cacheExpiry) {
                return cacheData.data;
            }

            localStorage.removeItem(this.cacheKey);
            return null;

        } catch (error) {
            console.warn('⚠️ Erro ao ler cache stock:', error);
            return null;
        }
    }

    /**
     * Formata pontos do Ibovespa
     * @param {number} value - Valor a ser formatado
     * @returns {string} - Valor formatado
     */
    formatIbovespa(value) {
        // Formata como milhares com separador de milhar
        return value.toLocaleString('pt-BR', { 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
        });
    }
}

// Exporta a classe para uso global
window.StockApiClient = StockApiClient;

