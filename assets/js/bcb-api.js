/**
 * ============================================
 * INVLAB - Cliente API Banco Central do Brasil
 * Integração com API BCB para dados econômicos
 * ============================================
 */

class BCBApiClient {
    constructor() {
        this.baseURL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs';
        this.cacheKey = 'invlab_bcb_data';
        this.cacheExpiry = 60 * 60 * 1000; // 1 hora em milissegundos
        
        // Códigos das séries da API BCB
        this.series = {
            SELIC: 432,        // Meta Selic
            IPCA: 433,         // IPCA (inflação)
            IPCA15: 7478,      // IPCA-15 (prévia inflação)
            IGPM: 189,         // IGP-M (inflação contratos)
            CDI: 12,           // CDI
            POUPANCA: 195,     // Poupança
            DOLAR_PTAX: 1,     // Dólar PTAX (compra)
            EURO_PTAX: 21619   // Euro PTAX (compra)
        };
    }

    /**
     * Busca o último valor de uma série temporal
     * @param {number} serieCode - Código da série na API BCB
     * @returns {Promise<number|null>} - Valor da série ou null se erro
     */
    async getLatestValue(serieCode) {
        try {
            const url = `${this.baseURL}.${serieCode}/dados/ultimos/1?formato=json`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar série ${serieCode}: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data && data.length > 0 && data[0].valor) {
                return parseFloat(data[0].valor);
            }
            
            return null;
        } catch (error) {
            console.error(`Erro ao buscar série ${serieCode}:`, error);
            return null;
        }
    }

    /**
     * Busca todos os dados econômicos
     * @returns {Promise<Object>} - Objeto com todos os indicadores
     */
    async getAllData() {
        try {
            // Tenta buscar do cache primeiro
            const cached = this.getFromCache();
            if (cached) {
                console.log('📊 Dados carregados do cache');
                return cached;
            }

            console.log('📡 Buscando dados da API BCB...');

            // Busca todos os dados em paralelo
            const [selic, ipca, ipca15, igpm, cdi, poupanca, dolar, euro] = await Promise.all([
                this.getLatestValue(this.series.SELIC),
                this.getLatestValue(this.series.IPCA),
                this.getLatestValue(this.series.IPCA15),
                this.getLatestValue(this.series.IGPM),
                this.getLatestValue(this.series.CDI),
                this.getLatestValue(this.series.POUPANCA),
                this.getLatestValue(this.series.DOLAR_PTAX),
                this.getLatestValue(this.series.EURO_PTAX)
            ]);

            const data = {
                selic: selic || 13.75,       // Fallback para 13.75%
                ipca: ipca || 4.5,           // Fallback para 4.5%
                ipca15: ipca15 || 4.3,       // Fallback para 4.3%
                igpm: igpm || 3.8,           // Fallback para 3.8%
                cdi: cdi || 13.65,           // Fallback para 13.65%
                poupanca: poupanca || 0.5,   // Fallback para 0.5% a.m.
                dolar: dolar || 5.85,        // Fallback para R$ 5,85
                euro: euro || 6.20,          // Fallback para R$ 6,20
                timestamp: Date.now()
            };

            // Salva no cache
            this.saveToCache(data);

            console.log('✅ Dados da API BCB carregados:', data);
            return data;

        } catch (error) {
            console.error('❌ Erro ao buscar dados da API BCB:', error);
            
            // Retorna valores fallback em caso de erro
            return {
                selic: 13.75,
                ipca: 4.5,
                ipca15: 4.3,
                igpm: 3.8,
                cdi: 13.65,
                poupanca: 0.5,
                dolar: 5.85,
                euro: 6.20,
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
            console.log('💾 Dados salvos no cache');
        } catch (error) {
            console.warn('⚠️ Erro ao salvar cache:', error);
        }
    }

    /**
     * Busca dados do cache se ainda válidos
     * @returns {Object|null} - Dados do cache ou null se expirado/inexistente
     */
    getFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const now = Date.now();
            
            // Verifica se o cache ainda é válido (1 hora)
            if (now - cacheData.timestamp < this.cacheExpiry) {
                return cacheData.data;
            }

            // Cache expirado, remove
            localStorage.removeItem(this.cacheKey);
            return null;

        } catch (error) {
            console.warn('⚠️ Erro ao ler cache:', error);
            return null;
        }
    }

    /**
     * Limpa o cache manualmente
     */
    clearCache() {
        try {
            localStorage.removeItem(this.cacheKey);
            console.log('🗑️ Cache limpo');
        } catch (error) {
            console.warn('⚠️ Erro ao limpar cache:', error);
        }
    }

    /**
     * Calcula a rentabilidade da poupança em % a.a.
     * @param {number} selic - Taxa Selic em % a.a.
     * @param {number} poupancaMensal - Rentabilidade mensal da poupança
     * @returns {number} - Rentabilidade da poupança em % a.a.
     */
    calcularPoupancaAnual(selic, poupancaMensal) {
        // Fórmula: (1 + taxa_mensal)^12 - 1
        const taxaMensal = poupancaMensal / 100;
        const taxaAnual = (Math.pow(1 + taxaMensal, 12) - 1) * 100;
        return taxaAnual;
    }

    /**
     * Formata valor monetário
     * @param {number} value - Valor a ser formatado
     * @param {number} decimals - Número de casas decimais
     * @returns {string} - Valor formatado
     */
    formatCurrency(value, decimals = 2) {
        // Validação: se valor for null, undefined ou NaN, retorna 0
        if (value === null || value === undefined || isNaN(value)) {
            console.warn('⚠️ Valor inválido para formatCurrency:', value);
            return `0,${'0'.repeat(decimals)}`;
        }
        return value.toFixed(decimals).replace('.', ',');
    }

    /**
     * Formata percentual
     * @param {number} value - Valor a ser formatado
     * @param {number} decimals - Número de casas decimais
     * @returns {string} - Valor formatado com %
     */
    formatPercent(value, decimals = 2) {
        // Validação: se valor for null, undefined ou NaN, retorna 0
        if (value === null || value === undefined || isNaN(value)) {
            console.warn('⚠️ Valor inválido para formatPercent:', value);
            return `0,${'0'.repeat(decimals)}%`;
        }
        return `${value.toFixed(decimals).replace('.', ',')}%`;
    }
}

// Exporta a classe para uso global
window.BCBApiClient = BCBApiClient;

