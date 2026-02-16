const express = require('express');
const compression = require('compression');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Compressão GZIP
app.use(express.static(__dirname, {
    maxAge: '1d', // Cache de 1 dia para assets
    etag: true
}));

// Headers de segurança
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para artigos
app.get('/artigo/:nome', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', `artigo-${req.params.nome}.html`));
});

// Rota para comparador
app.get('/comparador', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'comparador-investimentos.html'));
});

// ✅ NOVO: Proxy para API do Ibovespa (Brapi)
app.get('/api/ibovespa', async (req, res) => {
    try {
        console.log('📡 [Proxy] Buscando Ibovespa via Brapi...');
        
        // ✅ Token da API Brapi
        const BRAPI_TOKEN = 'rn54bZXu2iFhXug2JuAzD7';
        
        // ✅ Símbolo correto do Ibovespa na Brapi: ^BVSP (não BVSP)
        const brapiUrl = `https://brapi.dev/api/quote/%5EBVSP?token=${BRAPI_TOKEN}`;
        
        https.get(brapiUrl, (apiRes) => {
            let data = '';
            
            // Log do status
            console.log(`📊 [Proxy] Status Brapi: ${apiRes.statusCode}`);
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                try {
                    console.log('📦 [Proxy] Resposta Brapi recebida:', data.substring(0, 200));
                    const jsonData = JSON.parse(data);
                    
                    // Extrai o valor do Ibovespa
                    let ibovespaValue = null;
                    if (jsonData.results && Array.isArray(jsonData.results) && jsonData.results.length > 0) {
                        const result = jsonData.results[0];
                        console.log('📊 [Proxy] Resultado extraído:', result);
                        ibovespaValue = result.regularMarketPrice || 
                                       result.price || 
                                       result.lastPrice ||
                                       result.close ||
                                       result.currentPrice ||
                                       result.marketPrice;
                    }
                    
                    console.log('💰 [Proxy] Valor encontrado:', ibovespaValue);
                    
                    if (ibovespaValue && !isNaN(ibovespaValue) && ibovespaValue > 100000) {
                        console.log('✅ [Proxy] Ibovespa retornado com sucesso:', ibovespaValue);
                        res.json({
                            success: true,
                            ibovespa: ibovespaValue,
                            timestamp: Date.now(),
                            source: 'brapi'
                        });
                    } else {
                        // Se ^BVSP falhar, tenta IBOV11 como alternativa
                        console.log('⚠️ [Proxy] ^BVSP não retornou valor válido, tentando IBOV11...');
                        tryAlternativeAPI(res);
                    }
                } catch (parseError) {
                    console.error('❌ [Proxy] Erro ao parsear resposta Brapi:', parseError);
                    console.error('📄 [Proxy] Dados recebidos:', data);
                    tryAlternativeAPI(res);
                }
            });
        }).on('error', (error) => {
            console.error('❌ [Proxy] Erro ao buscar Brapi:', error);
            tryAlternativeAPI(res);
        });
        
    } catch (error) {
        console.error('❌ [Proxy] Erro no proxy Ibovespa:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            ibovespa: 187000 // Fallback mais realista
        });
    }
});

// Função auxiliar para tentar API alternativa
function tryAlternativeAPI(res) {
    // Tenta buscar via IBOV11 como alternativa (se ^BVSP falhou)
    const BRAPI_TOKEN = 'rn54bZXu2iFhXug2JuAzD7';
    const altUrl = `https://brapi.dev/api/quote/IBOV11?token=${BRAPI_TOKEN}`;
    console.log('🔄 [Proxy] Tentando IBOV11 como alternativa...');
    
    https.get(altUrl, (apiRes) => {
        let data = '';
        
        apiRes.on('data', (chunk) => {
            data += chunk;
        });
        
        apiRes.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                let ibovespaValue = null;
                
                if (jsonData.results && jsonData.results.length > 0) {
                    const result = jsonData.results[0];
                    ibovespaValue = result.regularMarketPrice || 
                                   result.price || 
                                   result.lastPrice ||
                                   result.close ||
                                   result.currentPrice;
                }
                
                if (ibovespaValue && !isNaN(ibovespaValue) && ibovespaValue > 100000) {
                    console.log('✅ [Proxy] IBOV11 retornou valor:', ibovespaValue);
                    res.json({
                        success: true,
                        ibovespa: ibovespaValue,
                        timestamp: Date.now(),
                        source: 'brapi-ibov11'
                    });
                } else {
                    // Última tentativa: usar valor aproximado atual
                    console.log('⚠️ [Proxy] Todas as APIs falharam, usando valor aproximado');
                    res.json({
                        success: false,
                        ibovespa: 186000, // Valor aproximado baseado no teste
                        timestamp: Date.now(),
                        message: 'API indisponível, usando valor aproximado'
                    });
                }
            } catch (error) {
                console.error('❌ [Proxy] Erro na API alternativa:', error);
                res.json({
                    success: false,
                    ibovespa: 186000, // Valor aproximado
                    timestamp: Date.now(),
                    message: 'Erro ao processar resposta'
                });
            }
        });
    }).on('error', (error) => {
        console.error('❌ [Proxy] Erro na API alternativa:', error);
        res.json({
            success: false,
            ibovespa: 186000, // Valor aproximado
            timestamp: Date.now(),
            message: 'Erro de conexão'
        });
    });
}

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Feras Sem Futuro rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

