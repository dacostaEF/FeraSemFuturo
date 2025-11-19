# 🔗 LINKS PENDENTES - INVLAB

> **Documento de controle para rastreamento de páginas a criar e links a atualizar**  
> Última atualização: 19/11/2024

---

## 📊 RESUMO GERAL

### ✅ Páginas já criadas:
- **Renda Fixa:** poupanca.html, simulador-cdbs.html, simulador-tesouro-direto.html, simulador-lci-lca.html
- **Criptoativos:** criptoativos.html, bitcoin.html, stablecoins.html, blockchain.html, cbdc.html
- **Outros:** ganhos-come-cotas.html, ganhos-iof-regressivo.html, ganhos-taxas-fundos.html

### ⏳ Páginas pendentes:
- **Criptoativos:** 4 páginas
- **Renda Variável:** 3 páginas principais + 15 sub-páginas
- **Primeiros Passos:** verificar conteúdo existente
- **Ferramentas:** seção a desenvolver
- **Outros Investimentos:** seção a desenvolver

---

## 🔐 MÓDULO: CRIPTOATIVOS

### 1. **ethereum.html** ⧫
**Status:** NÃO CRIADA  
**Prioridade:** ALTA (referenciado em todos os menus)

**Onde atualizar quando criar:**
- `index.html` (linha ~122) - menu dropdown Criptoativos
- `pages/bitcoin.html` (linha ~114) - menu dropdown Criptoativos
- `pages/stablecoins.html` (linha ~114) - menu dropdown Criptoativos
- `pages/blockchain.html` (linha ~115) - menu dropdown Criptoativos
- `pages/cbdc.html` (linha ~114) - menu dropdown Criptoativos
- `pages/criptoativos.html` (linha ~117) - menu dropdown Criptoativos
- `pages/bitcoin.html` (seção "Bitcoin x outros criptoativos") - card clicável
- `pages/criptoativos.html` (seção "O que são criptoativos") - card explicativo
- `pages/blockchain.html` (seção "Tipos de blockchain") - exemplo de uso

**Conteúdo sugerido:**
- O que é Ethereum
- Como funcionam contratos inteligentes (Smart Contracts)
- Diferenças entre Bitcoin e Ethereum
- Proof of Stake vs Proof of Work
- Ecossistema DeFi
- Gas fees e como funcionam
- Riscos e considerações

---

### 2. **altcoins.html** 🪙
**Status:** NÃO CRIADA  
**Prioridade:** MÉDIA

**Onde atualizar quando criar:**
- Todos os menus dropdown de Criptoativos (6 arquivos)
- `pages/bitcoin.html` (seção "Bitcoin x outros criptoativos") - card clicável

**Conteúdo sugerido:**
- O que são Altcoins
- Principais categorias (Layer 1, Layer 2, DeFi tokens, utility tokens)
- Como avaliar um projeto
- Riscos específicos
- Diferença entre "projetos sérios" e especulação

---

### 3. **nfts.html** 🖼️
**Status:** NÃO CRIADA  
**Prioridade:** MÉDIA

**Onde atualizar quando criar:**
- Todos os menus dropdown de Criptoativos (6 arquivos)
- `pages/blockchain.html` (seção "Blockchain além do Bitcoin") - link de aplicação

**Conteúdo sugerido:**
- O que são NFTs
- Como funcionam (ERC-721, ERC-1155)
- Casos de uso (arte, gaming, certificados)
- Riscos e bolha especulativa
- Propriedade intelectual vs propriedade do token

---

### 4. **tokenizacao.html** 🔗
**Status:** NÃO CRIADA  
**Prioridade:** BAIXA

**Onde atualizar quando criar:**
- Todos os menus dropdown de Criptoativos (6 arquivos)

**Conteúdo sugerido:**
- O que é tokenização
- Tokenização de ativos reais (imóveis, ações, commodities)
- Diferença entre tokenização e criptomoedas
- Regulamentação no Brasil
- Vantagens e limitações

---

## 📈 MÓDULO: RENDA VARIÁVEL

### PÁGINAS PRINCIPAIS (Category Headers)

### 1. **etfs.html** 💵
**Status:** NÃO CRIADA  
**Prioridade:** ALTA

**Onde atualizar:**
- `onclick` nos category-header de todos os arquivos com menu de Renda Variável

**Sub-páginas relacionadas (também pendentes):**
- Simulador de Indexação
- ETFs Nacionais
- ETFs Internacionais

---

### 2. **fiis.html** 🏢
**Status:** NÃO CRIADA  
**Prioridade:** ALTA

**Onde atualizar:**
- `onclick` nos category-header de todos os arquivos com menu de Renda Variável

**Sub-páginas relacionadas (também pendentes):**
- Simulador de Renda Passiva
- FIIs de Tijolo
- FIIs de Papel
- FIIs Híbridos
- Como Escolher FIIs

---

### 3. **acoes.html** 📈
**Status:** NÃO CRIADA  
**Prioridade:** ALTA

**Onde atualizar:**
- `onclick` nos category-header de todos os arquivos com menu de Renda Variável

**Sub-páginas relacionadas (também pendentes):**
- Simulador de Dividendos
- Valuation (P/L, P/VP)
- Análise Setorial
- Day Trade vs Buy&Hold

---

## 📚 MÓDULO: PRIMEIROS PASSOS

### Verificar conteúdo existente:
- [ ] Existe seção na index.html (#primeiros-passos)
- [ ] Verificar se artigo "Poupança vs Tesouro Direto" existe
  - Referenciado em: `pages/poupanca.html` (callout no final)
  - Se não existir, criar ou ajustar link

---

## 🛠️ MÓDULO: FERRAMENTAS

### Status: Seção existe na index.html (#ferramentas)
**Verificar:**
- [ ] Que ferramentas estão planejadas
- [ ] Se precisam de páginas dedicadas ou são seções na index
- [ ] Links funcionais

---

## 💎 MÓDULO: OUTROS INVESTIMENTOS

### Status: Seção existe na index.html (#outros-investimentos)
**Verificar:**
- [ ] Que investimentos estão planejados
- [ ] Quais precisam de páginas dedicadas
- [ ] Estrutura de navegação

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Quando criar uma nova página, verificar:

- [ ] Página HTML criada
- [ ] Favicon e meta tags configurados
- [ ] Breadcrumb atualizado
- [ ] Menu dropdown atualizado em TODAS as páginas que o contêm
- [ ] Links de "páginas relacionadas" ou "próximos passos" funcionais
- [ ] Cards clicáveis nas páginas que mencionam o tema
- [ ] Script.js incluído
- [ ] Teste de responsividade (mobile, tablet, desktop)
- [ ] Linter sem erros
- [ ] Commit realizado

---

## 🎯 PRIORIDADES SUGERIDAS

### Fase 1 (Curto prazo):
1. ethereum.html (muito referenciado)
2. etfs.html (categoria principal)
3. fiis.html (categoria principal)
4. acoes.html (categoria principal)

### Fase 2 (Médio prazo):
5. altcoins.html
6. nfts.html
7. Sub-páginas de ETFs, FIIs, Ações

### Fase 3 (Longo prazo):
8. tokenizacao.html
9. Ferramentas dedicadas
10. Outros Investimentos

---

## 📝 NOTAS IMPORTANTES

- **Sempre atualizar este arquivo** após criar uma nova página
- **Mover páginas criadas** de "Pendentes" para "Criadas" no resumo
- **Verificar links quebrados** periodicamente com busca por `href="#"`
- **Manter consistência** no design e tom educacional
- **Testar navegação** após cada nova página criada

---

**Última verificação manual:** Pendente  
**Próxima revisão programada:** Após criar próxima página

