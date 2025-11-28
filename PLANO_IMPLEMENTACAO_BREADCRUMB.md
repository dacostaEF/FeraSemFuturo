# 🗺️ PLANO DE IMPLEMENTAÇÃO DO BREADCRUMB INVLAB

**Data:** Janeiro 2025  
**Objetivo:** Aplicar breadcrumb padrão INVLAB em todas as páginas do site  
**Estratégia:** Implementação por grupos estratégicos

---

## 📊 ANÁLISE INICIAL

- **Total de páginas:** 33 arquivos HTML
- **Páginas com breadcrumb:** 29 (já referenciam)
- **Páginas sem breadcrumb:** 4 (verificar)

---

## 🎯 GRUPOS ESTRATÉGICOS

### **GRUPO 1: SIMULADORES (Prioridade ALTA) ⭐**
**Por quê:** Páginas mais visitadas, já têm estrutura similar

**Páginas:**
- ✅ `simulador-aposentadoria.html` (JÁ TEM - referência)
- ✅ `simulador-wizard.html` (JÁ TEM - referência)
- ⏳ `simulador-cdbs.html`
- ⏳ `simulador-tesouro-direto.html`
- ⏳ `simulador-lci-lca.html`
- ⏳ `simulador-invlab-plus.html`

**Tempo estimado:** 2-3 horas  
**Risco:** BAIXO (estrutura similar)  
**Benefício:** ALTO (páginas principais)

---

### **GRUPO 2: ARTIGOS EDUCACIONAIS (Prioridade ALTA) ⭐**
**Por quê:** Já seguem padrão de artigos, fácil replicar

**Páginas:**
- ✅ `artigo-perfil-investidor.html` (JÁ TEM - referência)
- ✅ `artigo-gerente.html` (JÁ TEM - referência)
- ⏳ `artigo-poupanca-vs-tesouro-direto.html`
- ⏳ `artigo-reserva.html`

**Tempo estimado:** 1-2 horas  
**Risco:** BAIXO (já têm estrutura de artigo)  
**Benefício:** ALTO (conteúdo educacional)

---

### **GRUPO 3: CRIPTOATIVOS (Prioridade MÉDIA)**
**Por quê:** Páginas educacionais, estrutura similar

**Páginas:**
- ⏳ `bitcoin.html`
- ⏳ `ethereum.html`
- ⏳ `stablecoins.html`
- ⏳ `blockchain.html`
- ⏳ `cbdc.html`
- ⏳ `altcoins.html`
- ⏳ `tokenizacao.html`
- ⏳ `nfts.html`

**Tempo estimado:** 3-4 horas  
**Risco:** MÉDIO (verificar estrutura de cada uma)  
**Benefício:** MÉDIO (conteúdo educacional)

---

### **GRUPO 4: RENDA VARIÁVEL (Prioridade MÉDIA)**
**Por quê:** Páginas principais de categorias

**Páginas:**
- ⏳ `etfs.html`
- ⏳ `fiis.html`
- ⏳ `acoes.html`

**Tempo estimado:** 1-2 horas  
**Risco:** MÉDIO (verificar estrutura)  
**Benefício:** MÉDIO

---

### **GRUPO 5: OUTRAS PÁGINAS (Prioridade BAIXA)**
**Por quê:** Páginas auxiliares, menos críticas

**Páginas:**
- ⏳ `poupanca.html`
- ⏳ `fgc.html`
- ⏳ `metodologia.html`
- ⏳ `guia_invlab.html`
- ⏳ `calculadora.html`
- ⏳ `landingpage_simulador-aposentadoria.html`
- ⏳ `crypto_timeline.html`
- ⏳ `ganhos-taxas-fundos.html`
- ⏳ `ganhos-inflacao.html`
- ⏳ `ganhos-iof-regressivo.html`
- ⏳ `ganhos-come-cotas.html`
- ⏳ `aprenda.html`

**Tempo estimado:** 4-5 horas  
**Risco:** VARIÁVEL (estruturas diferentes)  
**Benefício:** BAIXO (páginas auxiliares)

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Preparação (1 hora)**
- [ ] Criar template HTML do breadcrumb
- [ ] Criar classe CSS `.breadcrumb-nav` (se ainda não existe)
- [ ] Testar em uma página piloto (`simulador-cdbs.html`)
- [ ] Validar responsividade mobile
- [ ] Documentar padrão no `GUIA_IDENTIDADE_VISUAL_INVLAB.md` ✅ (JÁ FEITO)

### **Fase 2: Grupo 1 - Simuladores (2-3 horas)**
- [ ] `simulador-cdbs.html`
- [ ] `simulador-tesouro-direto.html`
- [ ] `simulador-lci-lca.html`
- [ ] `simulador-invlab-plus.html`
- [ ] Testar todas em desktop e mobile
- [ ] Commit: "feat: adiciona breadcrumb em simuladores"

### **Fase 3: Grupo 2 - Artigos (1-2 horas)**
- [ ] `artigo-poupanca-vs-tesouro-direto.html`
- [ ] `artigo-reserva.html`
- [ ] Testar todas em desktop e mobile
- [ ] Commit: "feat: adiciona breadcrumb em artigos educacionais"

### **Fase 4: Grupo 3 - Criptoativos (3-4 horas)**
- [ ] `bitcoin.html`
- [ ] `ethereum.html`
- [ ] `stablecoins.html`
- [ ] `blockchain.html`
- [ ] `cbdc.html`
- [ ] `altcoins.html`
- [ ] `tokenizacao.html`
- [ ] `nfts.html`
- [ ] Testar todas em desktop e mobile
- [ ] Commit: "feat: adiciona breadcrumb em páginas de criptoativos"

### **Fase 5: Grupo 4 - Renda Variável (1-2 horas)**
- [ ] `etfs.html`
- [ ] `fiis.html`
- [ ] `acoes.html`
- [ ] Testar todas em desktop e mobile
- [ ] Commit: "feat: adiciona breadcrumb em páginas de renda variável"

### **Fase 6: Grupo 5 - Outras (4-5 horas)**
- [ ] Aplicar página por página conforme necessidade
- [ ] Testar cada uma individualmente
- [ ] Commit: "feat: adiciona breadcrumb em páginas auxiliares"

---

## 🎯 RECOMENDAÇÃO FINAL

### **✅ FAZER:**
1. **Começar pelo Grupo 1 (Simuladores)** - maior impacto, menor risco
2. **Fazer commit após cada grupo** - histórico limpo
3. **Testar cada grupo antes de avançar** - garantir qualidade
4. **Ajustar conforme necessário** - cada página pode ter particularidades

### **❌ NÃO FAZER:**
1. **Aplicar tudo de uma vez** - risco alto de quebrar várias páginas
2. **Aplicar uma por uma** - muito lento, perde consistência
3. **Pular testes** - pode quebrar layout existente
4. **Ignorar responsividade** - breadcrumb deve funcionar em mobile

---

## 📅 CRONOGRAMA SUGERIDO

**Semana 1:**
- Dia 1: Fase 1 (Preparação) + Grupo 1 (Simuladores)
- Dia 2: Grupo 2 (Artigos) + Testes

**Semana 2:**
- Dia 1: Grupo 3 (Criptoativos) - parte 1
- Dia 2: Grupo 3 (Criptoativos) - parte 2 + Testes

**Semana 3:**
- Dia 1: Grupo 4 (Renda Variável) + Grupo 5 (Outras) - parte 1
- Dia 2: Grupo 5 (Outras) - parte 2 + Testes finais

**Total estimado:** 12-18 horas de trabalho

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebrar layout existente | MÉDIA | ALTO | Testar cada página após implementação |
| Inconsistência visual | BAIXA | MÉDIO | Usar template padronizado |
| Problemas de responsividade | MÉDIA | MÉDIO | Testar em mobile após cada grupo |
| Tempo maior que estimado | ALTA | BAIXO | Fazer por grupos, não tudo de uma vez |

---

## 🎨 TEMPLATE DO BREADCRUMB

```html
<!-- Breadcrumb (fixo, abaixo do menu) -->
<div style="position: sticky; top: 110px; z-index: 100; background: #0D0D0D; width: 100%; padding: 12px 20px 12px; margin-bottom: 0 !important;">
    <nav style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.6);">
        <a href="../index.html" style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.7); text-decoration: none; transition: color 0.3s;">🏠 Início</a>
        <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.4);">/</span>
        <a href="../index.html#ferramentas" style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.7); text-decoration: none; transition: color 0.3s;">🛠️ Ferramentas</a>
        <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.4);">/</span>
        <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: #FFFFFF; font-weight: 600; background: rgba(42, 127, 255, 0.15); padding: 4px 10px; border-radius: 6px; border-left: 3px solid #3B82F6;">[NOME DA PÁGINA]</span>
    </nav>
</div>
```

**⚠️ IMPORTANTE:** Ajustar o caminho `../index.html` conforme a estrutura de pastas de cada página.

---

## 📝 NOTAS

- **Documentação completa:** Já está no `GUIA_IDENTIDADE_VISUAL_INVLAB.md` (seção 18.7)
- **Páginas de referência:** `simulador-aposentadoria.html` e `simulador-wizard.html`
- **Responsividade:** Sempre testar em mobile após implementação

---

**Status:** 📋 PLANO CRIADO  
**Próximo passo:** Decisão do time sobre seguir este plano ou ajustar conforme necessidade

