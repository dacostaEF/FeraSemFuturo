const express = require('express');
const compression = require('compression');
const path = require('path');

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

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Feras Sem Futuro rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

