/**
 * ============================================
 * INVLAB - Cliente API Brapi (Brasil)
 * Integração para índice Ibovespa
 * API brasileira gratuita que permite CORS
 * ============================================
 */

class StockApiClient {
    constructor() {
        // ✅ MUDANÇA: Usando proxy do servidor (mais confiável)
        this.baseURL = '/api/ibovespa';
        this.cacheKey = 'invlab_stock_data';
        this.cacheExpiry = 15 * 60 * 1000; // 15 minutos
        
        // Limpa cache se contém valor fallback antigo (125000)
        this.cleanOldFallbackCache();
    }
    
    /**
     * Limpa cache se contém valor fallback antigo
     */
    cleanOldFallbackCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (cached) {
                const cacheData = JSON.parse(cached);
                if (cacheData.data && cacheData.data.ibovespa === 125000) {
                    console.log('🗑️ Limpando cache com valor fallback antigo...');
                    this.clearCache();
                }
            }
        } catch (error) {
            // Ignora erros de parse
        }
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
                // ⚠️ Se o cache contém valor fallback (125000), ignora e busca novo
                if (cached.ibovespa === 125000) {
                    console.log('⚠️ Cache contém valor fallback, ignorando e buscando novo valor...');
                    this.clearCache(); // Limpa cache antigo
                } else {
                    console.log('📊 Ibovespa carregado do cache:', cached.ibovespa);
                    return cached;
                }
            }

            console.log('📡 Buscando cotação do Ibovespa via proxy do servidor...');

            // ✅ MUDANÇA: Usando proxy do servidor (evita CORS e é mais confiável)
            const url = '/api/ibovespa';
            console.log('🔗 URL da requisição:', url);
            
            // Timeout de 8 segundos
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            
            const response = await fetch(url, {
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.error('❌ Erro na resposta do proxy:', response.status, response.statusText);
                throw new Error(`Erro ao buscar Ibovespa: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📦 Resposta do proxy:', data);
            
            // O proxy já retorna no formato: { success: true, ibovespa: valor, timestamp: ... }
            let quote = null;
            
            if (data.success && data.ibovespa) {
                quote = data.ibovespa;
                console.log('💰 Valor do Ibovespa recebido:', quote);
            } else if (data.ibovespa && data.ibovespa !== 125000) {
                // Mesmo sem success: true, se tiver valor válido, usa
                quote = data.ibovespa;
                console.log('💰 Valor do Ibovespa recebido (sem flag success):', quote);
            }
            
            if (!quote || quote === 0 || isNaN(quote) || quote === 125000) {
                console.warn('⚠️ Valor inválido ou fallback recebido do proxy');
                quote = null;
            }
            
            const stockData = {
                ibovespa: quote || 125000,  // Fallback
                timestamp: data.timestamp || Date.now()
            };

            // Salva no cache apenas se conseguiu valor real
            if (quote && quote !== 125000 && quote > 100000) { // Validação: Ibovespa deve ser > 100k
                this.saveToCache(stockData);
                console.log('✅ Ibovespa carregado via proxy (dados reais):', stockData);
            } else {
                console.warn('⚠️ Usando valor fallback para Ibovespa:', stockData);
            }
            
            return stockData;

        } catch (error) {
            // Log detalhado do erro para debug
            console.error('❌ Erro ao buscar Ibovespa:', error);
            console.warn('⚠️ Ibovespa usando fallback (API indisponível):', error.message);
            
            // Se for erro de CORS, tentar limpar cache antigo
            if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
                console.log('🔄 Erro de CORS detectado, limpando cache antigo...');
                this.clearCache();
            }
            
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
     * Limpa o cache manualmente
     */
    clearCache() {
        try {
            localStorage.removeItem(this.cacheKey);
            console.log('🗑️ Cache do Ibovespa limpo');
        } catch (error) {
            console.warn('⚠️ Erro ao limpar cache:', error);
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

