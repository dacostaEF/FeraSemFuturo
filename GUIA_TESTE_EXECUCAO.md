# 🧪 Guia de Teste - Execução e Renderização do INVLAB

## 📋 Pré-requisitos

1. **Node.js instalado** (versão 18.0.0 ou superior)
   - Verificar: `node --version`
   - Download: https://nodejs.org/

2. **NPM instalado** (vem com Node.js)
   - Verificar: `npm --version`

## 🚀 Método 1: Executar com Servidor Node.js (Recomendado)

### Passo 1: Instalar Dependências
```bash
npm install
```

Isso instalará:
- `express` (servidor web)
- `compression` (compressão GZIP)

### Passo 2: Iniciar o Servidor
```bash
npm start
```

Ou alternativamente:
```bash
npm run dev
```

### Passo 3: Acessar no Navegador
Abra seu navegador e acesse:
```
http://localhost:3000
```

### ✅ O que você verá:
- Página principal do INVLAB
- Menu de navegação funcional
- Cards de funcionalidades (simuladores, calculadoras)
- Carrossel de indicadores econômicos (se APIs estiverem funcionando)
- Design responsivo e moderno

---

## 🌐 Método 2: Abrir Diretamente no Navegador (Teste Rápido)

### ⚠️ Limitações:
- Algumas funcionalidades podem não funcionar (APIs externas)
- Rotas dinâmicas podem não funcionar corretamente
- CORS pode bloquear algumas requisições

### Como fazer:
1. Navegue até a pasta do projeto
2. Clique duas vezes em `index.html`
3. Ou arraste o arquivo para o navegador

**Nota:** Este método é útil apenas para verificar o layout básico e CSS.

---

## 🔍 Testes de Funcionalidades

### 1. Teste de Navegação
- [ ] Menu desktop funciona
- [ ] Menu mobile (hambúrguer) abre e fecha
- [ ] Links internos navegam corretamente
- [ ] Botão "Voltar ao topo" aparece ao rolar

### 2. Teste de Páginas
Acesse as seguintes rotas:
- [ ] `/` - Página principal
- [ ] `/comparador` - Comparador de investimentos
- [ ] `/artigo/:nome` - Artigos (ex: `/artigo/gerente`)

### 3. Teste de Simuladores
- [ ] Simulador CDBs (`pages/simulador-cdbs.html`)
- [ ] Simulador Tesouro (`pages/simulador-tesouro-direto.html`)
- [ ] Simulador LCI/LCA (`pages/simulador-lci-lca.html`)
- [ ] Calculadora de Juros Compostos (`pages/calculadora.html`)

### 4. Teste de APIs Externas
Verifique se os carrosséis carregam dados:
- [ ] **BCB API** (`bcb-api.js`) - Indicadores do Banco Central
- [ ] **Crypto API** (`crypto-api.js`) - Cotações de criptomoedas
- [ ] **Stock API** (`stock-api.js`) - Cotações de ações

### 5. Teste de Responsividade
Teste em diferentes tamanhos de tela:
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)

Use as ferramentas de desenvolvedor do navegador (F12) para simular diferentes dispositivos.

---

## 🐛 Troubleshooting

### Problema: "Cannot find module 'express'"
**Solução:** Execute `npm install` na pasta do projeto

### Problema: "Port 3000 is already in use"
**Solução:** 
1. Feche outros processos usando a porta 3000
2. Ou altere a porta no `server.js`: `const PORT = process.env.PORT || 3001;`

### Problema: APIs não carregam dados
**Solução:** 
- Verifique sua conexão com a internet
- Algumas APIs podem ter limites de requisição
- Abra o Console do navegador (F12) para ver erros

### Problema: CSS não carrega
**Solução:**
- Verifique se os caminhos dos arquivos CSS estão corretos
- Certifique-se de estar usando o servidor Node.js (não abrindo HTML diretamente)

---

## 📊 Verificação de Renderização

### Console do Navegador (F12)
Verifique se há erros:
- **Console:** Erros JavaScript
- **Network:** Recursos não carregados (CSS, JS, imagens)
- **Elements:** Estrutura HTML renderizada

### Checklist Visual
- [ ] Logo carrega corretamente
- [ ] Fontes (Inter, Playfair Display) aplicadas
- [ ] Ícones Phosphor aparecem
- [ ] Cores do tema (dourado #D4AF37, preto #0D0D0D) aplicadas
- [ ] Animações e transições funcionam
- [ ] Cards e componentes renderizam corretamente

---

## 🎯 Comandos Rápidos

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Verificar versão do Node
node --version

# Verificar versão do NPM
npm --version
```

---

## 📝 Notas Importantes

1. **Servidor Local:** O projeto foi projetado para rodar com Node.js/Express
2. **APIs Externas:** Algumas funcionalidades dependem de APIs externas que podem ter limites
3. **LocalStorage:** O projeto usa LocalStorage do navegador para histórico
4. **PWA-Ready:** O projeto está preparado para ser um Progressive Web App

---

## 🔗 Links Úteis

- **Produção:** https://www.ferasemfuturo.com.br
- **Node.js:** https://nodejs.org/
- **Express:** https://expressjs.com/

---

**Última atualização:** 2025-01-27
