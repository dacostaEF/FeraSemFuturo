const express = require('express');
const compression = require('compression');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;
const BRAPI_TOKEN = process.env.BRAPI_TOKEN || '';

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

// ================================================================
// Raio-X FII — proxy BRAPI com cache semanal
//
// Arquitetura híbrida intencional:
//   QUANTITATIVO (preço, P/VP, volume, histórico dividendos) → BRAPI
//   QUALITATIVO (segmento, inquilinos, vacância, estrelas)   → editorial/hardcoded
//
// Cache semanal porque esses dados mudam devagar — protege o token
// e evita latência extra a cada visita.
// ================================================================
const fiiRaioXCache = {};
const FII_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

function fetchBrapi(path) {
    return new Promise((resolve, reject) => {
        const sep = path.includes('?') ? '&' : '?';
        const url = `https://brapi.dev/api/${path}${sep}token=${BRAPI_TOKEN}`;
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error('Erro ao parsear resposta BRAPI')); }
            });
        });
        req.on('error', reject);
        req.setTimeout(8000, () => { req.destroy(); reject(new Error('Timeout BRAPI')); });
    });
}

app.get('/api/fii-raio-x/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    const agora  = Date.now();

    if (fiiRaioXCache[ticker] && (agora - fiiRaioXCache[ticker].timestamp < FII_CACHE_TTL)) {
        console.log(`📦 [Raio-X] Cache hit: ${ticker}`);
        return res.json(fiiRaioXCache[ticker].data);
    }

    console.log(`📡 [Raio-X] Buscando BRAPI para: ${ticker}`);

    try {
        const [quoteRes, divRes] = await Promise.all([
            fetchBrapi(`quote/${ticker}?fundamental=true`),
            fetchBrapi(`quote/${ticker}/dividends`)
        ]);

        const quote    = quoteRes.results?.[0] || {};
        const rawDivs  = divRes.results?.[0]?.dividendsData?.cashDividends || [];

        const payload = {
            success:   true,
            ticker,
            timestamp: agora,
            source:    'brapi',
            preco:     quote.regularMarketPrice        || null,
            variacao:  quote.regularMarketChangePercent || null,
            volume:    quote.regularMarketVolume       || null,
            pvp:       quote.priceToBook               || null,
            // Últimos 12 meses em ordem cronológica (BRAPI retorna mais recente primeiro)
            dividendos: rawDivs.slice(0, 12).reverse().map(d => ({
                data:  d.paymentDate || d.approvedOn || '',
                valor: parseFloat(d.rate || d.value || 0)
            }))
        };

        fiiRaioXCache[ticker] = { timestamp: agora, data: payload };
        res.json(payload);

    } catch (error) {
        console.error(`❌ [Raio-X] Erro ao buscar ${ticker}:`, error.message);
        // Frontend usa fallback editorial quando success: false
        res.json({ success: false, ticker, preco: null, pvp: null, volume: null, variacao: null, dividendos: [] });
    }
});

// ================================================================
// Diagnóstico Empresarial — proxy BRAPI com cache semanal
//
// Mesma arquitetura do Raio-X FII:
//   QUANTITATIVO (preço, P/L, volume, histórico dividendos) → BRAPI
//   QUALITATIVO (negócio, governança, resiliência, score)   → editorial
// ================================================================
const acaoDiagCache = {};

app.get('/api/acao-diagnostico/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    const agora  = Date.now();

    if (acaoDiagCache[ticker] && (agora - acaoDiagCache[ticker].timestamp < FII_CACHE_TTL)) {
        console.log(`📦 [Diag] Cache hit: ${ticker}`);
        return res.json(acaoDiagCache[ticker].data);
    }

    console.log(`📡 [Diag] Buscando BRAPI para: ${ticker}`);

    try {
        const [quoteRes, divRes] = await Promise.all([
            fetchBrapi(`quote/${ticker}?fundamental=true`),
            fetchBrapi(`quote/${ticker}/dividends`)
        ]);

        const quote   = quoteRes.results?.[0] || {};
        const rawDivs = divRes.results?.[0]?.dividendsData?.cashDividends || [];

        const payload = {
            success:   true,
            ticker,
            timestamp: agora,
            source:    'brapi',
            preco:     quote.regularMarketPrice         || null,
            variacao:  quote.regularMarketChangePercent || null,
            volume:    quote.regularMarketVolume        || null,
            pl:        quote.priceToEarnings            || null,
            pvp:       quote.priceToBook                || null,
            dividendos: rawDivs.slice(0, 12).reverse().map(d => ({
                data:  d.paymentDate || d.approvedOn || '',
                valor: parseFloat(d.rate || d.value || 0)
            }))
        };

        acaoDiagCache[ticker] = { timestamp: agora, data: payload };
        res.json(payload);

    } catch (error) {
        console.error(`❌ [Diag] Erro ao buscar ${ticker}:`, error.message);
        res.json({ success: false, ticker, preco: null, pl: null, pvp: null, volume: null, variacao: null, dividendos: [] });
    }
});

// ================================================================
// Raio-X Criptoativos — proxy BRAPI com cache semanal
// BTC / ETH / SOL via endpoint v2/crypto da BRAPI (correto para cripto)
// O endpoint /api/quote/{ticker} é para ativos da B3 — SOL não está
// disponível por lá. O v2/crypto cobre todos os três corretamente.
// Retorna: preco (USD), variacao 24h, volume 24h
// ================================================================
const criptoRaioXCache = {};

app.get('/api/cripto-raio-x/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    const tickers = ['BTC', 'ETH', 'SOL'];
    if (!tickers.includes(ticker)) return res.status(400).json({ success: false, error: 'Ticker não suportado' });

    const agora = Date.now();
    if (criptoRaioXCache[ticker] && (agora - criptoRaioXCache[ticker].timestamp < FII_CACHE_TTL)) {
        console.log(`📦 [Cripto] Cache hit: ${ticker}`);
        return res.json(criptoRaioXCache[ticker].data);
    }

    console.log(`📡 [Cripto] Buscando BRAPI v2/crypto para: ${ticker}`);

    try {
        const quoteRes = await fetchBrapi(`v2/crypto?coin=${ticker}&currency=USD`);
        const quote = quoteRes.coins?.[0] || {};

        const payload = {
            success:  true,
            ticker,
            timestamp: agora,
            source:   'brapi',
            preco:    quote.regularMarketPrice         || null,
            variacao: quote.regularMarketChangePercent || null,
            volume:   quote.regularMarketVolume        || null,
        };

        criptoRaioXCache[ticker] = { timestamp: agora, data: payload };
        res.json(payload);

    } catch (error) {
        console.error(`❌ [Cripto] Erro ao buscar ${ticker}:`, error.message);
        res.json({ success: false, ticker, preco: null, variacao: null, volume: null });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Feras Sem Futuro rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

