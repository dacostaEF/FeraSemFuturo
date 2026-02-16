# 🧪 Guia de Testes - Simulador Wizard

## Como Executar os Testes

### Opção 1: Teste Automatizado (Recomendado)

1. Abra a página `simulador-wizard.html` no navegador
2. Abra o Console do Desenvolvedor (F12)
3. Carregue o script de teste:
   ```javascript
   // Cole este código no console:
   const script = document.createElement('script');
   script.src = '../assets/js/test-wizard-validation.js';
   document.head.appendChild(script);
   ```
4. Aguarde o carregamento e execute:
   ```javascript
   testarWizard()
   ```

### Opção 2: Teste Manual

Siga os cenários abaixo e verifique os resultados:

---

## 📋 Cenários de Teste

### ✅ Fase 1: Verificação Matemática

#### Teste 1.1: Acumulação
- **Entrada**: Idade 30 → 65, Aporte R$ 500/mês, Patrimônio inicial R$ 0
- **Esperado**: Patrimônio final > R$ 200.000 (com juros compostos)

#### Teste 1.2: Renda Vitalícia
- **Entrada**: Patrimônio R$ 1.000.000, Taxa real 3.5% a.a.
- **Esperado**: Renda mensal ≈ R$ 2.900 (preserva capital)

#### Teste 1.3: Renda por Período (PMT)
- **Entrada**: Patrimônio R$ 1.000.000, Período 20 anos, Taxa real 3.5% a.a.
- **Esperado**: Renda mensal > R$ 5.000 (consome capital)

#### Teste 1.4: Projeção Pós-Aposentadoria
- **Vitalícia**: Patrimônio deve permanecer constante
- **Período**: Patrimônio deve chegar a zero no final

#### Teste 1.5: Taxa Real
- **Entrada**: Taxa nominal 8%, Inflação 4.5%
- **Esperado**: Taxa real = 3.5% a.a.

#### Teste 1.6: Herança
- **Vitalícia**: Herança = Patrimônio total
- **Período**: Herança = R$ 0

---

### ✅ Fase 2: Validação de Entrada/Saída

#### Teste 2.1: Captura de `tipoRenda`
- Selecione "Renda vitalícia" → Verifique se `tipoRenda = "vitalicia"`
- Selecione "Renda por período" → Verifique se `tipoRenda = "periodo"`

#### Teste 2.2: Captura de `anosPeriodo`
- Informe 20 anos → Verifique se `anosPeriodo = 20`
- Verifique se o campo aparece quando "período" é selecionado

#### Teste 2.3: INSS Zero
- Informe INSS = 0 → Verifique se não calcula automaticamente
- Deixe vazio → Verifique se calcula 40% da renda desejada

#### Teste 2.4: Dashboard Reativo
- Verifique se todos os cards são atualizados:
  - Patrimônio Projetado
  - Renda Mensal Prevista
  - Herança Projetada
  - Meta Mensal

---

### ✅ Fase 3: Cenários de Usuários

#### 🔎 Cenário A: Usuário sem Patrimônio

**Dados de Entrada:**
- Idade: 30 → 65 anos
- Aporte: R$ 500/mês
- Aporte extra: R$ 0
- Patrimônio inicial: R$ 0
- Perfil: Moderado (8% a.a.)
- Período: 20 anos

**Resultados Esperados:**

**Vitalícia:**
- Patrimônio: ~R$ 250.000 - R$ 300.000
- Renda mensal: ~R$ 700 - R$ 900
- Herança: = Patrimônio total
- Gráfico: Linha horizontal após aposentadoria

**Período (20 anos):**
- Patrimônio: ~R$ 250.000 - R$ 300.000
- Renda mensal: ~R$ 1.200 - R$ 1.500
- Herança: R$ 0
- Gráfico: Linha decrescente até zero

---

#### 🔎 Cenário B: Usuário com Patrimônio Alto

**Dados de Entrada:**
- Idade: 40 → 65 anos
- Aporte: R$ 1.000/mês
- Patrimônio inicial: R$ 400.000
- Perfil: Moderado (8% a.a.)
- Período: 20 anos

**Resultados Esperados:**
- Patrimônio: > R$ 1.500.000
- Renda mensal (período): > R$ 7.000
- Curva de consumo mais suave (patrimônio maior)
- Mensagens de risco coerentes

---

#### 🔎 Cenário C: Expectativa > Período

**Dados de Entrada:**
- Período escolhido: 20 anos
- Expectativa de vida: 95 anos
- Idade aposentadoria: 65 anos

**Resultados Esperados:**
- Mensagem clara: "Você ficaria SEM renda dos 85 aos 95 anos"
- Alerta sobre risco de longevidade

---

### ✅ Fase 4: Verificação de Retorno do Motor

Verifique se `executarSimulacaoWizard()` retorna:

- ✅ `heranca` (number)
- ✅ `projecaoPosAposentadoria` (array)
- ✅ `taxaMensalReal` (number)
- ✅ `anosPeriodo` (number)
- ✅ `tipoRenda` (string)
- ✅ `estrategia` (string)

---

## 🔍 Checklist de Validação Visual

### Dashboard
- [ ] Card de Patrimônio exibe valor correto
- [ ] Card de Renda Mensal exibe valor correto
- [ ] Card de Herança exibe valor correto (R$ 0 ou valor do patrimônio)
- [ ] Estratégia é exibida corretamente
- [ ] Mensagens educativas aparecem

### Gráfico
- [ ] Fase 1 (acumulação) mostra crescimento
- [ ] Fase 2 (pós-aposentadoria):
  - [ ] Vitalícia: linha horizontal (patrimônio preservado)
  - [ ] Período: linha decrescente até zero
- [ ] Cores diferentes para cada fase
- [ ] Labels corretos nos eixos

### Mensagens
- [ ] Vitalícia: "Patrimônio preservado para herança"
- [ ] Período: "Capital será consumido ao final do período"
- [ ] Alerta se expectativa > período

---

## 🐛 Problemas Conhecidos a Verificar

1. **Gráfico não mostra pós-aposentadoria**
   - Verificar se `projecaoPosAposentadoria` está sendo passado
   - Verificar se o gráfico está combinando as duas fases

2. **Herança sempre zero**
   - Verificar se `tipoRenda === "vitalicia"` está sendo detectado
   - Verificar se `estrategia === "perpetua"` está sendo detectado

3. **Renda período igual a vitalícia**
   - Verificar se a fórmula PMT está sendo aplicada
   - Verificar se `anosPeriodo` está sendo usado corretamente

---

## 📊 Resultados Esperados dos Testes Automatizados

Ao executar `testarWizard()`, você deve ver:

```
🧪 EXECUTANDO SUITE COMPLETA DE TESTES

📋 TESTE 1: Verificando funções...
  ✅ executarSimulacaoWizard
  ✅ acumulacaoComJuros
  ✅ projetarPatrimonioVitalicia
  ✅ projetarPatrimonioPorPeriodo

📋 TESTE 2: Cenário A - Usuário sem patrimônio
  💚 VITALÍCIA:
    Patrimônio: R$ XXX.XXX
    Renda Mensal: R$ XXX.XX
    Herança: R$ XXX.XXX
  ✅ Validações Vitalícia: PASSOU

  ⏱️ PERÍODO (20 anos):
    Patrimônio: R$ XXX.XXX
    Renda Mensal: R$ XXX.XX
    Herança: R$ 0
  ✅ Validações Período: PASSOU

... (outros testes)

📊 RESUMO DOS TESTES:
  funcoes: ✅ PASSOU
  cenarioA: ✅ PASSOU
  cenarioB: ✅ PASSOU
  retornoCompleto: ✅ PASSOU
  taxaReal: ✅ PASSOU

✅ TODOS OS TESTES PASSARAM!
```

---

## 🚨 Se Algum Teste Falhar

1. Verifique o console para mensagens de erro
2. Verifique se todas as funções estão carregadas
3. Verifique se os dados de entrada estão corretos
4. Compare os valores calculados com os esperados
5. Verifique se há erros de JavaScript no console

---

## 📝 Notas

- Os testes usam valores aproximados (variação de ±10% é aceitável)
- A taxa de inflação padrão é 4.5% a.a.
- A taxa real é calculada como: Taxa Nominal - Inflação
- O período é sempre em anos, convertido para meses internamente


