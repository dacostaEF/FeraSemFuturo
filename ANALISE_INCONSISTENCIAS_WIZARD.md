# 🔍 ANÁLISE COMPLETA DE INCONSISTÊNCIAS - WIZARD

## ❌ PROBLEMA 1: CONFLITO DE LÓGICA - ESTRATÉGIA vs IDADEFINAL

**Localização:** `simulador-wizard-engine.js` linhas 232-277

**Problema:**
- Quando `tipoRenda === "periodo"` e o usuário seleciona uma idade (ex: 95 anos), há CONFLITO entre:
  - Linha 237: `else if (tipoRenda === "periodo" && estrategia === "perpetua")` → usa só juros
  - Linha 246: `else if (tipoRenda === "periodo" && idadeFinal)` → usa PMT
  
**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + "Preservar Capital" + idade 95 anos
- O código cai na linha 237 (perpetua) e calcula: `rendaRealPossivel = patrimonio * taxaMensalReal` (só juros)
- MAS deveria usar PMT para idade 95 anos, mesmo preservando capital

**Impacto:**
- `rendaRealPossivel` fica com valor errado (só juros ao invés de PMT ajustado)
- Dashboard mostra renda incorreta
- Gráfico de renda mensal mostra valor errado

---

## ❌ PROBLEMA 2: RENDA MENSAL DETALHADA USA IDADE ERRADA

**Localização:** `simulador-wizard-engine.js` linhas 498-528

**Problema:**
- `rendaMensalDetalhada` é gerada usando `idadeFinalParaRenda` que pode ser:
  - A idade selecionada pelo usuário (ex: 95)
  - Mas quando "Mostrar todas as curvas" está ativo, deveria mostrar a renda da idade SELECIONADA, não das 3 curvas extras

**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + idade 95 anos + "Mostrar todas as curvas"
- `rendaMensalDetalhada` é gerada para 95 anos (correto)
- MAS o gráfico de renda mensal mostra apenas essa curva (95 anos)
- As outras 2 curvas (105, 115) não aparecem porque `rendasMensaisExtras` pode estar vazio ou mal mapeado

**Impacto:**
- Gráfico de renda mensal mostra apenas 1 curva ao invés de 3
- Valores das curvas extras não aparecem

---

## ❌ PROBLEMA 3: CURVAS EXTRAS NÃO SÃO GERADAS PARA TODOS OS CENÁRIOS

**Localização:** `simulador-wizard-engine.js` linhas 373-496

**Problema:**
- Curvas extras (`curvasExtras`) só são geradas em casos específicos:
  - ✅ Linha 397: `if (tipoRenda === "periodo" && idadeFinal)` → GERA
  - ✅ Linha 431: `if (tipoRenda === "periodo" && estrategia === "perpetua")` → GERA
  - ✅ Linha 463: `if (tipoRenda === "periodo" && estrategia === "esgotavel")` → GERA
  - ❌ MAS: Se `tipoRenda === "periodo" && estrategia === "perpetua" && !idadeFinal`, não gera curvas extras

**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + "Preservar Capital" + idade 95 anos (do select)
- `idadeFinal` é definido (95)
- MAS a lógica cai na linha 422 (perpetua) que verifica `mostrarTodasCurvas` na linha 431
- Se o usuário NÃO marcar "Mostrar todas as curvas", não gera curvas extras
- Se marcar, gera mas pode estar usando lógica errada

**Impacto:**
- Curvas extras podem não ser geradas
- Ou podem ser geradas com valores incorretos

---

## ❌ PROBLEMA 4: RENDAS MENSAIS EXTRAS NÃO SÃO GERADAS CORRETAMENTE

**Localização:** `simulador-wizard-engine.js` linhas 530-582

**Problema:**
- `rendasMensaisExtras` só é gerado se `mostrarTodasCurvas && curvasExtras.length > 0`
- MAS `curvasExtras` pode estar vazio se não cair nos casos corretos
- E mesmo quando gera, pode estar usando estratégia errada:
  - Linha 541: Se `estrategia === "perpetua"`, usa PMT (correto após minha correção)
  - MAS deveria verificar se é "Preservar Capital" ou "Usar Capital"

**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + "Preservar Capital" + "Mostrar todas as curvas"
- `curvasExtras` é gerado (linha 431-442)
- `rendasMensaisExtras` é gerado (linha 531-582)
- MAS na linha 541, verifica `estrategia === "perpetua"` e usa PMT
- Isso está CORRETO agora (após minha correção), mas pode estar gerando valores muito próximos

**Impacto:**
- Rendas mensais extras podem ter valores incorretos
- Ou podem estar todas iguais (quando deveriam ser diferentes)

---

## ❌ PROBLEMA 5: GRÁFICO DE RENDA MENSAL NÃO MAPEIA CORRETAMENTE

**Localização:** `simulador-wizard.js` linhas 1963-1987

**Problema:**
- O mapeamento de `rendasMensaisExtras` para os labels do gráfico pode estar errado
- Linha 1973: Verifica `if (idadeLabel >= idadeInicio && idadeLabel <= curvaExtra.idade)`
- MAS `idadeLabel` vem de `label.replace(" anos", "")` que pode não estar parseando corretamente
- E o cálculo do `indiceRenda` pode estar errado

**Cenário problemático:**
- Labels: ["63 anos", "65 anos", "67 anos", ...]
- `idadeLabel = parseInt("63 anos".replace(" anos", ""))` = 63 ✅
- MAS se o label for "63 anos" e a idade de aposentadoria for 63, `mesesDesdeAposentadoria = 0`
- `indiceRenda = 0` → pega `rendaMensal[0]` ✅
- MAS se a curva extra tem 384 meses (32 anos) e o label está em 95 anos, pode estar pegando índice errado

**Impacto:**
- Valores das curvas extras podem estar sendo mapeados incorretamente
- Curvas podem aparecer com valores null ou 0
- Ou podem aparecer com valores errados

---

## ❌ PROBLEMA 6: DASHBOARD USA RENDA FIXA, NÃO AJUSTADA POR LONGEVIDADE

**Localização:** `simulador-wizard.js` linhas 606-608, 917

**Problema:**
- Dashboard exibe `resultados.rendaTotalPrevista` que é calculado na linha 331 do engine:
  - `rendaTotalPrevista = rendaRealPossivel + inssReal`
- MAS `rendaRealPossivel` é calculado UMA VEZ para a idade selecionada
- Quando "Mostrar todas as curvas" está ativo, deveria mostrar a renda da idade SELECIONADA
- MAS se o usuário selecionou 95 anos, mostra renda para 95 anos (correto)
- O problema é que `rendaRealPossivel` pode estar errado devido ao Problema 1

**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + "Preservar Capital" + idade 95 anos
- `rendaRealPossivel` = só juros (R$ 4.043,84) devido ao Problema 1
- Dashboard mostra R$ 4.043,84 (ERRADO - deveria ser PMT para 95 anos)
- Interpretação automática usa esse valor errado

**Impacto:**
- Dashboard mostra valores incorretos
- "Você está perto da sua meta!" usa valores errados
- Percentual atingido está errado

---

## ❌ PROBLEMA 7: TEXTO DO MODAL DE RENDA MENSAL USA VALOR FIXO

**Localização:** `simulador-wizard.js` linhas 2128-2130

**Problema:**
- Texto do modal diz: "Você receberá R$ X/mês do patrimônio..."
- MAS `rendaInicial` vem de `listaRenda[0]` que é a renda da idade SELECIONADA
- Quando "Mostrar todas as curvas" está ativo, deveria mencionar as 3 curvas
- MAS o texto só menciona uma renda

**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + idade 95 anos + "Mostrar todas as curvas"
- Modal mostra: "Você receberá R$ 4.043,84/mês" (renda para 95 anos)
- MAS não menciona que há 3 cenários diferentes (95, 105, 115)

**Impacto:**
- Texto do modal não reflete a realidade das múltiplas curvas
- Usuário pode ficar confuso

---

## ❌ PROBLEMA 8: LÓGICA DE DECISÃO ENTRE ESTRATÉGIAS ESTÁ INVERTIDA

**Localização:** `simulador-wizard-engine.js` linhas 232-277

**Problema:**
- A ordem dos `else if` está causando conflito:
  1. Linha 237: `periodo && perpetua` → verifica PRIMEIRO
  2. Linha 246: `periodo && idadeFinal` → verifica DEPOIS
  3. Linha 260: `periodo && esgotavel` → verifica DEPOIS
  
**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + "Preservar Capital" + idade 95 anos
- `tipoRenda = "periodo"`, `estrategia = "perpetua"`, `idadeFinal = 95`
- Código cai na linha 237 (perpetua) e calcula só juros
- NUNCA chega na linha 246 (idadeFinal) que calcularia PMT

**Impacto:**
- `rendaRealPossivel` sempre fica com só juros quando "Preservar Capital" está selecionado
- Nunca usa PMT mesmo quando deveria

---

## ❌ PROBLEMA 9: PROJEÇÃO PÓS-APOSENTADORIA USA RENDA ERRADA

**Localização:** `simulador-wizard-engine.js` linhas 455-460, 490-495

**Problema:**
- `projecaoPosAposentadoria` usa `rendaRealPossivel` que pode estar errado (Problema 1)
- Linha 457: `projetarPatrimonioPorPeriodo(patrimonio, rendaRealPossivel, ...)`
- MAS `rendaRealPossivel` foi calculado com só juros (errado)
- Deveria usar PMT calculado para a idade selecionada

**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + "Usar Capital" + idade 95 anos
- `rendaRealPossivel` = PMT para 95 anos (correto se cair na linha 260)
- MAS se cair na linha 237 (perpetua), `rendaRealPossivel` = só juros (errado)
- `projecaoPosAposentadoria` usa esse valor errado
- Gráfico de patrimônio mostra curva errada

**Impacto:**
- Gráfico de patrimônio mostra curva incorreta
- Patrimônio não diminui corretamente
- Ou diminui muito rápido/muito devagar

---

## ❌ PROBLEMA 10: HERANÇA CALCULADA INCORRETAMENTE

**Localização:** `simulador-wizard-engine.js` linhas 364-371, 394

**Problema:**
- Herança é calculada baseada em `estrategia`:
  - Linha 367: Se `estrategia === "perpetua"`, herança = patrimônio total
  - Linha 394: Se `tipoRenda === "periodo" && idadeFinal`, herança = saldo final da projeção
- MAS quando "Preservar Capital" está selecionado, herança deveria ser o patrimônio total
- E quando "Usar Capital" está selecionado, herança deveria ser 0 (ou saldo final se não zerar)

**Cenário problemático:**
- Usuário seleciona: "Renda por Período" + "Preservar Capital" + idade 95 anos
- Herança = patrimônio total (correto)
- MAS se selecionar "Usar Capital" + idade 95 anos, herança = 0 (correto)
- O problema é que a herança pode estar sendo calculada antes da projeção ser feita

**Impacto:**
- Herança pode estar com valor incorreto
- Dashboard mostra herança errada

---

## 📋 RESUMO DAS INCONSISTÊNCIAS

1. ❌ **Conflito de lógica**: `estrategia === "perpetua"` vs `idadeFinal` - ordem dos `else if` está errada
2. ❌ **Renda mensal detalhada**: Usa idade errada ou não considera curvas extras
3. ❌ **Curvas extras**: Não são geradas para todos os cenários
4. ❌ **Rendas mensais extras**: Podem estar vazias ou com valores incorretos
5. ❌ **Mapeamento no gráfico**: Valores podem estar sendo mapeados incorretamente
6. ❌ **Dashboard**: Usa renda fixa, não ajustada por longevidade
7. ❌ **Texto do modal**: Não menciona múltiplas curvas
8. ❌ **Ordem de decisão**: `else if` verifica `perpetua` antes de `idadeFinal`
9. ❌ **Projeção pós-aposentadoria**: Usa renda errada
10. ❌ **Herança**: Pode estar sendo calculada incorretamente

---

## 🔥 PRIORIDADE DE CORREÇÃO

**CRÍTICO (bloqueia funcionalidade):**
1. Problema 8: Ordem dos `else if` - corrigir PRIMEIRO
2. Problema 1: Conflito de lógica - corrigir junto com Problema 8
3. Problema 4: Rendas mensais extras não geradas - corrigir para curvas aparecerem

**ALTO (valores incorretos):**
4. Problema 6: Dashboard usa valores errados
5. Problema 9: Projeção usa renda errada
6. Problema 5: Mapeamento no gráfico

**MÉDIO (UX/interface):**
7. Problema 7: Texto do modal
8. Problema 3: Curvas extras não geradas em alguns cenários
9. Problema 2: Renda mensal detalhada
10. Problema 10: Herança

