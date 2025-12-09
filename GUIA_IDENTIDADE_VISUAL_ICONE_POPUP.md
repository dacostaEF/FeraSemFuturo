# 🎯 GUIA DE IDENTIDADE VISUAL - ÍCONE DE POPUP/TOOLTIP INVLAB

**Status:** ✅ Implementado e testado  
**Página de referência:** `pages/simulador-aposentadoria.html`  
**Última atualização:** Janeiro de 2025  
**Objetivo:** Documentar o padrão visual do ícone de informação (i) com círculo dourado e popup premium para replicação em todo o site

---

## 📋 1. VISÃO GERAL

O **Ícone de Popup INVLAB** é um elemento visual premium usado para fornecer informações contextuais aos usuários. Consiste em:

1. **Ícone:** Letra "i" dentro de um círculo dourado translúcido
2. **Popup/Tooltip:** Caixa de texto escura com borda dourada que aparece ao passar o mouse

**Características principais:**
- ✅ Círculo dourado translúcido com borda dourada
- ✅ Letra "i" em dourado premium (#D4AF37)
- ✅ Popup escuro com borda dourada e sombra elegante
- ✅ Seta apontando para o ícone
- ✅ Ativação por hover (passar o mouse)
- ✅ Responsivo e acessível

---

## 🎨 2. ESTRUTURA HTML

### 2.1 Código Base

```html
<label style="display: flex; align-items: center; gap: 8px;">
    Texto do Label
    <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        background: rgba(212, 175, 55, 0.2);
        border: 1px solid rgba(212, 175, 55, 0.4);
        border-radius: 50%;
        color: #D4AF37;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: help;
        position: relative;
    " title="Texto explicativo que aparecerá no popup ao passar o mouse sobre o ícone.">i</span>
</label>
```

### 2.2 Estrutura Completa com Container

```html
<!-- Container pai (deve ter position: relative) -->
<div class="input-group" style="position: relative;">
    <label style="display: flex; align-items: center; gap: 8px;">
        Aposentadoria do INSS (opcional)
        <span class="info-icon-popup" title="Se você não quiser considerar o benefício do INSS no cálculo da sua renda total, informe ZERO aqui. Neste caso, sua renda na aposentadoria será calculada apenas pelos seus investimentos.">i</span>
    </label>
    <!-- Resto do conteúdo -->
</div>
```

### 2.3 Versão com Classe CSS (Recomendado)

```html
<span class="info-icon-popup" title="Seu texto explicativo aqui.">i</span>
```

---

## 🎨 3. CSS COMPLETO

### 3.1 Estilo do Ícone

```css
/* Ícone de Popup INVLAB - Padrão Oficial */
.info-icon-popup {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: rgba(212, 175, 55, 0.2);        /* Fundo dourado translúcido 20% */
    border: 1px solid rgba(212, 175, 55, 0.4);   /* Borda dourada 40% */
    border-radius: 50%;                          /* Círculo perfeito */
    color: #D4AF37;                              /* Letra "i" dourada premium */
    font-size: 0.75rem;                          /* Tamanho da letra */
    font-weight: 700;                            /* Negrito */
    cursor: help;                                 /* Cursor de ajuda */
    position: relative;                           /* Necessário para posicionar o popup */
    transition: all 0.3s ease;                   /* Transição suave */
    line-height: 1;                              /* Centralização vertical */
}

/* Hover do Ícone */
.info-icon-popup:hover {
    background: rgba(212, 175, 55, 0.3);        /* Fundo mais visível no hover */
    border-color: rgba(212, 175, 55, 0.6);      /* Borda mais forte */
    transform: scale(1.1);                       /* Leve aumento */
    box-shadow: 0 0 8px rgba(212, 175, 55, 0.4); /* Brilho dourado */
}
```

### 3.2 Estilo do Popup/Tooltip

```css
/* Popup que aparece ao passar o mouse */
.info-icon-popup[title]:hover::after {
    content: attr(title);                        /* Texto do atributo title */
    position: absolute;
    bottom: 130%;                                /* Posição acima do ícone */
    left: 50%;
    transform: translateX(-50%);                 /* Centralização horizontal */
    background: rgba(26, 26, 26, 0.98);          /* Fundo escuro quase opaco */
    color: #E4E4E4;                              /* Texto branco suave */
    padding: 16px 20px;                          /* Espaçamento interno */
    border-radius: 12px;                        /* Bordas arredondadas */
    border: 1px solid rgba(212, 175, 55, 0.3);   /* Borda dourada translúcida */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);   /* Sombra profunda */
    white-space: normal;                         /* Quebra de linha permitida */
    width: 320px;                                /* Largura fixa */
    font-size: 0.9rem;                           /* Tamanho da fonte */
    line-height: 1.5;                            /* Espaçamento entre linhas */
    text-align: left;                            /* Alinhamento à esquerda */
    font-weight: 400;                            /* Peso normal */
    z-index: 1000;                               /* Sobre outros elementos */
    pointer-events: none;                        /* Não interfere com cliques */
    font-family: 'Inter', sans-serif;            /* Fonte INVLAB */
}

/* Seta do popup (triângulo apontando para o ícone) */
.info-icon-popup[title]:hover::before {
    content: '';
    position: absolute;
    bottom: 120%;                                /* Posição acima do popup */
    left: 50%;
    transform: translateX(-50%);                  /* Centralização horizontal */
    border: 8px solid transparent;               /* Triângulo transparente */
    border-top-color: rgba(26, 26, 26, 0.98);    /* Cor do triângulo (igual ao fundo do popup) */
    z-index: 1001;                               /* Acima do popup */
}
```

### 3.3 CSS Completo (Pronto para Copiar)

```css
/* ============================================
   ÍCONE DE POPUP INVLAB - PADRÃO OFICIAL
   ============================================ */

.info-icon-popup {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: rgba(212, 175, 55, 0.2);
    border: 1px solid rgba(212, 175, 55, 0.4);
    border-radius: 50%;
    color: #D4AF37;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: help;
    position: relative;
    transition: all 0.3s ease;
    line-height: 1;
}

.info-icon-popup:hover {
    background: rgba(212, 175, 55, 0.3);
    border-color: rgba(212, 175, 55, 0.6);
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
}

.info-icon-popup[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 130%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(26, 26, 26, 0.98);
    color: #E4E4E4;
    padding: 16px 20px;
    border-radius: 12px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    white-space: normal;
    width: 320px;
    font-size: 0.9rem;
    line-height: 1.5;
    text-align: left;
    font-weight: 400;
    z-index: 1000;
    pointer-events: none;
    font-family: 'Inter', sans-serif;
}

.info-icon-popup[title]:hover::before {
    content: '';
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: rgba(26, 26, 26, 0.98);
    z-index: 1001;
}

/* Responsividade para mobile */
@media (max-width: 768px) {
    .info-icon-popup[title]:hover::after {
        width: 280px;
        font-size: 0.85rem;
        padding: 14px 18px;
    }
}

@media (max-width: 480px) {
    .info-icon-popup[title]:hover::after {
        width: calc(100vw - 40px);
        max-width: 280px;
        left: 50%;
        transform: translateX(-50%);
    }
}
```

---

## 🎨 4. ESPECIFICAÇÕES TÉCNICAS

### 4.1 Cores

| Elemento | Cor | Valor | Observação |
|----------|-----|-------|------------|
| **Fundo do círculo** | Dourado translúcido | `rgba(212, 175, 55, 0.2)` | 20% de opacidade |
| **Borda do círculo** | Dourado translúcido | `rgba(212, 175, 55, 0.4)` | 40% de opacidade |
| **Letra "i"** | Dourado premium | `#D4AF37` | Cor sólida INVLAB |
| **Fundo do popup** | Preto quase opaco | `rgba(26, 26, 26, 0.98)` | 98% de opacidade |
| **Texto do popup** | Branco suave | `#E4E4E4` | Alta legibilidade |
| **Borda do popup** | Dourado translúcido | `rgba(212, 175, 55, 0.3)` | 30% de opacidade |

### 4.2 Dimensões

| Elemento | Valor | Observação |
|----------|-------|------------|
| **Tamanho do ícone** | 18px × 18px | Círculo perfeito |
| **Tamanho da letra "i"** | 0.75rem | ~12px |
| **Largura do popup** | 320px | Desktop |
| **Largura do popup (mobile)** | 280px ou calc(100vw - 40px) | Responsivo |
| **Padding do popup** | 16px 20px | Espaçamento interno |
| **Border-radius do popup** | 12px | Bordas arredondadas |
| **Tamanho da seta** | 8px | Triângulo do popup |

### 4.3 Posicionamento

| Propriedade | Valor | Observação |
|-------------|-------|------------|
| **Posição do popup** | `bottom: 130%` | Acima do ícone |
| **Posição da seta** | `bottom: 120%` | Entre popup e ícone |
| **Centralização** | `left: 50%; transform: translateX(-50%)` | Horizontalmente centralizado |
| **Z-index do popup** | 1000 | Sobre outros elementos |
| **Z-index da seta** | 1001 | Acima do popup |

---

## 📝 5. EXEMPLOS DE USO

### 5.1 Exemplo 1: Em um Label de Input

```html
<div class="input-group">
    <label style="display: flex; align-items: center; gap: 8px;">
        Aposentadoria do INSS (opcional)
        <span class="info-icon-popup" title="Se você não quiser considerar o benefício do INSS no cálculo da sua renda total, informe ZERO aqui. Neste caso, sua renda na aposentadoria será calculada apenas pelos seus investimentos.">i</span>
    </label>
    <input type="number" id="inssManual" placeholder="Ex: 3000">
</div>
```

### 5.2 Exemplo 2: Em um Título de Seção

```html
<h3 style="display: flex; align-items: center; gap: 8px;">
    Estratégia de Renda na Aposentadoria
    <span class="info-icon-popup" title="Renda vitalícia preserva seu patrimônio indefinidamente. Período determinado permite usar o capital para uma renda maior durante um prazo específico.">i</span>
</h3>
```

### 5.3 Exemplo 3: Em um Card

```html
<div class="card">
    <h4 style="display: flex; align-items: center; gap: 8px;">
        Taxa de Administração
        <span class="info-icon-popup" title="A taxa de administração é cobrada sobre todo o seu patrimônio acumulado. Mesmo taxas pequenas reduzem significativamente o resultado final ao longo de anos.">i</span>
    </h4>
    <p>Conteúdo do card...</p>
</div>
```

---

## ✅ 6. CHECKLIST DE IMPLEMENTAÇÃO

Ao adicionar um novo ícone de popup, verifique:

- [ ] **HTML:**
  - [ ] Ícone dentro de um elemento com `position: relative` (ou o próprio ícone tem `position: relative`)
  - [ ] Atributo `title` preenchido com o texto explicativo
  - [ ] Classe `info-icon-popup` aplicada (ou estilos inline equivalentes)
  - [ ] Letra "i" como conteúdo do span

- [ ] **CSS:**
  - [ ] Estilos do ícone aplicados (círculo dourado, tamanho 18px)
  - [ ] Estilos do popup aplicados (fundo escuro, borda dourada)
  - [ ] Estilos da seta aplicados (triângulo apontando para o ícone)
  - [ ] Responsividade testada (mobile e tablet)

- [ ] **Funcionalidade:**
  - [ ] Popup aparece ao passar o mouse
  - [ ] Popup desaparece ao sair do mouse
  - [ ] Texto quebra corretamente em múltiplas linhas
  - [ ] Popup não interfere com outros elementos (z-index correto)
  - [ ] Cursor muda para "help" ao passar sobre o ícone

- [ ] **Acessibilidade:**
  - [ ] Texto do `title` é descritivo e útil
  - [ ] Ícone é visível e tem contraste adequado
  - [ ] Popup é legível em diferentes fundos

---

## 🎯 7. BOAS PRÁTICAS

### 7.1 Textos do Popup

- ✅ **Seja claro e conciso:** Máximo de 2-3 frases
- ✅ **Use linguagem simples:** Evite jargões técnicos desnecessários
- ✅ **Seja específico:** Explique exatamente o que o campo/opção faz
- ✅ **Mantenha consistência:** Use o mesmo tom em todos os popups

### 7.2 Posicionamento

- ✅ **Sempre ao lado direito do texto:** Padrão visual INVLAB
- ✅ **Gap de 8px:** Espaçamento entre texto e ícone
- ✅ **Alinhamento vertical:** Use `align-items: center` no flex

### 7.3 Quando Usar

- ✅ **Campos de formulário complexos:** Explicar o que é esperado
- ✅ **Termos técnicos:** Definir conceitos financeiros
- ✅ **Opções de estratégia:** Explicar diferenças entre opções
- ✅ **Valores calculados:** Mostrar como o valor foi obtido

### 7.4 Quando NÃO Usar

- ❌ **Informações óbvias:** Se o campo é autoexplicativo, não precisa
- ❌ **Textos muito longos:** Se precisar de mais de 3 frases, considere um modal
- ❌ **Informações críticas:** Dados importantes devem estar visíveis, não escondidos

---

## 🔧 8. TROUBLESHOOTING

### Problema: Popup não aparece

**Soluções:**
1. Verifique se o atributo `title` está presente
2. Confirme que o elemento tem `position: relative`
3. Verifique se o CSS está carregado corretamente
4. Teste se há conflitos de z-index com outros elementos

### Problema: Popup aparece cortado

**Soluções:**
1. Verifique se o container pai tem `overflow: hidden` (remova se necessário)
2. Ajuste o `z-index` para um valor maior
3. Verifique se há espaço suficiente acima do ícone

### Problema: Popup não centraliza corretamente

**Soluções:**
1. Confirme que o ícone tem `position: relative`
2. Verifique se `left: 50%` e `transform: translateX(-50%)` estão aplicados
3. Teste em diferentes tamanhos de tela

### Problema: Texto não quebra em múltiplas linhas

**Soluções:**
1. Confirme que `white-space: normal` está aplicado
2. Verifique se a largura do popup está definida (320px)
3. Teste com textos mais longos

---

## 📊 9. VARIAÇÕES E PERSONALIZAÇÕES

### 9.1 Tamanho do Ícone

**Pequeno (16px):**
```css
.info-icon-popup.small {
    width: 16px;
    height: 16px;
    font-size: 0.7rem;
}
```

**Grande (20px):**
```css
.info-icon-popup.large {
    width: 20px;
    height: 20px;
    font-size: 0.8rem;
}
```

### 9.2 Largura do Popup

**Compacto (240px):**
```css
.info-icon-popup[title]:hover::after {
    width: 240px;
}
```

**Amplo (400px):**
```css
.info-icon-popup[title]:hover::after {
    width: 400px;
}
```

### 9.3 Posição do Popup

**À direita:**
```css
.info-icon-popup[title]:hover::after {
    left: auto;
    right: 0;
    transform: none;
}
```

**À esquerda:**
```css
.info-icon-popup[title]:hover::after {
    left: 0;
    transform: none;
}
```

---

## 📚 10. REFERÊNCIAS E EXEMPLOS

### 10.1 Páginas Implementadas

- ✅ `pages/simulador-aposentadoria.html`
  - Seção "Aposentadoria do INSS (opcional)"
  - Seção "Estratégia de Renda na Aposentadoria"
  - Seção "Estratégia de patrimônio na aposentadoria"

### 10.2 Arquivos de Referência

- **CSS:** Linhas 358-394 de `pages/simulador-aposentadoria.html`
- **HTML:** Linhas 2147-2163 de `pages/simulador-aposentadoria.html`

---

## 🎯 11. STATUS E MANUTENÇÃO

**Status:** ✅ **TESTADO E APROVADO** - Padrão oficial INVLAB  
**Última atualização:** Janeiro de 2025  
**Versão:** 1.0  
**Próximos passos:** Expandir para outras páginas e seções

**⚠️ IMPORTANTE:** 
- Sempre use este padrão ao criar novos ícones de informação
- Mantenha consistência visual em todo o site
- Teste em diferentes dispositivos antes de publicar
- Consulte este guia antes de criar variações

---

**Criado por:** Equipe INVLAB  
**Aprovado por:** Equipe INVLAB  
**Template master:** ✅ Pronto para replicação

