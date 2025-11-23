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
| **Títulos de Seção** | Degradê verde premium | "Por que o INVLAB é diferente?" |
| **Subtítulos** | `rgba(16, 185, 129, 0.65)` (Verde suave 65%) | "Seu laboratório para testar..." |
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

### 6.1 Título de Seção com Degradê Premium

```html
<h2 class="section-title-premium">💎 Por que o INVLAB é diferente?</h2>
```

```css
.section-title-premium {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 800;                                     /* Peso forte - presença */
    text-align: center;
    margin-bottom: 12px;
    
    /* Degradê Verde Premium - forte e iluminado */
    background: linear-gradient(90deg, #10b981 0%, #34D399 50%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    letter-spacing: -0.02em;                              /* Kerning apertado */
}
```

### 6.2 Subtítulo Premium

```html
<p class="section-subtitle-premium">Seu laboratório para testar estratégias antes de investir de verdade.</p>
```

```css
.section-subtitle-premium {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    font-weight: 400;
    text-align: center;
    color: rgba(16, 185, 129, 0.65);                      /* Verde suave 65% */
    margin-bottom: 40px;
    line-height: 1.6;
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

## 🚀 13. PRÓXIMOS PASSOS

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

---

## 📝 NOTAS IMPORTANTES

1. **Verde Puro (#10b981):** Use APENAS em ícones, botões e detalhes pequenos. NUNCA em textos longos!

2. **Degradê Verde:** Use APENAS em títulos de seção. Não aplique em títulos de cards.

3. **Dourado (#D4AF37):** É a cor de destaque principal. Use em ícones e estados hover.

4. **Transições:** Sempre `0.3s ease` para consistência.

5. **Elevação no Hover:** Sempre `-6px` para cards principais.

6. **Sombras Duplas:** Camada dourada + camada verde para profundidade premium.

---

**Última atualização:** 23 de Novembro de 2025  
**Status:** ✅ Testado e aprovado na página Inicio (index.html)  
**Pronto para:** Expansão para todo o site

