/**
 * ============================================
 * INVLAB - Cliente API CoinGecko
 * Integração para cotações de criptomoedas
 * ============================================
 */

class CryptoApiClient {
    constructor() {
        this.baseURL = 'https://api.coingecko.com/api/v3/simple/price';
        this.cacheKey = 'invlab_crypto_data';
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutos (cripto muda rápido)
    }

    /**
     * Busca cotações de Bitcoin e Ethereum em BRL
     * @returns {Promise<Object>} - Objeto com cotações BTC e ETH
     */
    async getCryptoPrices() {
        try {
            // Tenta buscar do cache primeiro
            const cached = this.getFromCache();
            if (cached) {
                console.log('₿ Cripto carregadas do cache');
                return cached;
            }

            console.log('📡 Buscando cotações de criptomoedas...');

            const url = `${this.baseURL}?ids=bitcoin,ethereum&vs_currencies=brl`;
            
            // Timeout de 3 segundos para não travar o carrossel
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(url, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar cripto: ${response.status}`);
            }
            
            const data = await response.json();
            
            const cryptoData = {
                bitcoin: data.bitcoin?.brl || 285000,      // Fallback
                ethereum: data.ethereum?.brl || 15800,     // Fallback
                timestamp: Date.now()
            };

            // Salva no cache
            this.saveToCache(cryptoData);

            console.log('✅ Criptomoedas carregadas:', cryptoData);
            return cryptoData;

        } catch (error) {
            console.warn('⚠️ Cripto usando fallback (API indisponível):', error.message);
            
            // Retorna valores fallback
            return {
                bitcoin: 285000,
                ethereum: 15800,
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
            console.warn('⚠️ Erro ao salvar cache cripto:', error);
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
            
            // Cache de 5 minutos (cripto muda rápido)
            if (now - cacheData.timestamp < this.cacheExpiry) {
                return cacheData.data;
            }

            localStorage.removeItem(this.cacheKey);
            return null;

        } catch (error) {
            console.warn('⚠️ Erro ao ler cache cripto:', error);
            return null;
        }
    }

    /**
     * Formata valor de cripto para exibição
     * @param {number} value - Valor a ser formatado
     * @returns {string} - Valor formatado
     */
    formatCryptoPrice(value) {
        // Se for maior que 1000, formata como milhares
        if (value >= 1000) {
            return `R$ ${(value / 1000).toFixed(0)}k`;
        }
        return `R$ ${value.toFixed(0)}`;
    }
}

// Exporta a classe para uso global
window.CryptoApiClient = CryptoApiClient;

