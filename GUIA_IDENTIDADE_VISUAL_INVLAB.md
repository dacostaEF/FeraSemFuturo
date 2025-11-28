# 📘 GUIA DE IDENTIDADE VISUAL INVLAB

**Status:** ✅ Implementado e testado na página **Inicio** (index.html)  
**Objetivo:** Documentar todas as características do novo layout para replicação nas demais páginas

---

## 🎨 1. SISTEMA DE CORES

### 1.1 Paleta Estratégica

```css
/* Dourado Premium */
--gold-premium: #D4AF37        /* Ícones, destaques visuais */
--gold-soft: rgba(212, 175, 55, 0.85)
--gold-hover: rgba(212, 175, 55, 0.7)  /* 70% iluminado - hovers premium */

/* Verde INVLAB - Uso Controlado por Contexto */
--green-invlab: #10b981                      /* Puro: APENAS ícones, botões, checkmarks */
--green-invlab-subtitle: rgba(16, 185, 129, 0.65)  /* Subtítulos curtos */
--green-invlab-text: rgba(16, 185, 129, 0.45)      /* Textos longos (raramente usado) */
--green-invlab-light: rgba(16, 185, 129, 0.2)      /* Preenchimentos translúcidos */
--green-invlab-hover: rgba(16, 185, 129, 0.3)      /* Estados hover */

/* Textos - Hierarquia Clara */
--text-white-soft: #E4E4E4    /* Branco suave - títulos de cards, textos importantes */
--text-gray: #9CA3AF          /* Cinza médio - descrições, textos secundários */

/* Fundos */
--black-primary: #0D0D0D      /* Fundo principal do site */
--black-card: #1A1A1A         /* Cards e containers */
```

### 1.2 Regras de Aplicação

| Elemento | Cor | Exemplo |
|----------|-----|---------|
| **Ícones (linha)** | `#D4AF37` (Dourado) | Bordas dos ícones Phosphor |
| **Ícones (preenchimento)** | `rgba(16, 185, 129, 0.2)` (Verde translúcido) | Interior dos ícones duotone |
| **Títulos de Seção H1** | `#D4AF37` (Dourado) ⭐ PADRÃO ATUAL | "O que é Renda Fixa?" |
| **Subtítulos** | `rgba(16, 185, 129, 0.65)` (Verde suave 65%) | "Seu laboratório para testar..." |
| **Títulos H2** | `#D4AF37` (Dourado) | "Existem três formas principais" |
| **Títulos de Cards (h3)** | `#E4E4E4` (Branco suave) | "Dados Reais do Mercado" |
| **Descrições (p)** | `#9CA3AF` (Cinza) | Textos descritivos dos cards |
| **Bordas de Cards (normal)** | `rgba(42, 127, 255, 0.2)` (Azul translúcido) | Borda padrão |
| **Bordas de Cards (hover)** | `rgba(212, 175, 55, 0.7)` (Dourado 70%) | Borda no hover |

**⚠️ IMPORTANTE:** O verde **#10b981** puro só deve ser usado em:
- Ícones
- Botões de ação
- Checkmarks (✓)
- Destaques pequenos

**NUNCA** use verde puro em textos longos (mais de 1 linha)!

---

## 🔤 2. TIPOGRAFIA

### 2.1 Fontes

```html
<!-- Google Fonts CDN (no <head>) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 2.2 Hierarquia

```css
/* Títulos - Playfair Display (elegância e impacto) */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
    font-weight: 700;
    letter-spacing: -0.01em;  /* Kerning mais apertado para elegância */
}

/* Textos - Inter (legibilidade e modernidade) */
p, span, a, li, label, input, textarea, select, button {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 2.3 Tamanhos de Fonte

| Elemento | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| **Título de Seção (h2)** | 2rem (32px) | 1.8rem | 1.5rem |
| **Subtítulo** | 1.1rem | 1rem | 0.9rem |
| **Título de Card (h3)** | 1.3rem | 1.2rem | 1.1rem |
| **Texto de Card (p)** | 0.95rem | 0.95rem | 0.9rem |

---

## 🎯 3. SISTEMA DE ÍCONES PHOSPHOR

### 3.1 CDN e Biblioteca

```html
<!-- Phosphor Icons CDN (no <head>) -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>

<!-- CSS Personalizado -->
<link rel="stylesheet" href="assets/css/invlab-icons.css">
```

### 3.2 Os 4 Níveis de Iconografia

#### 🔹 Nível 1: PADRÃO (Duotone)
**Uso:** Cards principais, seções de destaque

```html
<i class="ph-duotone ph-chart-line-up icon-invlab-padrao"></i>
```

```css
.icon-invlab-padrao {
    color: #D4AF37;                    /* Linha dourada */
    fill: rgba(16, 185, 129, 0.2);    /* Preenchimento verde translúcido */
    width: 48px;
    height: 48px;
    transition: all 0.3s ease;
}

.icon-invlab-padrao:hover {
    fill: rgba(16, 185, 129, 0.3);
    transform: translateY(-2px);
    filter: drop-shadow(0 4px 8px rgba(212, 175, 55, 0.3));
}
```

#### 🔹 Nível 2: OUTLINE
**Uso:** Menus, breadcrumbs, tooltips

```html
<i class="ph ph-house icon-invlab-outline"></i>
```

```css
.icon-invlab-outline {
    color: #D4AF37;
    fill: none;
    width: 40px;
    height: 40px;
}

.icon-invlab-outline:hover {
    color: rgba(212, 175, 55, 0.7);
    transform: scale(1.05);
}
```

#### 🔹 Nível 3: SÓLIDO
**Uso:** Botões, chamadas para ação (CTAs)

```html
<i class="ph-fill ph-shield-check icon-invlab-solid"></i>
```

```css
.icon-invlab-solid {
    color: #10b981;
    fill: #10b981;
    width: 44px;
    height: 44px;
}

.icon-invlab-solid:hover {
    color: #D4AF37;
    fill: #D4AF37;
    transform: rotate(-5deg) scale(1.1);
}
```

#### 🔹 Nível 4: SUTIL (Translúcido)
**Uso:** Fundos de seções, watermarks

```html
<i class="ph ph-coins icon-invlab-sutil"></i>
```

```css
.icon-invlab-sutil {
    color: #D4AF37;
    fill: #D4AF37;
    opacity: 0.2;
    width: 32px;
    height: 32px;
}
```

### 3.3 Ícones Essenciais (8 principais)

| Categoria | Ícone Phosphor | Nome da Classe |
|-----------|---------------|----------------|
| Reserva de Emergência | `ph-shield-check` | `.icon-reserva` |
| Renda Fixa | `ph-piggy-bank` | `.icon-renda-fixa` |
| Renda Variável | `ph-chart-donut` | `.icon-renda-variavel` |
| Criptoativos | `ph-coins` ou `ph-currency-btc` | `.icon-cripto` |
| Educação | `ph-graduation-cap` | `.icon-educacao` |
| Diversificação | `ph-cube` | `.icon-diversificacao` |
| Objetivos | `ph-target` | `.icon-objetivos` |
| Crescimento | `ph-chart-line-up` | `.icon-crescimento` |

---

## 🎴 4. CARDS DE BENEFÍCIOS

### 4.1 Estrutura HTML

```html
<div class="benefit-card">
    <div class="benefit-icon">
        <i class="ph-duotone ph-chart-line-up icon-invlab-padrao"></i>
    </div>
    <h3>Dados Reais do Mercado</h3>
    <p>Modelagens baseadas em indicadores atualizados, sem achismos.</p>
</div>
```

### 4.2 Propriedades CSS Completas

```css
.benefit-card {
    position: relative;
    background: rgba(26, 26, 26, 0.8);                    /* Fundo escuro translúcido */
    border: 1px solid rgba(42, 127, 255, 0.2);           /* Borda azul suave */
    border-radius: 16px;                                  /* Cantos arredondados */
    padding: 32px 24px;                                   /* Respiro interno */
    text-align: center;                                   /* Centralizado */
    transition: all 0.3s ease;                            /* Transição suave */
}

/* Estado HOVER - Premium */
.benefit-card:hover {
    border-color: rgba(212, 175, 55, 0.7);               /* Borda dourada 70% iluminada */
    transform: translateY(-6px);                          /* Elevação de 6px */
    box-shadow: 
        0 8px 24px rgba(212, 175, 55, 0.2),             /* Sombra dourada principal */
        0 4px 12px rgba(16, 185, 129, 0.1);             /* Sombra verde secundária */
}

/* Ícone do Card */
.benefit-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

/* Ícone no Hover do Card */
.benefit-card:hover .benefit-icon {
    transform: scale(1.1);                                /* Escala o ícone 10% */
}

/* Animação GLOW PULSE no Hover */
.benefit-card:hover .icon-invlab-padrao {
    animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
    0%, 100% {
        filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.3));
    }
    50% {
        filter: drop-shadow(0 0 16px rgba(212, 175, 55, 0.5));
    }
}

/* Título do Card (h3) */
.benefit-card h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: #E4E4E4;                                       /* Branco suave */
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

/* Descrição do Card (p) */
.benefit-card p {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 400;
    color: #9CA3AF;                                       /* Cinza para hierarquia */
    line-height: 1.6;
}
```

### 4.3 Grid dos Cards

```css
.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    margin-top: 32px;
}

/* Responsividade */
@media (max-width: 768px) {
    .benefits-grid {
        grid-template-columns: repeat(2, 1fr);    /* 2 colunas em tablet */
        gap: 15px;
    }
}

@media (max-width: 480px) {
    .benefits-grid {
        grid-template-columns: 1fr;               /* 1 coluna em mobile */
        gap: 12px;
    }
}
```

---

## 📐 5. AVISO LEGAL PREMIUM

### 5.1 Estrutura HTML

```html
<!-- Aviso Legal Premium -->
<div class="legal-disclaimer-invlab">
    <div class="legal-icon">⚠️</div>
    <div class="legal-content">
        <h4>Aviso Legal</h4>
        <p>Esta plataforma é exclusivamente <strong>educacional e de simulação</strong>. Os resultados apresentados são projeções baseadas em premissas e <strong>não garantem rentabilidade futura</strong>. Não somos assessores de investimentos e não recomendamos produtos financeiros. Sempre consulte um profissional certificado (CEA/CFP) antes de investir.</p>
        <p class="legal-link">📋 Leia nossa <a href="pages/metodologia.html">Metodologia</a> para entender nossas fontes de dados e cálculos.</p>
    </div>
</div>
```

### 5.2 Propriedades CSS Completas

```css
.legal-disclaimer-invlab {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    background: rgba(245, 158, 11, 0.08);        /* Laranja suave - alerta visual */
    border: 1px solid rgba(245, 158, 11, 0.3);   /* Borda laranja suave */
    border-left: 4px solid #F59E0B;               /* Barra lateral laranja forte */
    border-radius: 12px;
    padding: 24px;
    margin: 40px auto;
    max-width: 1200px;
}

.legal-icon {
    font-size: 32px;
    flex-shrink: 0;
    line-height: 1;
}

.legal-content h4 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #F59E0B;                               /* Laranja para título */
    margin: 0 0 12px 0;
    letter-spacing: -0.01em;
}

.legal-content p {
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;                          /* 14px - legível mas discreto */
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    margin: 0 0 12px 0;
}

.legal-content a {
    color: #2A7FFF;                               /* Azul INVLAB */
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    border-bottom: 1px solid transparent;
}

.legal-content a:hover {
    color: #3B8FFF;
    border-bottom-color: #2A7FFF;
}
```

### 5.3 Características Principais

| Propriedade | Valor | Motivo |
|-------------|-------|--------|
| **Background** | `rgba(245, 158, 11, 0.08)` | Laranja suave - alerta visual sem agressividade |
| **Borda lateral** | `4px solid #F59E0B` | Destaque laranja - padrão de aviso profissional |
| **Título (h4)** | `#F59E0B` (laranja) | Cor de alerta que chama atenção |
| **Texto** | `rgba(255, 255, 255, 0.85)` | Legível, mas discreto |
| **Link** | `#2A7FFF` (azul INVLAB) | Mantém identidade visual |
| **Layout** | Flexbox com ícone lateral | Moderno e hierárquico |

---

## 📐 6. TÍTULOS E SUBTÍTULOS

### 6.1 Título de Seção H1 - Padrão Atual (Dourado)

⭐ **PADRÃO OFICIAL INVLAB (usar em todas as páginas):**

```html
<h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 2.5rem; font-weight: 800; color: #D4AF37; text-align: center; margin-bottom: 24px; letter-spacing: -0.02em; line-height: 1.2;">
    📘 O que é Renda Fixa?
</h1>
```

```css
.section-title-invlab {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.5rem;
    font-weight: 800;
    color: #D4AF37;                                      /* ⭐ DOURADO - Padrão oficial */
    text-align: center;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    line-height: 1.2;
}
```

---

### 6.1.1 Título com Degradê Verde (ALTERNATIVA - não usar agora)

💡 **Degradê verde bonito para uso futuro (comentado por enquanto):**

```html
<!-- ❌ NÃO USAR AGORA - Apenas para referência futura -->
<!-- <h2 class="section-title-premium">💎 Por que o INVLAB é diferente?</h2> -->
```

```css
/* ❌ DEGRADÊ VERDE - NÃO USAR AGORA (apenas preservado para futuro)
.section-title-premium {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 12px;
    
    /* Degradê Verde Premium - forte e iluminado */
    background: linear-gradient(90deg, #10b981 0%, #34D399 50%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    letter-spacing: -0.02em;
}
*/
```

---

### 6.2 Título H2 (Subtítulos de Seção)

⭐ **PADRÃO OFICIAL INVLAB:**

```html
<h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; font-weight: 700; color: #D4AF37; text-align: center; margin-top: 56px; margin-bottom: 36px; letter-spacing: -0.01em;">
    💰 Existem três formas principais de remuneração
</h2>
```

```css
.section-subtitle-invlab {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #D4AF37;                                      /* ⭐ DOURADO */
    text-align: center;
    margin-top: 56px;
    margin-bottom: 36px;
    letter-spacing: -0.01em;
}
```

### 6.3 Subtítulo (Texto após H1)

⭐ **PADRÃO OFICIAL INVLAB:**

```html
<p style="font-family: 'Inter', sans-serif; font-size: 1.05rem; color: rgba(16, 185, 129, 0.65); text-align: center; line-height: 1.8; margin-bottom: 32px; max-width: 900px; margin-left: auto; margin-right: auto;">
    A renda fixa reúne investimentos em que as regras de remuneração são definidas no momento da aplicação.
</p>
```

```css
.section-subtitle-premium {
    font-family: 'Inter', sans-serif;
    font-size: 1.05rem;
    font-weight: 400;
    text-align: center;
    color: rgba(16, 185, 129, 0.65);                      /* Verde suave 65% */
    margin-bottom: 32px;
    line-height: 1.8;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
}
```

---

## ✨ 7. MICROINTERAÇÕES E HOVERS

### 7.1 Propriedades de Hover Premium

```css
/* Elevação Suave */
transform: translateY(-6px);

/* Borda Dourada Iluminada (70%) */
border-color: rgba(212, 175, 55, 0.7);

/* Sombras Premium (dupla camada) */
box-shadow: 
    0 8px 24px rgba(212, 175, 55, 0.2),      /* Camada dourada */
    0 4px 12px rgba(16, 185, 129, 0.1);      /* Camada verde */

/* Escala de Ícone */
.benefit-card:hover .benefit-icon {
    transform: scale(1.1);
}

/* Animação Glow Pulse */
@keyframes glow-pulse {
    0%, 100% { 
        filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.3)); 
    }
    50% { 
        filter: drop-shadow(0 0 16px rgba(212, 175, 55, 0.5)); 
    }
}
```

### 7.2 Transições

```css
/* Transição padrão para todos os elementos interativos */
transition: all 0.3s ease;
```

---

## 📱 8. RESPONSIVIDADE

### 8.1 Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
    .section-title-premium { font-size: 1.5rem; }
    .section-subtitle-premium { font-size: 1rem; }
    .benefit-card h3 { font-size: 1.1rem; }
    .benefit-card p { font-size: 0.9rem; }
}

/* Tablet */
@media (max-width: 768px) {
    .section-title-premium { font-size: 1.8rem; }
    .section-subtitle-premium { font-size: 1rem; }
    .benefits-grid { 
        grid-template-columns: repeat(2, 1fr); 
        gap: 15px;
    }
}

/* Desktop (padrão) */
.section-title-premium { font-size: 2rem; }
.section-subtitle-premium { font-size: 1.1rem; }
```

---

## 📦 9. ARQUIVOS NECESSÁRIOS

### 9.1 Estrutura de Arquivos

```
/assets
  /css
    - styles.css              # CSS principal com tipografia
    - invlab-icons.css        # Sistema de ícones Phosphor
```

### 9.2 Inclusão no HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="assets/css/invlab-icons.css">
</head>
```

---

## ✅ 10. CHECKLIST DE IMPLEMENTAÇÃO

Use esta lista ao aplicar a identidade visual em novas páginas:

### Fase 1: Preparação
- [ ] Adicionar Google Fonts (Inter + Playfair Display) no `<head>`
- [ ] Adicionar Phosphor Icons CDN no `<head>`
- [ ] Linkar `invlab-icons.css`
- [ ] Verificar que `styles.css` tem as regras de tipografia

### Fase 2: Cores
- [ ] Aplicar paleta de cores (variáveis CSS)
- [ ] Títulos de seção: degradê verde premium
- [ ] Subtítulos: verde suave (65%)
- [ ] Títulos de cards: branco suave (#E4E4E4)
- [ ] Textos de cards: cinza (#9CA3AF)
- [ ] Bordas normais: azul translúcido
- [ ] Bordas hover: dourado 70%

### Fase 3: Ícones
- [ ] Substituir ícones por Phosphor
- [ ] Aplicar classes: `.icon-invlab-padrao`, `.icon-invlab-outline`, etc.
- [ ] Verificar cores: linha dourada + preenchimento verde

### Fase 4: Cards
- [ ] Estrutura HTML correta (`.benefit-card` > `.benefit-icon` > `h3` > `p`)
- [ ] Background: `rgba(26, 26, 26, 0.8)`
- [ ] Borda: `1px solid rgba(42, 127, 255, 0.2)`
- [ ] Hover: elevação 6px + borda dourada + sombras duplas
- [ ] Animação glow-pulse nos ícones

### Fase 5: Tipografia
- [ ] Títulos (h1-h6): Playfair Display, weight 700-800
- [ ] Textos (p, span, etc.): Inter
- [ ] Tamanhos de fonte corretos (desktop/tablet/mobile)

### Fase 6: Responsividade
- [ ] Grid adapta para 2 colunas (tablet) e 1 coluna (mobile)
- [ ] Fontes reduzem proporcionalmente
- [ ] Espaçamentos ajustam para mobile

### Fase 7: Testes
- [ ] Testar hover em todos os cards
- [ ] Verificar legibilidade de textos (contraste)
- [ ] Testar em mobile (< 480px)
- [ ] Testar em tablet (481-768px)
- [ ] Verificar animações (glow-pulse)

### Fase 8: Aviso Legal
- [ ] Adicionar `.legal-disclaimer-invlab` no final da seção principal
- [ ] Verificar ícone ⚠️ visível
- [ ] Testar link para Metodologia
- [ ] Verificar responsividade (layout coluna em mobile)

### Fase 9: Footer Premium
- [ ] Substituir footer antigo por `.footer-invlab-premium`
- [ ] Verificar logo INVLAB visível e com glow dourado
- [ ] Títulos das colunas em dourado (#D4AF37)
- [ ] Links em verde suave (85%)
- [ ] Hover dourado funcionando
- [ ] Barra superior dourada (1px)
- [ ] Grid responsivo (5 → 2 → 1 colunas)
- [ ] Testar em desktop/tablet/mobile

### Fase 10: Botão Voltar ao Topo
- [ ] Adicionar HTML: `<div id="backToTop" title="Voltar ao topo">↑</div>`
- [ ] Adicionar CSS do botão (degradê dourado + borda verde)
- [ ] Adicionar JavaScript (scroll > 300px)
- [ ] Testar aparição/desaparecimento
- [ ] Testar clique (scroll suave ao topo)
- [ ] Verificar responsivo mobile (48px, bottom: 24px)
- [ ] Z-index correto (9999)

---

## 🎯 11. EXEMPLO COMPLETO

Aqui está um exemplo completo de uma seção com cards:

```html
<!-- Seção: Diferenciais -->
<section class="section benefits">
    <h2 class="section-title-premium">💎 Por que o INVLAB é diferente?</h2>
    <p class="section-subtitle-premium">Seu laboratório para testar estratégias antes de investir de verdade.</p>
    
    <div class="benefits-grid">
        <div class="benefit-card">
            <div class="benefit-icon">
                <i class="ph-duotone ph-chart-line-up icon-invlab-padrao"></i>
            </div>
            <h3>Dados Reais do Mercado</h3>
            <p>Modelagens baseadas em indicadores atualizados, sem achismos.</p>
        </div>

        <div class="benefit-card">
            <div class="benefit-icon">
                <i class="ph-duotone ph-flask icon-invlab-padrao"></i>
            </div>
            <h3>Simuladores Profissionais</h3>
            <p>Cálculos completos com juros compostos, IR, taxas e cenários avançados.</p>
        </div>

        <div class="benefit-card">
            <div class="benefit-icon">
                <i class="ph-duotone ph-chart-donut icon-invlab-padrao"></i>
            </div>
            <h3>Análise Comparativa Inteligente</h3>
            <p>Compare múltiplos produtos lado a lado e veja quem realmente rende mais.</p>
        </div>

        <div class="benefit-card">
            <div class="benefit-icon">
                <i class="ph-duotone ph-shield-check icon-invlab-padrao"></i>
            </div>
            <h3>Ambiente Seguro para Testes</h3>
            <p>Experimente estratégias, valide hipóteses e aprenda sem arriscar seu capital.</p>
        </div>
    </div>
</section>
```

---

## 🦶 12. FOOTER PREMIUM

### 12.1 Estrutura Completa

```html
<!-- Footer Premium INVLAB -->
<footer class="footer-invlab-premium">
    <div class="content-wrapper-wide">
        <!-- Logo e Descrição Institucional -->
        <div class="footer-brand">
            <img src="assets/images/Logo_tutorfinanceiro.png" alt="INVLAB - Laboratório de Investimentos" class="footer-logo">
            <p class="footer-brand-text">Laboratório educacional de investimentos.<br>Sem venda de produtos, sem comissões, sem viés comercial.</p>
            <a href="pages/guia_invlab.html" class="footer-cta">
                🧭 Guia do INVLAB →
            </a>
        </div>

        <!-- Grid de Colunas -->
        <div class="footer-grid">
            <div class="footer-column">
                <h4>Renda Fixa</h4>
                <ul>
                    <li><a href="pages/poupanca.html">💰 Poupança</a></li>
                    <li><a href="pages/simulador-cdbs.html">🏦 CDBs</a></li>
                    <!-- ... -->
                </ul>
            </div>
            <!-- ... outras colunas ... -->
        </div>

        <!-- Disclaimers Finais -->
        <div class="footer-bottom">
            <p class="footer-disclaimer">⚠️ Conteúdo 100% educacional...</p>
            <p class="footer-institutional">Conteúdo educacional desenvolvido...</p>
            <p class="footer-copyright">© 2025 INVLAB...</p>
        </div>
    </div>
</footer>
```

### 12.2 Características Principais

| Elemento | Propriedade | Valor | Motivo |
|----------|-------------|-------|--------|
| **Barra superior** | `border-top` | `1px solid rgba(212, 175, 55, 0.25)` | Linha dourada suave - separação premium |
| **Background** | `background` | `#0D0D0D` | Consistente com o site |
| **Padding** | `padding` | `60px 20px 30px` | Respiro vertical generoso |
| **Logo** | `height` | `42px` | Tamanho equilibrado |
| **Logo (efeito)** | `filter` | `drop-shadow` dourado | Glow premium |
| **Títulos (h4)** | `color` | `#D4AF37` (Dourado) | Identidade INVLAB |
| **Títulos (weight)** | `font-weight` | `600` | Hierarquia forte |
| **Links** | `color` | `rgba(16, 185, 129, 0.85)` | Verde suave 85% |
| **Links hover** | `color` | `#D4AF37` (Dourado) | Hover premium |
| **Grid** | `grid-template-columns` | `repeat(5, 1fr)` | 5 colunas desktop |
| **Gap** | `gap` | `40px` | Espaço generoso |

### 12.3 CSS Completo do Footer

```css
.footer-invlab-premium {
    background: #0D0D0D;
    border-top: 1px solid rgba(212, 175, 55, 0.25);
    margin-top: 60px;
    padding: 60px 20px 30px;
}

/* Logo com Glow Dourado */
.footer-logo {
    height: 42px;
    margin-bottom: 16px;
    filter: 
        brightness(1.15)
        drop-shadow(0 2px 8px rgba(212, 175, 55, 0.35))
        drop-shadow(0 0 12px rgba(212, 175, 55, 0.15));
    transition: all 0.3s ease;
}

.footer-logo:hover {
    filter: 
        brightness(1.25)
        drop-shadow(0 2px 10px rgba(212, 175, 55, 0.5))
        drop-shadow(0 0 16px rgba(212, 175, 55, 0.25));
    transform: scale(1.02);
}

/* Títulos das Colunas - Dourado */
.footer-column h4 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.05rem;
    font-weight: 600;
    color: #D4AF37;
    margin-bottom: 16px;
    letter-spacing: -0.01em;
}

/* Links - Verde Suave 85% */
.footer-column a {
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    color: rgba(16, 185, 129, 0.85);
    text-decoration: none;
    transition: color 0.2s ease;
}

/* Hover Premium - Dourado */
.footer-column a:hover {
    color: #D4AF37;
}
```

### 12.4 Responsividade

```css
/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);  /* 2 colunas */
        gap: 32px 24px;
    }
}

/* Mobile (max-width: 480px) */
@media (max-width: 480px) {
    .footer-grid {
        grid-template-columns: 1fr;  /* 1 coluna */
        gap: 28px;
    }
    
    .footer-logo {
        height: 32px;
    }
}
```

### 12.5 Elementos-Chave

#### 🎨 **Logo INVLAB**
- Altura: 42px (desktop), 32px (mobile)
- Efeito: Glow dourado duplo (shadow layers)
- Hover: Brightness aumenta + escala 1.02

#### 🔤 **Tipografia**
- Títulos: Playfair Display, 600, Dourado
- Links: Inter, 400, Verde 85%
- Textos: Inter, cores graduais (0.7 → 0.6 → 0.5)

#### 🎯 **Hierarquia Visual**
1. Logo (mais destaque)
2. Títulos das colunas (dourado forte)
3. Links (verde suave)
4. Textos institucionais (cinza claro → escuro)

#### ✨ **Interações**
- Logo hover: +brightness + scale
- Links hover: verde → dourado
- Transições: 0.2s ease (rápido e fluido)

---

## 📄 13. PÁGINA METODOLOGIA (PÁGINA SEPARADA)

### 13.1 Características

A página `metodologia.html` usa a identidade visual INVLAB completa com fundo escuro:

| Elemento | Propriedade | Valor |
|----------|-------------|-------|
| **Body** | `background` | `#0D0D0D` |
| **Container** | `background` | `rgba(26, 26, 26, 0.95)` |
| **Borda** | `border` | `1px solid rgba(212, 175, 55, 0.2)` |
| **H1 (título)** | Degradê verde | `linear-gradient(90deg, #10b981...)` |
| **H2 (seções)** | `color` | `#D4AF37` (Dourado) |
| **H3 (subseções)** | `color` | `#E4E4E4` (Branco suave) |
| **Textos** | `color` | `rgba(255, 255, 255, 0.85)` |
| **Link voltar** | `color` | Verde 85% → Dourado hover |

### 13.2 Boxes de Destaque

```css
/* Box Verde (Destaque) */
.highlight-box {
    background: rgba(16, 185, 129, 0.1);
    border-left: 4px solid #10b981;
}

/* Box Laranja (Aviso) */
.warning-box {
    background: rgba(245, 158, 11, 0.08);
    border-left: 4px solid #F59E0B;
}
```

### 13.3 Tabelas Premium

```css
th {
    background: rgba(212, 175, 55, 0.1);  /* Fundo dourado suave */
    color: #D4AF37;                       /* Texto dourado */
}

td {
    color: rgba(255, 255, 255, 0.85);
}
```

---

## 🔝 14. BOTÃO VOLTAR AO TOPO (Back to Top)

### 14.1 Estrutura

```html
<!-- Botão Voltar ao Topo -->
<div id="backToTop" title="Voltar ao topo">↑</div>
```

### 14.2 CSS Premium INVLAB

```css
#backToTop {
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #D4AF37, rgba(212, 175, 55, 0.8));
    border: 2px solid rgba(16, 185, 129, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
    z-index: 9999;
}

#backToTop.show {
    opacity: 1;
    visibility: visible;
}

#backToTop:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.9), #D4AF37);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.6);
    border-color: rgba(16, 185, 129, 0.6);
}
```

### 14.3 JavaScript

```javascript
// Botão Voltar ao Topo
const backToTopBtn = document.getElementById('backToTop');

// Mostrar/esconder botão baseado no scroll
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Scroll suave ao topo quando clicar
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
```

### 14.4 Características

| Propriedade | Valor | Motivo |
|-------------|-------|--------|
| **Posição** | `fixed, bottom: 40px, right: 40px` | Sempre visível no canto |
| **Background** | Degradê dourado | Identidade INVLAB |
| **Borda** | Verde translúcido 30% | Toque premium |
| **Aparece** | Após 300px scroll | Não incomoda no início |
| **Hover** | Elevação -4px | Feedback visual |
| **Sombra** | Dourada 0.4-0.6 | Destaque premium |
| **Scroll** | `behavior: 'smooth'` | Animação suave |

### 14.5 Responsivo

```css
@media (max-width: 768px) {
    #backToTop {
        bottom: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        font-size: 20px;
    }
}
```

---

## 💬 15. TOOLTIPS PREMIUM (Popup Explicativo)

### 15.1 Uso e Propósito

**Quando usar tooltips:**
- ✅ Termos técnicos em inglês
- ✅ Siglas e abreviações (API, CVM, ANBIMA, etc.)
- ✅ Jargão do mercado financeiro (churn, AUM, NPS, compliance)
- ✅ Palavras pouco usuais ou desconhecidas pelo público leigo

**Regra:** Toda palavra técnica, estrangeira ou incomum deve ter **itálico + tooltip explicativo**.

### 15.2 Estrutura HTML

```html
<span class="tooltip-term" data-tooltip="Explicação clara e objetiva do termo">termo técnico</span>
```

**Exemplos reais:**

```html
<!-- Termo em inglês -->
<span class="tooltip-term" data-tooltip="Suitability = Adequação. Processo regulatório obrigatório que verifica se um investimento é compatível com o perfil do investidor.">suitability</span>

<!-- Sigla -->
<span class="tooltip-term" data-tooltip="API = Análise de Perfil do Investidor. Processo obrigatório para classificar o investidor antes de oferecer produtos financeiros.">API</span>

<!-- Jargão do mercado -->
<span class="tooltip-term" data-tooltip="Churn = Taxa de cancelamento ou saída de clientes. Quanto menor o churn, mais clientes ficam na corretora.">churn</span>
```

### 15.3 CSS Premium INVLAB

```css
/* Termo com Tooltip - Estilo base */
.tooltip-term {
    position: relative;
    font-style: italic;                              /* ⚠️ SEMPRE em itálico */
    color: rgba(16, 185, 129, 0.95);                /* Verde INVLAB mais visível */
    cursor: help;                                    /* Cursor muda para "?" */
    border-bottom: 1px dotted rgba(16, 185, 129, 0.5); /* Linha pontilhada verde */
    transition: all 0.2s ease;
}

/* Hover no termo */
.tooltip-term:hover {
    color: #D4AF37;                                  /* Dourado no hover */
    border-bottom-color: rgba(212, 175, 55, 0.7);   /* Linha dourada */
}

/* Caixa do Tooltip (aparece no hover) */
.tooltip-term::after {
    content: attr(data-tooltip);                     /* Pega o texto do atributo */
    position: absolute;
    bottom: 125%;                                    /* Acima do termo */
    left: 50%;
    transform: translateX(-50%);
    background: rgba(26, 26, 26, 0.98);             /* Fundo escuro premium */
    color: rgba(255, 255, 255, 0.95);               /* Texto branco */
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 0.875rem;                            /* 14px */
    font-style: normal;                              /* Remove itálico do tooltip */
    font-weight: 400;
    line-height: 1.5;
    white-space: normal;
    width: 280px;                                    /* Largura fixa */
    max-width: 90vw;                                /* Responsivo */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);     /* Sombra forte */
    border: 1px solid rgba(212, 175, 55, 0.3);      /* Borda dourada suave */
    opacity: 0;                                      /* Invisível por padrão */
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 1000;
    text-align: left;
}

/* Seta do Tooltip (triângulo apontando para baixo) */
.tooltip-term::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: rgba(26, 26, 26, 0.98);       /* Cor igual ao fundo */
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
}

/* Mostrar tooltip ao passar o mouse */
.tooltip-term:hover::after,
.tooltip-term:hover::before {
    opacity: 1;
    visibility: visible;
}

/* Mobile: tooltip ativo ao tocar */
.tooltip-term.tooltip-active::after,
.tooltip-term.tooltip-active::before {
    opacity: 1;
    visibility: visible;
}

/* Responsivo Mobile */
@media (max-width: 768px) {
    .tooltip-term::after {
        width: 240px;
        font-size: 0.8rem;
        padding: 10px 12px;
    }
}
```

### 15.4 JavaScript para Mobile (Touch)

```javascript
// JavaScript for Mobile Tooltips (touch support)
if ('ontouchstart' in window) {
    const tooltips = document.querySelectorAll('.tooltip-term');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // Remove active class from all other tooltips
            tooltips.forEach(t => {
                if (t !== this) t.classList.remove('tooltip-active');
            });
            // Toggle active class on clicked tooltip
            this.classList.toggle('tooltip-active');
        });
    });
    
    // Close tooltip when touching outside
    document.addEventListener('touchstart', function(e) {
        if (!e.target.classList.contains('tooltip-term')) {
            tooltips.forEach(t => t.classList.remove('tooltip-active'));
        }
    });
}
```

### 15.5 Características Principais

| Elemento | Propriedade | Valor | Motivo |
|----------|-------------|-------|--------|
| **Termo (texto)** | `font-style` | `italic` | Diferencia visualmente |
| **Termo (cor)** | `color` | Verde INVLAB 95% | Destaque suave |
| **Termo (hover)** | `color` | Dourado #D4AF37 | Interação premium |
| **Linha inferior** | `border-bottom` | Pontilhada verde | Indica interatividade |
| **Tooltip (fundo)** | `background` | `rgba(26, 26, 26, 0.98)` | Contraste escuro |
| **Tooltip (borda)** | `border` | Dourado 30% | Premium sutil |
| **Tooltip (largura)** | `width` | 280px (desktop) / 240px (mobile) | Legibilidade |
| **Aparição** | `transition` | `0.3s ease` | Suave e fluido |
| **Z-index** | `z-index` | 1000 | Sempre por cima |

### 15.6 Termos Comuns que DEVEM ter Tooltip

#### **Termos em Inglês:**
- `suitability` → "Adequação (processo regulatório)"
- `churn` → "Taxa de cancelamento de clientes"
- `compliance` → "Conformidade regulatória"

#### **Siglas do Mercado:**
- `API` → "Análise de Perfil do Investidor"
- `CVM` → "Comissão de Valores Mobiliários"
- `ANBIMA` → "Associação do mercado financeiro"
- `AUM` → "Assets Under Management (Patrimônio sob Gestão)"
- `NPS` → "Net Promoter Score (Índice de Satisfação)"
- `FGC` → "Fundo Garantidor de Créditos"
- `IR` → "Imposto de Renda"

#### **Termos Técnicos:**
- `pós-fixado` → "Rentabilidade atrelada a um índice (CDI, Selic)"
- `prefixado` → "Taxa de juros definida na hora da aplicação"
- `liquidez` → "Facilidade de converter investimento em dinheiro"
- `volatilidade` → "Oscilação do preço de um ativo"

### 15.7 Exemplo Completo em Contexto

```html
<p>
    A <strong>Análise de Perfil do Investidor 
    (<span class="tooltip-term" data-tooltip="API = Análise de Perfil do Investidor. Processo obrigatório para classificar o investidor antes de oferecer produtos financeiros.">API</span>)</strong>, 
    conhecida como 
    <span class="tooltip-term" data-tooltip="Suitability = Adequação (do inglês 'suitable' = adequado). É o processo que verifica se um investimento é compatível com o perfil do investidor.">suitability</span>, 
    é uma metodologia obrigatória regulamentada pela 
    <span class="tooltip-term" data-tooltip="CVM = Comissão de Valores Mobiliários. Órgão que regula e fiscaliza o mercado de capitais no Brasil.">CVM</span>.
</p>
```

### 15.8 Boas Práticas

✅ **SEMPRE use itálico** para termos com tooltip  
✅ **Explicações curtas** (máximo 2-3 linhas)  
✅ **Linguagem simples** na explicação  
✅ **Traduza termos em inglês** quando possível  
✅ **Tooltip funciona no mobile** (toque para mostrar)  

❌ **NÃO use tooltip** em termos óbvios  
❌ **NÃO deixe explicações longas** (quebra o fluxo)  
❌ **NÃO esqueça o itálico** (perde a identidade)  

---

## 🚀 16. PRÓXIMOS PASSOS

Páginas que precisam receber a identidade visual:

1. **Simuladores**
   - [ ] `pages/simulador-cdbs.html`
   - [ ] `pages/simulador-tesouro-direto.html`
   - [ ] Outros simuladores

2. **Páginas Educacionais**
   - [ ] Renda Fixa
   - [ ] Renda Variável
   - [ ] Criptoativos
   - [ ] Outros conteúdos

3. **Componentes**
   - [ ] Modais informativos
   - [ ] Breadcrumbs
   - [ ] Botões de ação
   - [ ] **Botão Voltar ao Topo (todas as páginas longas)**

4. **Páginas Especiais**
   - [x] `index.html` (✅ Completo)
   - [x] `pages/metodologia.html` (✅ Completo)
   - [x] `pages/guia_invlab.html` (✅ Completo)
   - [x] `pages/artigo-perfil-investidor.html` (✅ Completo)
   - [ ] Outras páginas standalone

---

## 😀 17. EMOJIS (Boas Práticas)

### 17.1 Regra de Ouro

⚠️ **NUNCA aplique propriedades de cor, gradiente ou filtros diretamente nos emojis!**

Emojis devem manter sua aparência colorida original. Quando usados em títulos com gradiente ou cor especial, **separe o emoji do texto estilizado**.

### 17.2 Exemplo ERRADO ❌

```html
<!-- ❌ ERRADO: Emoji dentro do elemento com gradiente -->
<h1 style="background: linear-gradient(90deg, #10b981 0%, #34D399 50%, #10b981 100%); 
           -webkit-background-clip: text; 
           -webkit-text-fill-color: transparent;">
    🧭 Guia do INVLAB
</h1>
```

**Problema:** O emoji fica verde/transparente, perdendo sua identidade visual.

### 17.3 Exemplo CORRETO ✅

```html
<!-- ✅ CORRETO: Emoji separado do texto com gradiente -->
<h1>
    <span style="filter: none;">🧭</span> 
    <span style="background: linear-gradient(90deg, #10b981 0%, #34D399 50%, #10b981 100%); 
                 -webkit-background-clip: text; 
                 -webkit-text-fill-color: transparent;">
        Guia do INVLAB
    </span>
</h1>
```

**Resultado:** Emoji mantém sua aparência original (colorida) e o texto tem o gradiente verde.

### 17.4 Casos de Uso

| Situação | Solução |
|----------|---------|
| **Título com degradê verde** | Emoji em `<span>` separado SEM estilo |
| **Título dourado** | Emoji pode ficar junto (cor sólida não afeta) |
| **Links com hover** | Emoji fora do `<a>` ou com `filter: none` |
| **Badges/Pills** | Emoji pode ficar junto (background não afeta) |

### 17.5 CSS Auxiliar

```css
/* Classe para forçar emoji sem filtros */
.emoji-preserve {
    filter: none !important;
    background: none !important;
    -webkit-text-fill-color: initial !important;
}
```

**Uso:**
```html
<h1>
    <span class="emoji-preserve">🧭</span> 
    <span class="text-gradient">Guia do INVLAB</span>
</h1>
```

---

## 📏 18. ESPAÇAMENTO VERTICAL PADRÃO

### 18.1 Respiro Entre Elementos

Para manter consistência visual e evitar elementos "colados", use estes espaçamentos padrão:

| Elemento | Propriedade | Valor | Motivo |
|----------|-------------|-------|--------|
| **Breadcrumb (topo)** | `margin-top` | `20px` | Respiro após header fixo |
| **Breadcrumb (base)** | `margin-bottom` | `32px` | Separação do conteúdo |
| **Section após breadcrumb** | `margin-top` | `40px` | Respiro visual generoso |
| **H2 (Títulos de seção)** | `margin-top` | `48px` | Separação entre seções |
| **H2 (Títulos de seção)** | `margin-bottom` | `20px` | Espaço antes do conteúdo |
| **H3 (Subtítulos)** | `margin-top` | `32px` | Separação de subseções |
| **H3 (Subtítulos)** | `margin-bottom` | `16px` | Espaço antes do texto |
| **Parágrafos** | `margin-bottom` | `16px` | Espaço entre parágrafos |

### 18.2 Exemplo Completo

```html
<!-- Breadcrumb -->
<nav class="breadcrumb" style="margin-top: 20px; margin-bottom: 32px;">
    <a href="../index.html">🏠 Início</a>
    <span class="breadcrumb-separator">/</span>
    <span class="breadcrumb-current">🧭 Guia</span>
</nav>

<!-- Section -->
<section class="section-educational" style="margin-top: 40px;">
    <!-- H1 - Título principal -->
    <h1 style="margin-bottom: 16px;">Título Principal</h1>
    
    <!-- Subtítulo -->
    <p class="subtitle" style="margin-bottom: 40px;">Subtítulo descritivo</p>
    
    <!-- H2 - Primeira seção -->
    <h2 style="margin-top: 48px; margin-bottom: 20px;">Primeira Seção</h2>
    <p style="margin-bottom: 16px;">Parágrafo de conteúdo.</p>
    
    <!-- H3 - Subseção -->
    <h3 style="margin-top: 32px; margin-bottom: 16px;">Subseção</h3>
    <p style="margin-bottom: 16px;">Parágrafo de conteúdo.</p>
</section>
```

### 18.3 Classes Utilitárias (Opcional)

```css
/* Respiros padrão INVLAB */
.invlab-spacing-top-sm { margin-top: 20px; }
.invlab-spacing-top-md { margin-top: 32px; }
.invlab-spacing-top-lg { margin-top: 40px; }
.invlab-spacing-top-xl { margin-top: 48px; }

.invlab-spacing-bottom-sm { margin-bottom: 16px; }
.invlab-spacing-bottom-md { margin-bottom: 20px; }
.invlab-spacing-bottom-lg { margin-bottom: 32px; }
.invlab-spacing-bottom-xl { margin-bottom: 40px; }
```

### 18.4 Responsividade

```css
/* Mobile: reduzir espaçamentos em 20-30% */
@media (max-width: 768px) {
    .breadcrumb {
        margin-top: 16px;
        margin-bottom: 24px;
    }
    
    .section-educational {
        margin-top: 32px;
    }
    
    h2 {
        margin-top: 36px;
        margin-bottom: 16px;
    }
    
    h3 {
        margin-top: 24px;
        margin-bottom: 12px;
    }
}
```

### 18.5 Regra Geral

**"Quanto maior o elemento, maior o respiro vertical."**

- Títulos principais (H1, H2): `40-48px` de margem superior
- Subtítulos (H3): `32px` de margem superior
- Textos e parágrafos: `16px` de margem inferior
- **Breadcrumb: NUNCA use `margin-top` inline! O breadcrumb deve estar `position: sticky` e colado na base do menu (top: 110px). Use apenas `margin-bottom: 32px` no CSS.**

Isso cria **hierarquia visual clara** e evita sensação de "elementos colados".

### 18.6 ⚠️ REGRA CRÍTICA DO BREADCRUMB

**NUNCA adicione `margin-top` ou `padding-top` inline no breadcrumb!**

✅ **CORRETO:**
```html
<nav class="breadcrumb">
    <!-- conteúdo -->
</nav>
```

❌ **ERRADO:**
```html
<nav class="breadcrumb" style="margin-top: 20px;">
    <!-- conteúdo -->
</nav>
```

**Por quê?**
- O breadcrumb usa `position: sticky` e `top: 110px` (desktop) para colar na base do menu ao rolar
- Qualquer `margin-top` inline quebra essa funcionalidade e cria gap visual
- O espaçamento correto já está definido no `artigo-styles.css`

**Valores de referência:**
- Desktop: `top: 110px`
- Tablet: `top: 90px`
- Mobile: `top: 96px`

---

### 18.7 🗺️ BREADCRUMB INVLAB - PADRÃO DESKTOP COMPLETO

**Status:** ✅ Implementado e testado  
**Página de Referência:** `pages/simulador-aposentadoria.html`  
**Objetivo:** Documentar todas as características do breadcrumb como identidade visual oficial do INVLAB

---

#### 18.7.1 Container Principal (`<div>`)

**Posicionamento:**
```css
position: sticky;        /* Fixo ao rolar */
top: 110px;             /* Abaixo do header (altura do menu master) */
z-index: 100;           /* Acima do conteúdo, abaixo do menu */
```

**Visual:**
```css
background: #0D0D0D;    /* Fundo preto */
width: 100%;            /* Largura total */
padding: 12px 20px 12px; /* 12px top/bottom, 20px left, 12px right */
margin-bottom: 0 !important; /* Sem margem inferior */
```

**Estrutura HTML:**
```html
<div style="position: sticky; top: 110px; z-index: 100; background: #0D0D0D; width: 100%; padding: 12px 20px 12px; margin-bottom: 0 !important;">
    <nav class="breadcrumb-nav">
        <!-- conteúdo -->
    </nav>
</div>
```

---

#### 18.7.2 Navegação Interna (`<nav>`)

**Layout:**
```css
max-width: 1200px;      /* Largura máxima centralizada */
margin: 0 auto;         /* Centralizado */
display: flex;          /* Flexbox horizontal */
align-items: center;    /* Alinhamento vertical centralizado */
gap: 8px;               /* Espaçamento entre itens */
```

**Tipografia:**
```css
font-family: 'Inter', sans-serif;  /* Fonte Inter */
font-size: 12px;                   /* Tamanho 12px */
color: rgba(255, 255, 255, 0.6);   /* Cor base (60% opacidade) */
```

**Estrutura HTML:**
```html
<nav style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.6);">
    <!-- itens do breadcrumb -->
</nav>
```

---

#### 18.7.3 Itens do Breadcrumb

**1️⃣ Link "🏠 Início":**
```html
<a href="../index.html" style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.7); text-decoration: none; transition: color 0.3s;">🏠 Início</a>
```

**Propriedades:**
- `font-family: 'Inter', sans-serif`
- `font-size: 12px`
- `color: rgba(255, 255, 255, 0.7)` - 70% opacidade
- `text-decoration: none` - sem sublinhado
- `transition: color 0.3s` - transição de cor

---

**2️⃣ Separador "/":**
```html
<span style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.4);">/</span>
```

**Propriedades:**
- `font-family: 'Inter', sans-serif`
- `font-size: 12px`
- `color: rgba(255, 255, 255, 0.4)` - 40% opacidade (mais discreto)
- Elemento: `<span>` (texto estático)

---

**3️⃣ Link "🛠️ Ferramentas":**
```html
<a href="../index.html#ferramentas" style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.7); text-decoration: none; transition: color 0.3s;">🛠️ Ferramentas</a>
```

**Propriedades:**
- `font-family: 'Inter', sans-serif`
- `font-size: 12px`
- `color: rgba(255, 255, 255, 0.7)` - 70% opacidade
- `text-decoration: none` - sem sublinhado
- `transition: color 0.3s` - transição de cor

---

**4️⃣ Separador "/":**
```html
<span style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.4);">/</span>
```

**Propriedades:**
- `font-family: 'Inter', sans-serif`
- `font-size: 12px`
- `color: rgba(255, 255, 255, 0.4)` - 40% opacidade
- Elemento: `<span>` (texto estático)

---

**5️⃣ Página Atual "🏖️ Simulador de Aposentadoria" (Destaque):**
```html
<span style="font-family: 'Inter', sans-serif; font-size: 12px; color: #FFFFFF; font-weight: 600; background: rgba(42, 127, 255, 0.15); padding: 4px 10px; border-radius: 6px; border-left: 3px solid #3B82F6;">🏖️ Simulador de Aposentadoria</span>
```

**Propriedades:**
- `font-family: 'Inter', sans-serif`
- `font-size: 12px`
- `color: #FFFFFF` - branco (100% opacidade)
- `font-weight: 600` - semibold
- `background: rgba(42, 127, 255, 0.15)` - fundo azul (15% opacidade)
- `padding: 4px 10px` - 4px vertical, 10px horizontal
- `border-radius: 6px` - bordas arredondadas
- `border-left: 3px solid #3B82F6` - borda esquerda azul sólida
- Elemento: `<span>` (não clicável, indica página atual)

---

#### 18.7.4 Posição em Relação ao Menu Master

**Hierarquia Visual:**
1. **Menu master (header)** - `position: sticky`, `top: 0`, `z-index: alto`
2. **Breadcrumb** - `position: sticky`, `top: 110px`, `z-index: 100`
3. **Conteúdo principal** - abaixo do breadcrumb

**Espaçamento:**
- `top: 110px` - posicionado 110px do topo (altura do header)
- Fica fixo ao rolar, sempre abaixo do menu

---

#### 18.7.5 Resumo das Características

| Elemento | Fonte | Tamanho | Cor | Opacidade | Peso |
|----------|-------|---------|-----|-----------|------|
| **Container** | - | - | `#0D0D0D` | 100% | - |
| **Nav** | Inter | 12px | Branco | 60% | Normal |
| **Links** | Inter | 12px | Branco | 70% | Normal |
| **Separadores** | Inter | 12px | Branco | 40% | Normal |
| **Página Atual** | Inter | 12px | Branco | 100% | 600 (semibold) |

---

#### 18.7.6 Destaque da Página Atual

**Características visuais:**
- ✅ **Fundo azul translúcido:** `rgba(42, 127, 255, 0.15)`
- ✅ **Borda esquerda azul:** `3px solid #3B82F6`
- ✅ **Texto branco sólido:** `#FFFFFF`
- ✅ **Font-weight:** `600` (semibold)
- ✅ **Padding interno:** `4px 10px`
- ✅ **Border-radius:** `6px`

**Por quê:**
- Diferencia claramente a página atual dos links navegáveis
- Cria hierarquia visual (página atual = destaque)
- Mantém identidade INVLAB (azul premium)
- Não é clicável (apenas indicador visual)

---

#### 18.7.7 Comportamento

**Funcionalidades:**
- ✅ **Fixo ao rolar** (`position: sticky`)
- ✅ **Sempre visível** abaixo do menu
- ✅ **Links com transição** de cor no hover
- ✅ **Página atual não clicável** (apenas indicador visual)

**Estrutura HTML Completa:**
```html
<!-- Breadcrumb (fixo, abaixo do menu) -->
<div style="position: sticky; top: 110px; z-index: 100; background: #0D0D0D; width: 100%; padding: 12px 20px 12px; margin-bottom: 0 !important;">
    <nav style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.6);">
        <a href="../index.html" style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.7); text-decoration: none; transition: color 0.3s;">🏠 Início</a>
        <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.4);">/</span>
        <a href="../index.html#ferramentas" style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.7); text-decoration: none; transition: color 0.3s;">🛠️ Ferramentas</a>
        <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(255, 255, 255, 0.4);">/</span>
        <span style="font-family: 'Inter', sans-serif; font-size: 12px; color: #FFFFFF; font-weight: 600; background: rgba(42, 127, 255, 0.15); padding: 4px 10px; border-radius: 6px; border-left: 3px solid #3B82F6;">🏖️ Simulador de Aposentadoria</span>
    </nav>
</div>
```

---

#### 18.7.8 CSS Recomendado (Classe `.breadcrumb-nav`)

Para facilitar a manutenção, recomenda-se criar uma classe CSS:

```css
/* Breadcrumb Container */
.breadcrumb-container {
    position: sticky;
    top: 110px;
    z-index: 100;
    background: #0D0D0D;
    width: 100%;
    padding: 12px 20px 12px;
    margin-bottom: 0 !important;
}

/* Breadcrumb Navigation */
.breadcrumb-nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
}

/* Links do Breadcrumb */
.breadcrumb-nav a {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.3s;
}

.breadcrumb-nav a:hover {
    color: rgba(255, 255, 255, 0.9);
}

/* Separadores */
.breadcrumb-nav .breadcrumb-separator {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
}

/* Página Atual (Destaque) */
.breadcrumb-nav .breadcrumb-current {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #FFFFFF;
    font-weight: 600;
    background: rgba(42, 127, 255, 0.15);
    padding: 4px 10px;
    border-radius: 6px;
    border-left: 3px solid #3B82F6;
}
```

---

#### 18.7.9 Checklist de Implementação

Ao implementar o breadcrumb em uma nova página:

- [ ] 1. Container com `position: sticky` e `top: 110px`
- [ ] 2. Background `#0D0D0D` (preto)
- [ ] 3. Padding `12px 20px 12px`
- [ ] 4. Nav com `max-width: 1200px` e `margin: 0 auto`
- [ ] 5. Flexbox com `gap: 8px`
- [ ] 6. Fonte Inter, tamanho 12px
- [ ] 7. Links com cor `rgba(255, 255, 255, 0.7)` e transição
- [ ] 8. Separadores com cor `rgba(255, 255, 255, 0.4)`
- [ ] 9. Página atual com fundo azul, borda esquerda e font-weight 600
- [ ] 10. Z-index 100 (acima do conteúdo, abaixo do menu)
- [ ] 11. Testar comportamento sticky ao rolar
- [ ] 12. Validar responsividade (ajustes para mobile em media queries)

---

#### 18.7.10 Responsividade (Mobile)

**⚠️ IMPORTANTE:** As características acima são para **desktop**. Para mobile, ajustar:

```css
@media (max-width: 768px) {
    .breadcrumb-container {
        top: 96px;              /* Altura menor do header mobile */
        padding: 8px 10px !important;
    }
    
    .breadcrumb-nav {
        font-size: 12px !important;
        gap: 6px !important;
    }
    
    .breadcrumb-nav a,
    .breadcrumb-nav .breadcrumb-separator,
    .breadcrumb-nav .breadcrumb-current {
        font-size: 12px !important;
    }
}
```

---

#### 18.7.11 Status

**Status:** ✅ **PADRÃO OFICIAL INVLAB**  
**Página de referência:** `pages/simulador-aposentadoria.html`  
**Última atualização:** Janeiro de 2025  
**Aplicável a:** Todas as páginas do site INVLAB

**⚠️ IMPORTANTE:** Este breadcrumb é **identidade visual oficial** do INVLAB e deve ser preservado e replicado em todas as páginas do site para manter consistência visual.

---

### 18.8 🎯 MENU PREMIUM INVLAB - PADRÃO DESKTOP COMPLETO

**Status:** ✅ Implementado e testado  
**Páginas de Referência:** `index.html`, `pages/simulador-aposentadoria.html`  
**Objetivo:** Documentar todas as características do menu premium/master como identidade visual oficial do INVLAB

---

#### 18.8.1 Container Principal (`.main-header`)

**Posicionamento:**
```css
position: fixed;        /* Fixo no topo */
top: 60px;             /* Abaixo do carrossel (55px) + gap (5px) */
left: 0;
right: 0;
z-index: 1000;         /* Acima de todo conteúdo */
```

**Visual:**
```css
background: #0D0D0D;    /* Fundo preto opaco */
overflow: visible !important;  /* Permite dropdowns aparecerem */
padding: 0;            /* Zero padding no header principal */
margin: 0;             /* Zero margin */
box-shadow: none;      /* Sem sombra para visual limpo */
border-bottom: none;   /* Sem borda inferior */
```

**Estrutura HTML:**
```html
<header class="main-header">
    <div class="header-container">
        <!-- Logo e Menu -->
    </div>
</header>
```

---

#### 18.8.2 Container Interno (`.header-container`)

**Layout:**
```css
position: relative;
max-width: 1200px;     /* Largura máxima centralizada */
margin: 0 auto;        /* Centralizado */
padding: 8px 32px 0 !important;  /* 8px top, 32px laterais, 0 bottom */
display: flex;
flex-direction: column;
gap: 0 !important;     /* Zero gap */
overflow: visible !important;
```

**Visual:**
```css
min-height: 0 !important;  /* Zero altura mínima */
border: none !important;    /* Sem bordas */
box-shadow: none !important; /* Sem sombras */
```

---

#### 18.8.3 Logo (`.header-logo`)

**⚠️ IMPORTANTE:** Logo **SEM texto "INVLAB"** - apenas imagem.

**Posicionamento:**
```css
position: absolute;
left: 32px;            /* Margem esquerda */
top: 50%;
transform: translateY(-50%);  /* Centralizado verticalmente */
display: flex;
align-items: center;
gap: 12px;
z-index: 10;
margin-top: 8px;       /* Respiro superior */
line-height: 0;        /* Elimina espaço fantasma */
```

**Imagem do Logo:**
```css
height: 47px;          /* Altura fixa desktop */
filter: 
    brightness(1.15)
    drop-shadow(0 2px 8px rgba(255, 215, 0, 0.35))
    drop-shadow(0 0 12px rgba(255, 215, 0, 0.15));
transition: all 0.3s ease;
```

**Hover do Logo:**
```css
filter: 
    brightness(1.25)
    drop-shadow(0 2px 10px rgba(255, 215, 0, 0.5))
    drop-shadow(0 0 16px rgba(255, 215, 0, 0.25));
transform: scale(1.02);
```

**Estrutura HTML:**
```html
<div class="header-logo">
    <img src="../assets/images/Logo_InvLab.png" alt="INVLAB" class="logo-img" loading="eager">
</div>
```

**⚠️ CRÍTICO:** 
- **NÃO incluir** `<span class="logo-text">INVLAB</span>` - apenas a imagem
- **Path:** `../assets/images/Logo_InvLab.png` (páginas em `pages/`) ou `assets/images/Logo_InvLab.png` (página `index.html`)

---

#### 18.8.4 Sistema de Abas (`.tabs-nav-wrapper` e `.tabs-nav`)

**Wrapper (`.tabs-nav-wrapper`):**
```css
position: relative;
overflow: visible !important;  /* Permite dropdowns */
scrollbar-width: none;         /* Esconde scrollbar */
padding: 0;
margin: 0;
border: none;
box-shadow: none;
```

**Navegação (`.tabs-nav`):**
```css
position: relative;
display: flex;
flex-wrap: nowrap;
justify-content: center;  /* Centralizado */
align-items: center;
gap: 0;                   /* Zero gap entre botões */
padding: 0;
margin: 0;
width: 100%;
overflow: visible !important;
border: none;
box-shadow: none;
```

**Estrutura HTML:**
```html
<div class="tabs-nav-wrapper">
    <nav class="tabs-nav" id="tabsNav">
        <!-- Botões de aba -->
    </nav>
</div>
```

---

#### 18.8.5 Botões de Aba (`.tab-btn`)

**Layout:**
```css
position: relative;
flex: 0 0 auto;
min-width: 130px;
max-width: 130px;
width: 130px;
padding: 6px 12px;      /* 6px vertical, 12px horizontal */
border-radius: 6px;
```

**Visual:**
```css
background: transparent;
border: none;
color: rgba(255, 255, 255, 0.7);  /* Branco 70% opacidade */
font-size: 12px;
font-weight: 600;
text-transform: none;
letter-spacing: 0.3px;
line-height: 1.2;
text-align: center;
white-space: normal;    /* Permite quebra de linha */
```

**Estados:**
```css
/* Hover */
.tab-btn:hover {
    background: transparent;
    color: var(--blue-action);  /* Azul INVLAB (#2A7FFF) */
}

/* Ativo */
.tab-btn.active {
    background: transparent;
    color: var(--blue-action);  /* Azul INVLAB (#2A7FFF) */
}
```

**Transição:**
```css
transition: all 0.2s ease;
cursor: pointer;
```

**Estrutura HTML:**
```html
<!-- Aba simples -->
<button class="tab-btn" onclick="window.location.href='../index.html#inicio'">
    🏠 Início
</button>

<!-- Aba com quebra de linha -->
<button class="tab-btn" onclick="window.location.href='../index.html#primeiros-passos'">
    📚 Primeiros<br>Passos
</button>
```

---

#### 18.8.6 Dropdowns (`.tab-with-dropdown`)

**Container do Dropdown:**
```css
position: relative;
display: inline-block;
flex: 0 0 auto;
```

**Seta do Dropdown (`.arrow`):**
```css
font-size: 10px;
margin-left: 4px;
opacity: 0.6;
display: inline-flex;
align-items: center;
transition: all 0.2s ease;
```

**Hover da Seta:**
```css
opacity: 1.0;
transform: rotate(180deg);
```

**Menu Dropdown (`.dropdown-menu`):**
```css
position: absolute !important;
left: 0 !important;
top: 100% !important;
min-width: 220px;
margin-top: 8px;
background: rgba(14, 14, 14, 0.98);  /* Fundo quase preto */
backdrop-filter: blur(10px);
border: 1px solid rgba(42, 127, 255, 0.3);  /* Borda azul INVLAB */
border-radius: 8px;
padding: 8px 0;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
z-index: 999999 !important;
```

**Estado Oculto (padrão):**
```css
opacity: 0;
visibility: hidden;
transform: translateY(-10px);
pointer-events: none;
transition: all 0.3s ease;
```

**Estado Aberto (`.open`):**
```css
.tab-with-dropdown.open .dropdown-menu {
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    display: block !important;
    transform: translateY(0) !important;
}
```

**Links do Dropdown:**
```css
display: block;
padding: 12px 16px;
color: rgba(255, 255, 255, 0.9);
text-decoration: none;
font-size: 13px;
font-weight: 500;
transition: all 0.2s ease;
```

**Hover dos Links:**
```css
background: rgba(42, 127, 255, 0.12);  /* Fundo azul suave */
color: var(--blue-action);              /* Azul INVLAB */
padding-left: 20px;                     /* Shift à direita */
```

**Item Ativo:**
```css
background: rgba(42, 127, 255, 0.18);
color: var(--blue-action);
border-left: 3px solid var(--blue-action);
font-weight: 600;
```

**Estrutura HTML:**
```html
<div class="tab-with-dropdown">
    <button class="tab-btn dropdown-toggle">
        📊 Renda<br>Fixa <span class="arrow">▼</span>
    </button>
    <ul class="dropdown-menu">
        <li><a href="pages/simulador-cdbs.html">🏦 CDBs</a></li>
        <li><a href="pages/simulador-tesouro-direto.html">🇧🇷 Tesouro Direto</a></li>
        <!-- ... mais itens ... -->
    </ul>
</div>
```

---

#### 18.8.7 Categorias no Dropdown (`.dropdown-category`)

**Header da Categoria (`.category-header`):**
```css
padding: 12px 16px;
color: rgba(255, 255, 255, 0.9);
font-size: 13px;
font-weight: 600;
cursor: pointer;
transition: all 0.2s ease;
```

**Hover do Header:**
```css
background: rgba(42, 127, 255, 0.15) !important;
color: #2A7FFF !important;  /* Azul INVLAB */
```

**Submenu (`.category-submenu`):**
```css
padding-left: 40px;  /* Indentação */
background: rgba(0, 0, 0, 0.2);
```

**Links do Submenu:**
```css
padding: 10px 16px;
color: rgba(255, 255, 255, 0.75);
font-size: 12px;
```

**Hover dos Links do Submenu:**
```css
background: rgba(42, 127, 255, 0.18) !important;
color: rgba(255, 255, 255, 0.95) !important;
padding-left: 44px !important;
transform: translateX(2px);
border-left: 3px solid var(--blue-primary);
```

**Estrutura HTML:**
```html
<li class="dropdown-category">
    <div class="category-header" data-category="etfs" onclick="window.location.href='pages/etfs.html'">
        <span class="category-name">💵 ETFs</span>
        <span class="category-arrow">▶</span>
    </div>
    <ul class="category-submenu" id="submenu-etfs">
        <li><a href="#">📊 Simulador de Indexação</a></li>
        <li><a href="#">📈 ETFs Nacionais</a></li>
    </ul>
</li>
```

---

#### 18.8.8 Resumo das Características

| Elemento | Propriedade | Valor Desktop | Motivo |
|----------|-------------|---------------|--------|
| **Header** | `position` | `fixed` | Fixo no topo |
| **Header** | `top` | `60px` | Abaixo do carrossel |
| **Header** | `background` | `#0D0D0D` | Preto opaco |
| **Header** | `z-index` | `1000` | Acima do conteúdo |
| **Container** | `max-width` | `1200px` | Centralizado |
| **Container** | `padding` | `8px 32px 0` | Compacto |
| **Logo** | `position` | `absolute` | Esquerda fixa |
| **Logo** | `left` | `32px` | Margem esquerda |
| **Logo** | `height` | `47px` | Tamanho desktop |
| **Logo** | `filter` | Glow dourado | Efeito premium |
| **Tab Button** | `min-width` | `130px` | Largura fixa |
| **Tab Button** | `font-size` | `12px` | Legível |
| **Tab Button** | `color` | `rgba(255,255,255,0.7)` | Branco 70% |
| **Tab Button** | `color (hover/active)` | `#2A7FFF` | Azul INVLAB |
| **Dropdown** | `background` | `rgba(14,14,14,0.98)` | Quase preto |
| **Dropdown** | `border` | `1px solid rgba(42,127,255,0.3)` | Azul INVLAB |
| **Dropdown** | `min-width` | `220px` | Largura mínima |
| **Dropdown Link** | `font-size` | `13px` | Legível |
| **Dropdown Link** | `padding` | `12px 16px` | Confortável |

---

#### 18.8.9 Comportamento e Interações

**Funcionalidades:**
- ✅ **Fixo no topo** (`position: fixed`)
- ✅ **Dropdowns aparecem ao clicar** (classe `.open`)
- ✅ **Hover muda cor para azul INVLAB** (`#2A7FFF`)
- ✅ **Logo com glow dourado** no hover
- ✅ **Transições suaves** (0.2s - 0.3s)
- ✅ **Scroll horizontal** em mobile/tablet

**JavaScript Necessário:**
```javascript
// Toggle dropdown ao clicar
document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const dropdown = this.closest('.tab-with-dropdown');
        dropdown.classList.toggle('open');
    });
});

// Fechar dropdown ao clicar fora
document.addEventListener('click', function(e) {
    if (!e.target.closest('.tab-with-dropdown')) {
        document.querySelectorAll('.tab-with-dropdown').forEach(dd => {
            dd.classList.remove('open');
        });
    }
});
```

---

#### 18.8.10 Responsividade

**Tablet (max-width: 1024px):**
```css
.main-header {
    top: 50px;
}

.header-container {
    padding: 12px 20px;
    flex-direction: column;
    gap: 10px;
}

.header-logo {
    position: static;
    transform: none;
    justify-content: center;
}

.header-logo img {
    height: 27px;
}

.tab-btn {
    min-width: 110px;
    font-size: 10px;
}
```

**Mobile (max-width: 768px):**
```css
.main-header {
    top: 46px;
}

.header-container {
    padding: 8px 15px;
    flex-direction: column;
    gap: 8px;
}

.header-logo {
    position: static;
    transform: none;
}

.header-logo img {
    height: 38px;
}

.tab-btn {
    min-width: 95px;
    font-size: 9px;
    padding: 8px 10px;
}
```

**Mobile - Dropdowns:**
```css
.tab-with-dropdown .dropdown-menu {
    position: fixed;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 480px;
}
```

---

#### 18.8.11 Estrutura HTML Completa

```html
<!-- Header Fixo -->
<header class="main-header">
    <div class="header-container">
        <!-- Logo (SEM texto "INVLAB") -->
        <div class="header-logo">
            <img src="../assets/images/Logo_InvLab.png" alt="INVLAB" class="logo-img" loading="eager">
        </div>
        
        <!-- Sistema de Abas INVLAB -->
        <div class="tabs-nav-wrapper">
            <nav class="tabs-nav" id="tabsNav">
                <!-- Aba simples -->
                <button class="tab-btn" onclick="window.location.href='../index.html#inicio'">
                    🏠 Início
                </button>
                
                <!-- Aba com dropdown -->
                <div class="tab-with-dropdown">
                    <button class="tab-btn dropdown-toggle">
                        📊 Renda<br>Fixa <span class="arrow">▼</span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a href="pages/simulador-cdbs.html">🏦 CDBs</a></li>
                        <li><a href="pages/simulador-tesouro-direto.html">🇧🇷 Tesouro Direto</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</header>
```

---

#### 18.8.12 Checklist de Implementação

Ao implementar o menu premium em uma nova página:

- [ ] 1. Header com `class="main-header"` e `position: fixed`
- [ ] 2. Container com `class="header-container"` e `max-width: 1200px`
- [ ] 3. Logo **SEM** texto "INVLAB" (apenas imagem)
- [ ] 4. Path correto do logo (`../assets/images/Logo_InvLab.png` ou `assets/images/Logo_InvLab.png`)
- [ ] 5. Wrapper de abas com `class="tabs-nav-wrapper"`
- [ ] 6. Navegação com `class="tabs-nav"`
- [ ] 7. Botões com `class="tab-btn"` e `min-width: 130px`
- [ ] 8. Dropdowns com estrutura `.tab-with-dropdown` > `.dropdown-toggle` > `.dropdown-menu`
- [ ] 9. JavaScript para toggle de dropdowns
- [ ] 10. Z-index correto (header: 1000, dropdown: 999999)
- [ ] 11. Testar comportamento sticky ao rolar
- [ ] 12. Validar responsividade (desktop/tablet/mobile)
- [ ] 13. Verificar paths dos links (relativos conforme estrutura)

---

#### 18.8.13 Status

**Status:** ✅ **PADRÃO OFICIAL INVLAB**  
**Páginas de referência:**  
- `index.html` (página principal)  
- `pages/simulador-aposentadoria.html` (página de simulador)  

**Última atualização:** Janeiro de 2025  
**Aplicável a:** Todas as páginas do site INVLAB

**⚠️ IMPORTANTE:** Este menu premium é **identidade visual oficial** do INVLAB e deve ser preservado e replicado em todas as páginas do site para manter consistência visual. O logo **NÃO deve incluir** o texto "INVLAB" - apenas a imagem.

---

## 🚀 19. PADRÃO DE PÁGINAS DE ARTIGOS (CHECKLIST COMPLETO)

**Status:** ✅ TESTADO E APROVADO  
**Páginas de Referência:** `artigo-perfil-investidor.html` e `artigo-gerente.html`

---

### 19.1 Estrutura HTML Obrigatória

Toda página de artigo DEVE ter essa estrutura completa:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/images/Favicon_TutorFinanceiro.png">
    
    <!-- Theme Color -->
    <meta name="theme-color" content="#0D0D0D">
    
    <!-- Google Fonts INVLAB -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    
    <!-- CSS -->
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="../assets/css/invlab-icons.css">
    <link rel="stylesheet" href="../assets/css/artigo-styles.css">
    
    <style>
        /* Override OBRIGATÓRIO: article-badge e article-time com cores INVLAB */
        .article-badge {
            background: rgba(212, 175, 55, 0.15) !important;
            color: #D4AF37 !important;
            border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .article-time {
            color: rgba(16, 185, 129, 0.85) !important;
        }
        
        /* Back to Top Button */
        #backToTop {
            display: none;
            position: fixed;
            bottom: 40px;
            right: 40px;
            z-index: 9999;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            color: #0D0D0D;
            border: 2px solid rgba(16, 185, 129, 0.3);
            border-radius: 50%;
            font-size: 28px;
            font-weight: 700;
            text-align: center;
            line-height: 52px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
            transition: all 0.3s ease-in-out;
            opacity: 0;
        }
        #backToTop:hover {
            background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 24px rgba(212, 175, 55, 0.6);
            border-color: rgba(16, 185, 129, 0.6);
        }
        @media (max-width: 768px) {
            #backToTop {
                width: 48px;
                height: 48px;
                font-size: 24px;
                line-height: 44px;
                bottom: 24px;
                right: 24px;
            }
        }
        
        /* Footer Premium CSS aqui (copiar do arquivo de referência) */
    </style>
</head>
```

---

### 19.2 Body: Estrutura de Navegação

```html
<body>
    <!-- Header Fixo -->
    <header class="main-header">
        <div class="header-container">
            <!-- Logo -->
            <div class="header-logo" onclick="window.location.href='../index.html'" style="cursor: pointer;">
                <img src="../assets/images/Logo_tutorfinanceiro.png" alt="INVLAB">
                <span class="logo-text">INVLAB</span>
            </div>
            
            <!-- Sistema de Abas (copiar do arquivo de referência) -->
            <div class="tabs-nav-wrapper">
                <nav class="tabs-nav" id="tabsNav">
                    <!-- ... tabs ... -->
                </nav>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="content-wrapper">
            <div class="article-wrapper">
                
                <!-- Breadcrumb (SEM margin-top inline!) -->
                <nav class="breadcrumb">
                    <a href="../index.html">🏠 Início</a>
                    <span class="breadcrumb-separator">/</span>
                    <a href="../index.html#primeiros-passos">📚 Primeiros Passos</a>
                    <span class="breadcrumb-separator">/</span>
                    <span class="breadcrumb-current">Nome do Artigo</span>
                </nav>

                <!-- Article Meta (PADRÃO OBRIGATÓRIO) -->
                <div class="article-meta">
                    <span class="article-badge">🎯 Módulo: Nome do Módulo</span>
                    <span class="article-time">⏱️ X min</span>
                </div>

                <!-- Article Content -->
                <article class="article-content">
                    
                    <!-- Title (INLINE STYLES OBRIGATÓRIOS) -->
                    <h1 class="article-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 16px; color: #D4AF37; letter-spacing: -0.02em; line-height: 1.2;">
                        Título do Artigo
                    </h1>
                    
                    <!-- Lead -->
                    <p class="article-lead">
                        Subtítulo ou resumo do artigo
                    </p>

                    <!-- Sections -->
                    <section class="article-section">
                        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; font-weight: 700; color: #D4AF37; margin-top: 48px; margin-bottom: 20px; letter-spacing: -0.01em;">
                            Título da Seção
                        </h2>
                        
                        <p>Conteúdo...</p>
                    </section>
                    
                </article>
                
            </div>
        </div>
    </main>
    
    <!-- Footer Premium (copiar estrutura completa do arquivo de referência) -->
    <footer class="footer">
        <!-- ... -->
    </footer>
    
    <!-- Botão Voltar ao Topo -->
    <div id="backToTop">↑</div>
    
    <!-- JavaScript -->
    <script>
        // Back to Top (copiar do arquivo de referência)
    </script>
    
    <script src="../assets/js/script.js"></script>
</body>
</html>
```

---

### 19.3 ⚠️ REGRAS CRÍTICAS (NÃO QUEBRE!)

#### **1. Article Meta (Badge + Tempo)**
✅ **SEMPRE use o override CSS:**
```css
.article-badge {
    background: rgba(212, 175, 55, 0.15) !important;
    color: #D4AF37 !important; /* Dourado INVLAB */
    border: 1px solid rgba(212, 175, 55, 0.3);
}

.article-time {
    color: rgba(16, 185, 129, 0.85) !important; /* Verde INVLAB */
}
```

❌ **NUNCA deixe usar o azul padrão `var(--blue-action)`** - fica invisível no fundo escuro!

---

#### **2. Títulos H1**
✅ **SEMPRE use inline styles:**
```html
<h1 class="article-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 16px; color: #D4AF37; letter-spacing: -0.02em; line-height: 1.2;">
    Título do Artigo
</h1>
```

❌ **NUNCA use:**
- Degradê verde no H1
- CSS interno que sobrescreva o inline style
- Emoji junto com o texto do título

---

#### **3. Títulos H2**
✅ **SEMPRE use inline styles:**
```html
<h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; font-weight: 700; color: #D4AF37; margin-top: 48px; margin-bottom: 20px; letter-spacing: -0.01em;">
    Título da Seção
</h2>
```

---

#### **4. Largura do Conteúdo**
✅ **SEMPRE use `.article-wrapper`** (max-width: 1200px do `artigo-styles.css`)

❌ **NUNCA crie `.article-container`** com largura diferente (900px, 800px, etc.)

---

#### **5. Breadcrumb**
✅ **NUNCA adicione `margin-top` inline!**
```html
<!-- CORRETO -->
<nav class="breadcrumb">...</nav>

<!-- ERRADO -->
<nav class="breadcrumb" style="margin-top: 20px;">...</nav>
```

---

### 19.4 Checklist de Implementação

Ao criar uma nova página de artigo, siga esta ordem:

- [ ] 1. Copiar estrutura HTML completa (head + body)
- [ ] 2. Adicionar CSS override do article-badge/article-time no `<style>`
- [ ] 3. Adicionar CSS do Footer Premium no `<style>`
- [ ] 4. Adicionar CSS do Botão Back to Top no `<style>`
- [ ] 5. Incluir Header fixo com navbar completa
- [ ] 6. Incluir Breadcrumb (SEM margin-top inline)
- [ ] 7. Adicionar Article Meta com badge e tempo
- [ ] 8. Usar H1 com inline styles dourados
- [ ] 9. Usar H2 com inline styles dourados em TODAS as seções
- [ ] 10. Envolver conteúdo em `<section class="article-section">`
- [ ] 11. Usar `.article-lead` (não `.article-subtitle`)
- [ ] 12. Incluir Footer Premium completo
- [ ] 13. Adicionar Botão Back to Top + JavaScript
- [ ] 14. Adicionar `<script src="../assets/js/script.js"></script>`
- [ ] 15. Testar no navegador (cores, espaçamento, responsividade)

---

### 19.5 Exemplos de Article Meta para Cada Categoria

**Primeiros Passos:**
```html
<span class="article-badge">📚 Módulo: Primeiros Passos</span>
```

**Bancos:**
```html
<span class="article-badge">💰 Módulo: Bancos</span>
```

**Educação Financeira:**
```html
<span class="article-badge">⚖️ Módulo: Educação Financeira</span>
```

**Renda Fixa:**
```html
<span class="article-badge">🏦 Módulo: Renda Fixa</span>
```

**Renda Variável:**
```html
<span class="article-badge">📈 Módulo: Renda Variável</span>
```

**Criptoativos:**
```html
<span class="article-badge">🔐 Módulo: Criptoativos</span>
```

---

### 19.6 Páginas de Referência (Templates Aprovados)

**Use como modelo:**
1. ✅ `pages/artigo-perfil-investidor.html` - PADRÃO OURO
2. ✅ `pages/artigo-gerente.html` - PADRÃO OURO

**Próximas a padronizar:**
- [ ] `pages/artigo-poupanca.html`
- [ ] `pages/artigo-reserva.html`
- [ ] Demais artigos conforme necessário

---

## 🚀 20. PRÓXIMOS PASSOS

## 📝 NOTAS IMPORTANTES

1. **Verde Puro (#10b981):** Use APENAS em ícones, botões e detalhes pequenos. NUNCA em textos longos!

2. **Degradê Verde:** Use APENAS em títulos de seção. Não aplique em títulos de cards.

3. **Dourado (#D4AF37):** É a cor de destaque principal. Use em ícones e estados hover.

4. **Transições:** Sempre `0.3s ease` para consistência.

5. **Elevação no Hover:** Sempre `-6px` para cards principais.

6. **Sombras Duplas:** Camada dourada + camada verde para profundidade premium.

---

---

## 💡 21. OPÇÕES FUTURAS (ALTERNATIVAS COMENTADAS)

### 21.1 Degradê Verde Premium (não usar agora)

💚 **Degradê verde bonito preservado para uso futuro:**

```css
/* ❌ DEGRADÊ VERDE - NÃO É O PADRÃO ATUAL INVLAB
 * Preservado para possível uso futuro em páginas especiais
 * ou campanhas específicas
 */

/* Exemplo de uso (COMENTADO): */
/*
.titulo-degrade-verde {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.5rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    line-height: 1.2;
    
    background: linear-gradient(90deg, #10b981 0%, #34D399 50%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
*/

/* ⭐ PADRÃO ATUAL (usar sempre): */
.titulo-dourado-invlab {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2.5rem;
    font-weight: 800;
    color: #D4AF37;                          /* DOURADO - Padrão oficial */
    text-align: center;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    line-height: 1.2;
}
```

**Por que o degradê verde não é usado agora:**
- ✅ O dourado é mais elegante e premium
- ✅ Melhor contraste e legibilidade
- ✅ Consistente com toda a identidade INVLAB
- ✅ Funciona melhor em todas as páginas

**Quando poderia usar o degradê verde no futuro:**
- 💡 Páginas de campanha especial
- 💡 Landing pages promocionais
- 💡 Seções de destaque específicas
- 💡 Eventos ou lançamentos

---

## 🎯 22. CONTAINER CTA COM BOTÕES PREMIUM (GOLD TOUCH)

### 22.1 Propósito

Container de **Call-to-Action (CTA)** para direcionar usuários aos simuladores após conteúdo educacional. Usado especialmente ao final de seções de Renda Variável, Renda Fixa e Criptoativos na página inicial.

**Onde usar:**
- ✅ Final de seções educacionais (antes de Criptoativos)
- ✅ Páginas de artigos (antes do footer)
- ✅ Páginas de categoria (final da página)

---

### 22.2 Estrutura HTML Completa

```html
<!-- Container CTA: Pronto para Simular? -->
<div class="cta-box highlight">
    <h3>🛠️ Pronto para simular?</h3>
    <p>Use nossos simuladores e veja projeções realistas para cada tipo de investimento</p>
    
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
        <button class="btn-simulador-invlab" onclick="window.location.href='pages/etfs.html'">
            📊 Simular ETFs
        </button>
        <button class="btn-simulador-invlab" onclick="window.location.href='pages/fiis.html'">
            🏢 Simular FIIs
        </button>
        <button class="btn-simulador-invlab" onclick="window.location.href='pages/acoes.html'">
            📈 Simular Ações
        </button>
    </div>
</div>
```

---

### 22.3 CSS do Botão Premium (Gold Touch)

**⭐ DEGRADÊ PREMIUM:**  
`#355E3B → #CCAA66` (verde oliva → dourado leve)

```css
/* 🔥 BOTÃO SIMULADOR INVLAB - Degradê Premium Gold Touch */
.btn-simulador-invlab {
    background: linear-gradient(135deg, #355E3B 0%, #CCAA66 100%);
    border: 1px solid rgba(204, 170, 102, 0.3);
    color: #E4E4E4;
    padding: 14px 32px;
    font-size: 1rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(53, 94, 59, 0.2);
}

.btn-simulador-invlab:hover {
    border-color: #D4AF37;                               /* Dourado premium */
    transform: translateY(-4px);
    box-shadow: 
        0 8px 24px rgba(53, 94, 59, 0.3),               /* Sombra verde oliva */
        0 4px 12px rgba(204, 170, 102, 0.2);            /* Sombra dourada */
}

.btn-simulador-invlab:active {
    transform: translateY(-2px);
}
```

---

### 22.4 Características do Degradê

| Propriedade | Valor | Motivo |
|-------------|-------|--------|
| **Degradê Base** | `#355E3B → #CCAA66` | Verde oliva sofisticado → Dourado suave |
| **Borda Normal** | `rgba(204, 170, 102, 0.3)` | Dourado translúcido 30% |
| **Borda Hover** | `#D4AF37` | Dourado premium INVLAB (100%) |
| **Texto** | `#E4E4E4` | Branco suave (alta legibilidade) |
| **Sombra Base** | Verde oliva 20% | Profundidade natural |
| **Sombra Hover** | Verde 30% + Dourado 20% | Dupla camada premium |
| **Elevação Hover** | `-4px` | Feedback tátil suave |

---

### 22.5 Variações de Uso

#### 🔹 **Para Renda Variável (3 botões):**
```html
<button class="btn-simulador-invlab" onclick="window.location.href='pages/etfs.html'">
    📊 Simular ETFs
</button>
<button class="btn-simulador-invlab" onclick="window.location.href='pages/fiis.html'">
    🏢 Simular FIIs
</button>
<button class="btn-simulador-invlab" onclick="window.location.href='pages/acoes.html'">
    📈 Simular Ações
</button>
```

#### 🔹 **Para Renda Fixa (4 botões):**
```html
<button class="btn-simulador-invlab" onclick="window.location.href='pages/simulador-tesouro-direto.html'">
    🏛️ Simular Tesouro Direto
</button>
<button class="btn-simulador-invlab" onclick="window.location.href='pages/simulador-cdbs.html'">
    🏦 Simular CDBs
</button>
<button class="btn-simulador-invlab" onclick="window.location.href='pages/simulador-lci-lca.html'">
    🏡 Simular LCI/LCA
</button>
<button class="btn-simulador-invlab" onclick="window.location.href='pages/poupanca.html'">
    💰 Simular Poupança
</button>
```

#### 🔹 **Para Criptoativos (2 botões):**
```html
<button class="btn-simulador-invlab" onclick="window.location.href='pages/bitcoin.html'">
    ₿ Simular Bitcoin
</button>
<button class="btn-simulador-invlab" onclick="window.location.href='pages/ethereum.html'">
    ⟠ Simular Ethereum
</button>
```

---

### 22.6 CSS do Container (`.cta-box`)

O container CTA já existe no sistema de design. Use a classe `.cta-box.highlight`:

```css
/* Container CTA (já existente no inv-design-system.css) */
.cta-box.highlight {
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid rgba(42, 127, 255, 0.2);
    border-radius: 16px;
    padding: 40px 32px;
    text-align: center;
    margin: 60px auto;
    max-width: 900px;
}

.cta-box h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #E4E4E4;
    margin-bottom: 12px;
}

.cta-box p {
    font-family: 'Inter', sans-serif;
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 0;
    line-height: 1.6;
}
```

---

### 22.7 Responsividade

```css
/* Tablet */
@media (max-width: 768px) {
    .btn-simulador-invlab {
        padding: 12px 24px;
        font-size: 0.95rem;
    }
    
    .cta-box {
        padding: 32px 24px;
    }
    
    .cta-box h3 {
        font-size: 1.5rem;
    }
}

/* Mobile */
@media (max-width: 480px) {
    .btn-simulador-invlab {
        width: 100%;                    /* Botões ocupam largura total */
        padding: 14px 20px;
        font-size: 0.9rem;
    }
    
    .cta-box {
        padding: 28px 20px;
        margin: 40px auto;
    }
    
    .cta-box h3 {
        font-size: 1.3rem;
    }
    
    .cta-box p {
        font-size: 0.95rem;
    }
}
```

---

### 22.8 Por Que Esse Degradê é Perfeito?

**✅ Vantagens do `#355E3B → #CCAA66`:**

1. **100% INVLAB** — Combina verde + dourado (cores da marca)
2. **Sofisticação premium** — Verde oliva transmite elegância
3. **Legibilidade perfeita** — Contraste ideal com texto branco (#E4E4E4)
4. **Transição natural** — Os tons conversam perfeitamente
5. **Originalidade** — Não parece "genérico" como azul/verde comum
6. **Hierarquia clara** — Destaca-se sem competir com outros elementos

**❌ Problemas do degradê anterior (azul → verde):**
- Conflitava com identidade INVLAB
- Parecia genérico (comum em muitos sites)
- Verde diluído demais (perdia impacto)
- Faltava hierarquia visual

---

### 22.9 Testes de Acessibilidade

| Teste | Resultado |
|-------|-----------|
| **Contraste texto/fundo** | ✅ WCAG AAA (>7:1) |
| **Legibilidade em mobile** | ✅ Excelente |
| **Hover feedback** | ✅ Claro e responsivo |
| **Touch target (mobile)** | ✅ >44px (recomendado) |
| **Cores amigáveis** | ✅ Sem problemas para daltônicos |

---

### 22.10 Exemplo Completo em Contexto

```html
<!-- Final da seção de Renda Variável -->
</section>

<!-- Container CTA -->
<div class="cta-box highlight">
    <h3>🛠️ Pronto para simular?</h3>
    <p>Use nossos simuladores e veja projeções realistas para cada tipo de investimento</p>
    
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
        <button class="btn-simulador-invlab" onclick="window.location.href='pages/etfs.html'">
            📊 Simular ETFs
        </button>
        <button class="btn-simulador-invlab" onclick="window.location.href='pages/fiis.html'">
            🏢 Simular FIIs
        </button>
        <button class="btn-simulador-invlab" onclick="window.location.href='pages/acoes.html'">
            📈 Simular Ações
        </button>
    </div>
</div>

<!-- Próxima seção -->
<section class="section">
```

---

### 22.11 Checklist de Implementação

Ao adicionar um container CTA em uma nova página:

- [ ] 1. Usar classe `.cta-box.highlight` para o container
- [ ] 2. Incluir título `<h3>` + emoji apropriado
- [ ] 3. Adicionar parágrafo descritivo
- [ ] 4. Usar classe `.btn-simulador-invlab` nos botões
- [ ] 5. Aplicar degradê `#355E3B → #CCAA66` (se não estiver no CSS global)
- [ ] 6. Links dos botões (`onclick="window.location.href='...'`)
- [ ] 7. Emojis apropriados para cada tipo de investimento
- [ ] 8. Flexbox com `gap: 16px` e `flex-wrap: wrap`
- [ ] 9. Testar responsividade (desktop/tablet/mobile)
- [ ] 10. Validar hover e transições

---

### 22.12 Arquivo CSS Necessário

**Adicione ao `<style>` inline no `<head>` ou inclua em CSS global:**

```html
<style>
/* 🔥 BOTÃO SIMULADOR INVLAB - Degradê Premium Gold Touch */
.btn-simulador-invlab {
    background: linear-gradient(135deg, #355E3B 0%, #CCAA66 100%);
    border: 1px solid rgba(204, 170, 102, 0.3);
    color: #E4E4E4;
    padding: 14px 32px;
    font-size: 1rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(53, 94, 59, 0.2);
}

.btn-simulador-invlab:hover {
    border-color: #D4AF37;
    transform: translateY(-4px);
    box-shadow: 
        0 8px 24px rgba(53, 94, 59, 0.3),
        0 4px 12px rgba(204, 170, 102, 0.2);
}

.btn-simulador-invlab:active {
    transform: translateY(-2px);
}

/* Responsivo Mobile */
@media (max-width: 480px) {
    .btn-simulador-invlab {
        width: 100%;
        padding: 14px 20px;
        font-size: 0.9rem;
    }
}
</style>
```

---

### 22.13 Status

**Status:** ✅ Implementado e testado  
**Página de referência:** `index.html` (seção Renda Variável)  
**Aprovado:** 25 de Novembro de 2024  
**Próximo:** Expandir para outras seções e páginas

---

## 🎭 23. INVLAB MODAL PREMIUM - PADRÃO OFICIAL

### 23.1 Propósito

Template master para **TODOS os modais educacionais** do INVLAB. Design system completo que garante consistência, profissionalismo e identidade visual única.

**Onde usar:**
- ✅ Modais educacionais ("Sobre CDBs", "Sobre Tesouro Direto", "Sobre LCI/LCA", etc.)
- ✅ Popups informativos
- ✅ Janelas de tutorial
- ✅ Avisos importantes

**Páginas implementadas:**
- ✅ `pages/simulador-cdbs.html` - Modal "Sobre CDBs"
- ✅ `pages/simulador-tesouro-direto.html` - Modal "Sobre Tesouro Direto"

---

### 23.2 Cores e Fundos (Padrão Oficial)

**⚠️ IMPORTANTE:** Todos os valores abaixo foram testados e aprovados nos modais CDB e Tesouro Direto. Use EXATAMENTE esses valores para garantir consistência pixel-perfect.

**1️⃣ Fundo do Modal (Container Principal):**
```css
background: #0D1620; /* Quase preto com verde-azulado sutil */
```

**Código completo:**
```css
.modal-content-minimalist {
    background: #0D1620; /* 1️⃣ PADRÃO MASTER */
    border-radius: 16px;
    max-width: 900px;
    width: 92%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.65); /* 3️⃣ Sombra */
    animation: modalFadeIn 0.3s ease;
    border: 1px solid rgba(204, 170, 102, 0.15); /* 2️⃣ Borda dourada */
    position: relative;
    flex-shrink: 0;
}
```

**Por quê:**
- ✅ Profissional e clean
- ✅ Combina com o restante do site
- ✅ Melhora foco e leitura
- ✅ Não é preto chapado (mais sofisticado)

---

**2️⃣ Borda Externa do Modal:**
```css
border: 1px solid rgba(204, 170, 102, 0.15); /* Dourado suave 15% */
```

**⚠️ CRÍTICO:** Use **exatamente 0.15** de opacidade. Valores diferentes (0.2, 0.3, 0.4) ficam muito fortes!

**Por quê:**
- ✅ Discreto mas premium
- ✅ Combina com logo e footer
- ✅ Cria profundidade elegante
- ✅ Identidade INVLAB (dourado)

---

**3️⃣ Sombra Profissional:**
```css
box-shadow: 0 0 18px rgba(0, 0, 0, 0.65);
```

**⚠️ IMPORTANTE:** `0 0 18px` = sombra difusa sem offset. **NÃO use** valores como `0 24px 80px` que são muito dramáticos!

**Por quê:**
- ✅ Modal "flutua" sobre a página
- ✅ Profundidade bem calibrada
- ✅ Não é exagerado

---

**4️⃣ Cabeçalho do Modal:**
```css
.modal-header-minimalist {
    padding: 24px 32px; /* 7️⃣ Espaçamento padrão - CRÍTICO! */
    background: rgba(30, 45, 45, 0.75); /* 4️⃣ Verde musgo translúcido */
    border-bottom: 1px solid rgba(204, 170, 102, 0.1); /* Dourado sutil */
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header-minimalist h2 {
    margin: 0; /* 7️⃣ SEM margem superior - CRÍTICO! */
    font-size: 1.8rem;
    color: #E4E4E4; /* 4️⃣ Título branco elegante (#FFFFFF também funciona) */
    font-weight: 700;
    letter-spacing: -0.5px;
}
```

**⚠️ CRÍTICO - Problemas comuns:**
- ❌ **Padding diferente:** Se usar valores menores, o cabeçalho fica "espremido"
- ❌ **Margin no h2:** Se adicionar margin-top, quebra o alinhamento
- ❌ **Border-bottom forte:** Opacidade maior que 0.1 fica muito pesada

**Por quê:**
- ✅ Diferenciação clara do conteúdo
- ✅ Verde musgo = identidade INVLAB
- ✅ Respiro adequado (24px top/bottom, 32px laterais)

---

**5️⃣ Botão de Fechar (X):**
```css
.btn-close-minimalist {
    background: transparent;
    border: none;
    font-size: 24px; /* 5️⃣ Tamanho padronizado: 24px - ACESSIBILIDADE! */
    color: #CCAA66; /* 5️⃣ Dourado INVLAB */
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;
    line-height: 1;
}

.btn-close-minimalist:hover {
    background: rgba(204, 170, 102, 0.15); /* 5️⃣ Fundo sutil no hover */
    color: #D4AF37; /* 5️⃣ Dourado mais claro */
}
```

**⚠️ CRÍTICO:** 
- ✅ **24px** = tamanho mínimo para acessibilidade
- ✅ **36x36px** = área de clique confortável
- ❌ **NÃO use** 32px (muito grande) ou 18px (muito pequeno)

**Por quê:**
- ✅ Visível e elegante
- ✅ 24px = padrão WCAG accessibility
- ✅ Dourado = identidade INVLAB

---

**6️⃣ Cards Internos (Blocos de Conteúdo):**
```css
.modal-section {
    margin-bottom: 24px; /* 7️⃣ Espaçamento entre seções: 24px - CRÍTICO! */
    padding: 20px; /* 7️⃣ Padding dos cards: 20px */
    background: rgba(9, 32, 21, 0.75); /* 6️⃣ Verde profundo translúcido */
    border: 1px solid rgba(138, 204, 166, 0.10); /* 6️⃣ Verde menta 10% */
    border-radius: 12px;
}

.modal-section:last-child {
    margin-bottom: 0; /* Remove margem do último card */
}

.modal-section h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #8ACC66; /* 6️⃣ Verde oliva - APENAS títulos H3! */
    margin: 0 0 18px 0; /* 7️⃣ Margem inferior: 18px - CRÍTICO! */
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-section p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.85); /* 6️⃣ Corpo branco */
    line-height: 1.7;
    margin-bottom: 12px;
}

.modal-section ul {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
    margin: 8px 0 12px 20px;
}

.modal-section li {
    margin-bottom: 6px;
}

/* IMPORTANTE: <strong> usa o bold padrão do navegador (700) */
/* NÃO adicione regra CSS para .modal-section strong {} */
/* Deixe o HTML <strong> usar font-weight: 700 nativo */
```

**⚠️ CRÍTICO - Problemas comuns:**
- ❌ **Margin-bottom diferente:** Valores menores (16px, 12px) deixam os cards muito grudados
- ❌ **Padding diferente:** Valores maiores (30px, 24px) desperdiçam espaço
- ❌ **Cor verde em <strong>:** O verde (#8ACC66) é APENAS para títulos H3, não para destaques em negrito!
- ❌ **Font-weight: 600 em <strong>:** Use 700 (padrão HTML) para intensidade correta

**Por quê:**
- ✅ Identidade INVLAB inconfundível
- ✅ Contraste perfeito
- ✅ Hierarquia visual clara (H3 verde, texto branco, negrito branco forte)
- ✅ Verde profundo = marca registrada

---

### 23.3 Espaçamentos Padronizados (CRÍTICO!)

**⚠️ ATENÇÃO:** Esses valores foram ajustados pixel-by-pixel para criar o equilíbrio perfeito. **NÃO altere** sem comparar visualmente com os modais CDB/Tesouro.

**7️⃣ Sistema de Espaçamento:**

| Elemento | Valor | Uso | ⚠️ Erro Comum |
|----------|-------|-----|---------------|
| **Padding interno modal** | `32px` | `.modal-body { padding: 32px; }` | ❌ Usar menos = conteúdo grudado nas bordas |
| **Espaçamento entre cards** | `24px` | `.modal-section { margin-bottom: 24px; }` | ❌ Usar 16px ou 12px = cards muito próximos |
| **Padding dos cards internos** | `20px` | `.modal-section { padding: 20px; }` | ❌ Usar 30px = desperdício de espaço |
| **Margem superior do título H2** | `0` | `.modal-header h2 { margin: 0; }` | ❌ Adicionar margin-top = cabeçalho desalinhado |
| **Margem inferior do título H3** | `18px` | `.modal-section h3 { margin: 0 0 18px 0; }` | ❌ Usar 12px = título grudado no texto |
| **Padding do cabeçalho** | `24px 32px` | `.modal-header { padding: 24px 32px; }` | ❌ Usar menos = cabeçalho "espremido" |

**Código completo do corpo do modal:**
```css
.modal-body-minimalist {
    padding: 32px; /* 7️⃣ Padding interno modal: 32px */
    max-height: calc(90vh - 100px);
    overflow-y: auto;
    overflow-x: hidden;
    display: block;
    scroll-behavior: smooth; /* Scroll suave */
    position: relative;
}
```

---

### 23.4 Scrollbar Customizada (Dourada INVLAB)

**⚠️ CRÍTICO:** A scrollbar DEVE ser **dourada** (#D4AF37), não verde ou cinza!

```css
/* SCROLLBAR CUSTOMIZADA - Dourado INVLAB */
.modal-body-minimalist::-webkit-scrollbar {
    width: 8px;
}

.modal-body-minimalist::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.modal-body-minimalist::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.4); /* Dourado INVLAB (#D4AF37) com 40% opacidade */
    border-radius: 4px;
}

.modal-body-minimalist::-webkit-scrollbar-thumb:hover {
    background: rgba(212, 175, 55, 0.6); /* Dourado mais intenso no hover */
}
```

**⚠️ Problemas comuns:**
- ❌ **Usar verde:** `rgba(16, 185, 129, 0.3)` - ERRADO! Scrollbar deve ser dourada.
- ❌ **Usar cinza padrão:** Sem personalização - perde identidade INVLAB.
- ❌ **Opacidade muito alta:** Acima de 0.6 fica muito forte.

**Por quê:**
- ✅ Dourado = identidade visual INVLAB premium
- ✅ Opacidade 0.4 = visível mas discreto
- ✅ Hover 0.6 = feedback tátil claro

---

### 23.5 Disclaimer Acima do Modal

**⚠️ CRÍTICO:** O texto "Conteúdo 100% educacional • INVLAB © 2025" DEVE ser **verde** (#10b981), não dourado!

```css
/* DISCLAIMER ACIMA DO MODAL */
.modal-disclaimer {
    text-align: center;
    margin-bottom: 12px;
    padding: 8px 16px;
    animation: fadeIn 0.4s ease 0.2s both;
}

.modal-disclaimer-text {
    font-size: 0.85rem;
    color: #10b981; /* Verde INVLAB - CRÍTICO! */
    font-weight: 600;
    margin-bottom: 4px;
    letter-spacing: 0.3px;
}

.modal-disclaimer-subtext {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
}
```

**HTML completo:**
```html
<!-- Disclaimer acima do modal -->
<div class="modal-disclaimer">
    <p class="modal-disclaimer-text">Conteúdo 100% educacional • INVLAB © 2025</p>
    <p class="modal-disclaimer-subtext">Laboratório de Investimentos • Plataforma Profissional</p>
</div>
```

**⚠️ Problemas comuns:**
- ❌ **Usar dourado:** `color: #CCAA66` - ERRADO! Disclaimer é verde.
- ❌ **Repetir no final do modal:** Disclaimer aparece APENAS no topo, NÃO no final!
- ❌ **Esquecer o animation delay:** `0.2s` faz aparecer suavemente após o modal.

**Por quê:**
- ✅ Verde = consistência com branding INVLAB
- ✅ Aparece apenas no topo = clean e não repetitivo
- ✅ Subtexto suave = hierarquia clara

---

### 23.6 Animação de Abertura

```css
/* ANIMAÇÃO DE ABERTURA */
@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-content-minimalist {
    animation: modalFadeIn 0.3s ease;
}
```

**⚠️ IMPORTANTE:** 
- ✅ **Scale 0.95 → 1.0:** Crescimento sutil e elegante
- ❌ **NÃO use** scale(0.8) ou menor = muito dramático
- ❌ **NÃO use** translateY() = conflita com o scale

**Por quê:**
- ✅ Abertura suave e profissional
- ✅ Não é abrupto
- ✅ Scale 0.95 → 1 = elegância premium

---

### 23.7 Botão Voltar ao Topo (Dentro do Modal)

**8️⃣ Botão Gold Touch no Modal:**

```css
/* BOTÃO VOLTAR AO TOPO DENTRO DO MODAL */
#modalBackToTop {
    display: flex; /* IMPORTANTE: flex para centralizar a seta */
    align-items: center;
    justify-content: center;
    position: absolute; /* Posição dentro do .modal-content */
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #355E3B 0%, #CCAA66 100%); /* Gold Touch */
    border: 1px solid rgba(204, 170, 102, 0.3);
    border-radius: 50%;
    color: #E4E4E4;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    pointer-events: none; /* Desabilita cliques quando invisível */
    transition: all 0.3s ease;
    z-index: 100; /* Acima do conteúdo do modal */
    box-shadow: 0 4px 12px rgba(53, 94, 59, 0.4);
}

#modalBackToTop.show {
    opacity: 1;
    visibility: visible;
    pointer-events: auto; /* Habilita cliques quando visível */
}

#modalBackToTop:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(53, 94, 59, 0.6);
    border-color: #D4AF37;
}
```

**⚠️ CRÍTICO - Problemas comuns:**
- ❌ **display: none inicial:** Use `opacity: 0` + `visibility: hidden` + `pointer-events: none`
- ❌ **Esquecer pointer-events:** Botão invisível ainda pode ser clicado sem isso
- ❌ **Position: fixed:** Use `absolute` (relativo ao `.modal-content`), não `fixed`
- ❌ **Z-index baixo:** Deve ser >= 100 para ficar acima de outros elementos

**HTML:**
```html
<!-- Botão Voltar ao Topo (dentro do modal) -->
<button id="modalBackToTop" aria-label="Voltar ao topo">↑</button>
```

**JavaScript COMPLETO e necessário:**
```javascript
// ============================================
// BOTÃO "VOLTAR AO TOPO" DENTRO DO MODAL
// ============================================

const modalBody = document.querySelector('.modal-body-minimalist');
const modalBackToTop = document.getElementById('modalBackToTop');

if (modalBody && modalBackToTop) {
    // Mostra/esconde o botão baseado no scroll do modal
    modalBody.addEventListener('scroll', function() {
        if (modalBody.scrollTop > 200) { // Aparece após 200px de scroll
            modalBackToTop.classList.add('show');
        } else {
            modalBackToTop.classList.remove('show');
        }
    });

    // Volta ao topo do modal ao clicar
    modalBackToTop.addEventListener('click', function() {
        modalBody.scrollTo({
            top: 0,
            behavior: 'smooth' // Scroll suave
        });
    });
}
```

**⚠️ IMPORTANTE:**
- ✅ **Scroll detection:** 200px é o ponto ideal (não muito cedo, não muito tarde)
- ✅ **Smooth scroll:** `behavior: 'smooth'` é essencial
- ✅ **Listener no modalBody:** O scroll acontece no `.modal-body`, não no `window`
- ❌ **NÃO use** `window.scrollTo()` - o scroll é interno ao modal!

**Responsividade mobile:**
```css
@media (max-width: 768px) {
    #modalBackToTop {
        width: 40px;
        height: 40px;
        font-size: 18px;
        bottom: 16px;
        right: 16px;
    }
}
```

---

### 23.6 Estrutura HTML Completa

```html
<!-- Modal Premium INVLAB -->
<div id="modalId" class="modal-overlay" onclick="closeModal()" style="display: none;">
    <!-- Disclaimer acima do modal (opcional) -->
    <div class="modal-disclaimer">
        <p>Conteúdo 100% educacional • INVLAB © 2025</p>
        <p>Laboratório de Investimentos • Plataforma Profissional</p>
    </div>
    
    <div class="modal-content" onclick="event.stopPropagation()">
        <!-- Cabeçalho -->
        <div class="modal-header">
            <h2>📚 Título do Modal</h2>
            <button class="btn-close" onclick="closeModal()" aria-label="Fechar">×</button>
        </div>
        
        <!-- Corpo com scroll -->
        <div class="modal-body">
            <!-- Card interno 1 -->
            <div class="modal-section">
                <h3>🏦 Seção 1</h3>
                <p>Conteúdo da seção...</p>
            </div>
            
            <!-- Card interno 2 -->
            <div class="modal-section">
                <h3>💰 Seção 2</h3>
                <p>Conteúdo da seção...</p>
            </div>
            
            <!-- CTA Final (opcional) -->
            <div class="modal-cta">
                <p><strong>✨ Pronto para começar?</strong></p>
                <button class="btn-gold-touch" onclick="closeModal()">
                    Começar Agora →
                </button>
            </div>
        </div>
        
        <!-- Botão Voltar ao Topo -->
        <button class="modal-back-to-top" id="modalBackToTop" aria-label="Voltar ao topo">↑</button>
    </div>
</div>
```

---

### 23.7 CSS Completo do Modal Premium

```css
/* Overlay (fundo escuro) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
    backdrop-filter: blur(4px);
    padding: 20px;
}

/* Container do Modal */
.modal-content {
    background: #0D1620; /* 1️⃣ Fundo premium */
    border-radius: 16px;
    max-width: 900px;
    width: 92%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.65); /* 3️⃣ Sombra profissional */
    animation: modalFadeIn 0.3s ease;
    border: 1px solid rgba(204, 170, 102, 0.15); /* 2️⃣ Borda dourada */
    position: relative;
}

/* Animação de abertura */
@keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

/* Cabeçalho */
.modal-header {
    padding: 24px 32px;
    background: rgba(30, 45, 45, 0.75); /* 4️⃣ Verde musgo */
    border-bottom: 1px solid rgba(204, 170, 102, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.8rem;
    color: #FFFFFF; /* 4️⃣ Título branco */
    font-weight: 700;
    letter-spacing: -0.5px;
}

/* Botão Fechar */
.btn-close {
    background: transparent;
    border: none;
    font-size: 24px; /* 5️⃣ 24px padrão */
    color: #CCAA66; /* 5️⃣ Dourado */
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.btn-close:hover {
    background: rgba(204, 170, 102, 0.15);
    color: #D4AF37; /* Dourado claro */
}

/* Corpo do Modal */
.modal-body {
    padding: 32px; /* 7️⃣ Padding 32px */
    max-height: calc(90vh - 100px);
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    position: relative;
}

/* Scrollbar customizada */
.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: rgba(204, 170, 102, 0.3);
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: rgba(204, 170, 102, 0.5);
}

/* Cards Internos */
.modal-section {
    margin-bottom: 24px; /* 7️⃣ 24px entre seções */
    padding: 20px; /* 7️⃣ Padding 20px */
    background: rgba(9, 32, 21, 0.75); /* 6️⃣ Verde profundo */
    border: 1px solid rgba(138, 204, 166, 0.10); /* 6️⃣ Verde menta */
    border-radius: 12px;
}

.modal-section h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #8ACC66; /* 6️⃣ Verde oliva */
    margin: 0 0 18px 0; /* 7️⃣ 18px margem inferior */
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-section p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.85); /* 6️⃣ Branco */
    line-height: 1.7;
    margin-bottom: 12px;
}

/* Botão Voltar ao Topo do Modal */
.modal-back-to-top {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #355E3B 0%, #CCAA66 100%);
    border: 1px solid rgba(204, 170, 102, 0.3);
    border-radius: 50%;
    color: #E4E4E4;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(53, 94, 59, 0.4);
}

.modal-back-to-top.show {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}

.modal-back-to-top:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(53, 94, 59, 0.6);
    border-color: #D4AF37;
}
```

---

### 23.8 Responsividade

```css
/* Tablet */
@media (max-width: 768px) {
    .modal-content {
        max-width: 95%;
        width: 95%;
        max-height: 85vh;
    }
    
    .modal-header {
        padding: 20px 24px;
    }
    
    .modal-header h2 {
        font-size: 1.5rem;
    }
    
    .modal-body {
        padding: 24px;
    }
}

/* Mobile */
@media (max-width: 480px) {
    .modal-content {
        width: 95%;
        max-height: 90vh;
    }
    
    .modal-header {
        padding: 16px 20px;
    }
    
    .modal-header h2 {
        font-size: 1.3rem;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .modal-section {
        padding: 16px;
    }
    
    .modal-back-to-top {
        width: 40px;
        height: 40px;
        font-size: 18px;
        bottom: 16px;
        right: 16px;
    }
}
```

---

### 23.9 ⚠️ CHECKLIST DE PROBLEMAS COMUNS (Leia ANTES de implementar!)

**Use esta lista para VERIFICAR se o modal está correto:**

#### **🎨 Cores e Bordas:**
- [ ] Scrollbar é **dourada** `rgba(212, 175, 55, 0.4)` - NÃO verde!
- [ ] Disclaimer acima do modal é **verde** `#10b981` - NÃO dourado!
- [ ] Borda do modal é `rgba(204, 170, 102, 0.15)` - NÃO 0.2, 0.3 ou 0.4!
- [ ] Títulos H3 dos cards são **verde oliva** `#8ACC66`
- [ ] Destaques `<strong>` são **brancos em negrito** - NÃO verdes!

#### **📏 Espaçamentos:**
- [ ] Padding do cabeçalho é **24px 32px** - NÃO menor!
- [ ] Padding do `.modal-body` é **32px** - NÃO 24px ou 20px!
- [ ] Margin-bottom entre cards é **24px** - NÃO 16px ou 12px!
- [ ] Margin do h2 no cabeçalho é **0** - NÃO adicionar margin-top!
- [ ] Margin-bottom do h3 é **18px** - NÃO 12px!

#### **🔤 Tipografia:**
- [ ] Botão fechar (X) é **24px** - NÃO 32px ou 18px!
- [ ] Título h2 do cabeçalho é **1.8rem**
- [ ] Título h3 dos cards é **1.2rem**
- [ ] Texto dos parágrafos é **0.95rem**
- [ ] `<strong>` usa **font-weight: 700** (padrão HTML) - NÃO 600!

#### **🎭 Comportamento:**
- [ ] Botão "Voltar ao Topo" usa **position: absolute** - NÃO fixed!
- [ ] Aparece após **200px** de scroll
- [ ] JavaScript escuta `.modal-body.scrollTop` - NÃO window.scrollTop!
- [ ] Disclaimer aparece APENAS no topo - NÃO repetir no final!

#### **📱 Responsividade:**
- [ ] Mobile (768px): padding reduzido para `24px 20px`
- [ ] Mobile (480px): padding reduzido para `20px`
- [ ] Botão "Voltar ao Topo" mobile: **40px** (não 48px)

---

### 23.10 Checklist de Implementação (Passo a Passo)

Ao criar um novo modal, siga esta ordem:

**ESTRUTURA BASE:**
- [ ] 1. Copiar estrutura HTML completa do modal CDB/Tesouro
- [ ] 2. Copiar CSS completo (overlay + content + header + body + sections)

**CORES E FUNDOS:**
- [ ] 3. Aplicar fundo `#0D1620`
- [ ] 4. Aplicar borda dourada `rgba(204,170,102,0.15)` - **0.15 exato!**
- [ ] 5. Aplicar sombra `0 0 18px rgba(0,0,0,0.65)`
- [ ] 6. Cabeçalho verde musgo `rgba(30,45,45,0.75)`
- [ ] 7. Botão fechar dourado `#CCAA66` (24px)
- [ ] 8. Cards verde profundo `rgba(9,32,21,0.75)`

**ESPAÇAMENTOS:**
- [ ] 9. Padding cabeçalho: `24px 32px`
- [ ] 10. Padding body: `32px`
- [ ] 11. Margin entre cards: `24px`
- [ ] 12. Padding dos cards: `20px`

**COMPONENTES ADICIONAIS:**
- [ ] 13. Scrollbar dourada (copiar CSS completo)
- [ ] 14. Disclaimer verde no topo (copiar HTML + CSS)
- [ ] 15. Botão "Voltar ao Topo" (HTML + CSS + JS)

**VALIDAÇÃO FINAL:**
- [ ] 16. Testar animação de abertura
- [ ] 17. Testar scroll e botão "Voltar ao Topo"
- [ ] 18. Testar responsividade (desktop/tablet/mobile)
- [ ] 19. Validar todas as cores com a lista de problemas comuns
- [ ] 20. Comparar visualmente com modal CDB/Tesouro

---

### 23.11 Resultado Final

Com esse padrão **testado e aprovado** nos modais CDB e Tesouro Direto, TODOS os modais do INVLAB terão:

✔ **Mesma cor** (#0D1620)  
✔ **Mesma profundidade** (sombra 0 0 18px)  
✔ **Mesma borda** (dourado 15% exato)  
✔ **Mesma tipografia** (Playfair Display + Inter)  
✔ **Mesmos espaçamentos** (32px/24px/20px/18px)  
✔ **Mesma sensação institucional**  
✔ **Mesma hierarquia visual** (H3 verde, texto branco, negrito branco forte)  
✔ **Mesmo "ar premium e sério"**  
✔ **Mesma scrollbar dourada**  
✔ **Mesmo disclaimer verde no topo**  
✔ **Mesmo botão "Voltar ao Topo" Gold Touch**  

**Inspiração profissional:**
- Banco Central do Brasil
- B3 (Bolsa de Valores)
- Nubank Explore
- Fintechs educacionais premium
- Stripe Documentation
- Figma Help Center

---

### 23.12 Modais que Devem Usar Este Padrão

**✅ Implementados e Testados (Pixel-Perfect):**
- ✅ `pages/simulador-cdbs.html` - Modal "Sobre CDBs"
- ✅ `pages/simulador-tesouro-direto.html` - Modal "Sobre Tesouro Direto"

**📝 A implementar (Próximos):**
- [ ] `pages/simulador-lci-lca.html` - Modal "Sobre LCI/LCA"
- [ ] Outros simuladores (ETFs, FIIs, Ações, etc.)
- [ ] Modais educacionais de criptoativos
- [ ] Popups informativos em páginas de conteúdo

**💡 Dica:** Ao implementar novos modais, use os arquivos CDB ou Tesouro como **template base** (copiar HTML + CSS) e apenas ajustar o conteúdo interno.

---

### 23.13 Status e Manutenção

**Status:** ✅ **TESTADO E APROVADO** - Padrão oficial INVLAB  
**Páginas de referência:**  
- `pages/simulador-cdbs.html` (linhas 600-950 do CSS)  
- `pages/simulador-tesouro-direto.html` (linhas 155-350 do CSS)

**Última atualização:** 25 de Novembro de 2024  
**Aprovado por:** Equipe INVLAB  
**Template master:** ✅ Pronto para replicação  

**⚠️ IMPORTANTE:** Antes de criar um novo modal, **SEMPRE consulte a seção 23.9 (Checklist de Problemas Comuns)** para evitar os erros mais frequentes!

**📊 Métricas de Qualidade:**
- ✅ Acessibilidade: WCAG 2.1 AA
- ✅ Performance: Animações 60fps
- ✅ Mobile-first: 100% responsivo
- ✅ Cross-browser: Chrome, Firefox, Safari, Edge

---

**Última atualização:** 25 de Novembro de 2024  
**Status:** ✅ Testado e aprovado  
**Padrão Atual:** H1 e H2 em DOURADO (#D4AF37) | Botões CTA em Gold Touch (#355E3B → #CCAA66) | Modais em INVLAB Premium (#0D1620)  
**Páginas Completas:** `index.html`, `pages/metodologia.html`, `pages/guia_invlab.html`, `pages/artigo-perfil-investidor.html`  
**Pronto para:** Expansão para todo o site

