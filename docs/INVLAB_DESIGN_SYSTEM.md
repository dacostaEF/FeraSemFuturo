# INVLAB Design System 1.0

> **Fonte da verdade:** `index.html` (Home) — padrão ouro visual do projeto.  
> **Regra de ouro:** nenhuma mudança visual no desktop. Tokens e classes são para padronizar; não para alterar o que já funciona.

---

## 1. Paleta de Cores

### Cores Primárias

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-gold` | `#D4AF37` | Títulos H1/H2/H3 principais, destaques de marca |
| `--inv-gold-alt` | `#CCAA66` | Variante mais fria do ouro (degradê de botões) |
| `--inv-gold-border` | `rgba(212,175,55,0.3)` | Bordas de cards e containers |
| `--inv-gold-border-subtle` | `rgba(212,175,55,0.12)` | Divisórias entre seções |
| `--inv-gold-bg` | `rgba(212,175,55,0.06)` | Background de destaque suave |

### Verde — Dados Positivos

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-green` | `#10b981` | Ícones de sucesso, checkmarks, bordas de alerta positivo |
| `--inv-green-text` | `rgba(16,185,129,0.65)` | Subtítulos de seção, descrições de categoria |
| `--inv-green-text-strong` | `rgba(16,185,129,0.85)` | Lista de conhecimentos, destaques verdes |
| `--inv-green-bg` | `rgba(16,185,129,0.03)` | Background suave de seções educativas |
| `--inv-green-border` | `rgba(16,185,129,0.1)` | Bordas de seções verdes |

### Azul — Ação e Links

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-blue` | `#2A7FFF` | Links ativos, tabs selecionadas, CTAs secundários |
| `--inv-blue-hover` | `#1E5FCC` | Hover de elementos azuis |

### Textos

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-text-white` | `#FFFFFF` | Texto puro em fundos escuros |
| `--inv-text-primary` | `#E4E4E4` | Branco suave — títulos de cards |
| `--inv-text-secondary` | `#9CA3AF` | Cinza INVLAB — descrições de cards |
| `--inv-text-muted` | `rgba(255,255,255,0.75)` | Parágrafos de seção, texto de suporte |
| `--inv-text-faint` | `rgba(255,255,255,0.85)` | Hero paragraph — texto destacado |

### Fundos

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-bg` | `#0D0D0D` | Fundo global da página |
| `--inv-bg-card` | `#1A1A1A` | Background sólido de cards |
| `--inv-bg-card-alpha` | `rgba(26,26,26,0.6)` | Cards transparentes sobrepostos |
| `--inv-bg-card-alpha-dark` | `rgba(26,26,26,0.7)` | Cards em seções com background |

### Cores de Alerta (componentes auxiliares)

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-orange` | `#F59E0B` | Alerta, risco moderado |
| `--inv-red` | `#ef4444` | Perigo, risco alto |
| `--inv-purple` | `#a855f7` | Alternativos |
| `--inv-cyan` | `#22d3ee` | Previdência |
| `--inv-yellow` | `#eab308` | Ativos Reais |
| `--inv-teal` | `#14b8a6` | Ferramentas |

---

## 2. Tipografia

### Famílias de Fonte

```
Display (Títulos): 'Playfair Display', Georgia, 'Times New Roman', serif
Body (Textos):     'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### Escala de Tamanhos — Títulos

| Token CSS | Valor | Onde é usado |
|---|---|---|
| `--inv-fs-hero` | `clamp(1.8rem, 4vw, 3rem)` | H1 hero da Home |
| `--inv-fs-section` | `2rem` | H2 de seções no body (inline) |
| `--inv-fs-section-title` | `2.25rem` | Classe `.section-title` (CSS definido) |
| `--inv-fs-category` | `1.75rem` | `.inv-category-title` padrão CSS (`inv-design-system.css`) |
| `--inv-fs-card-lg` | `1.5rem` | H3 de cards de simuladores (Wizard/PRO) |
| `--inv-fs-card-title` | `1.125rem` | `.inv-card-title` (cards de instrumentos) |
| `--inv-fs-card-method` | `1.2rem` | H3 de cards de método (1234) |

> **Exceção documentada — Home Primeiros Passos:** `h3.inv-category-title` na aba Primeiros Passos usa `font-size: 2rem` via `style=""` inline. Isso é um override local da Home, não o padrão da classe. Não transformar em token global.

### Escala de Tamanhos — Corpo

| Token CSS | Valor | Onde é usado |
|---|---|---|
| `--inv-fs-body-xl` | `1.1rem` | Parágrafo hero principal |
| `--inv-fs-body-lg` | `1.05rem` | Descrições de seção |
| `--inv-fs-body` | `1rem` | Subtítulo de seção, texto de suporte |
| `--inv-fs-body-sm` | `0.95rem` | Card text, subtítulo verde hero, jornada |
| `--inv-fs-caption` | `0.9rem` | Listas, texto de cards pequenos |
| `--inv-fs-micro` | `0.85rem` | Jornada descrições, menu mobile |

### Line Heights

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-lh-title` | `1.2` | Títulos H2/H3 desktop |
| `--inv-lh-title-sm` | `1.15` | H2 mobile, H1 hero |
| `--inv-lh-card-title` | `1.25` | Card headings (learning-card h3, inv-card-title) |
| `--inv-lh-body` | `1.75` | Parágrafos hero e de seção |
| `--inv-lh-content` | `1.6` | Textos de cards, descrições |
| `--inv-lh-list` | `2.0` | Listas de conhecimento |
| `--inv-lh-category` | `1.8` | Subtítulos de categoria |

### Letter Spacing

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-ls-title` | `-0.02em` | H1/H2 principais (inline) |
| `--inv-ls-heading` | `-0.01em` | Headings em geral (CSS base) |
| `--inv-ls-card-title` | `-0.01em` | `.inv-card-title` |

### Font Weights

| Papel | Valor | Uso |
|---|---|---|
| Titulo herói | `800` | H1, H2 principais de seção |
| Título categoria | `700` | H3, `.inv-card-title` |
| Subtítulo | `600` | Badges, labels |
| Corpo | `400` | Parágrafos |

---

## 3. Espaçamento

### Padding de Seções

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-section-padding` | `64px 0` | Seções principais da Home |
| `--inv-section-padding-sm` | `60px 0` | Seção educação financeira |
| `--inv-section-padding-compact` | `35px 0` | Seção mobile / seções dentro de abas |

### Padding de Cards

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-card-padding-lg` | `32px` | Cards de simuladores (Wizard/PRO) |
| `--inv-card-padding` | `28px 24px` | Cards de método (1234) |
| `--inv-card-padding-sm` | `20px` | Cards `.inv-card` |

### Margens Tipográficas

| Elemento | Valor padrão |
|---|---|
| H2 → próximo elemento | `margin-bottom: 16px` |
| Subtítulo de seção → conteúdo | `margin-bottom: 48px` |
| H3 de categoria → conteúdo | `margin-bottom: 32px` |
| Card title → descrição | `margin-bottom: 12px` |
| Parágrafo → próximo | `margin-bottom: 24px` (hero) / `12px` (card) |

---

## 4. Bordas e Raios

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-radius-card` | `16px` | Cards principais |
| `--inv-radius-md` | `12px` | Cards de jornada, tooltips |
| `--inv-radius-sm` | `8px` | Botões, dropdowns |
| `--inv-radius-pill` | `20px` | Badges, tags |

### Bordas Padrão de Cards

```
border: 1px solid rgba(212,175,55,0.3)   /* cards normais */
border: 1px solid rgba(212,175,55,0.2)   /* cards de jornada/método */
border: 1px solid rgba(212,175,55,0.12)  /* divisórias de seção */
```

---

## 5. Sombras

| Token CSS | Valor | Uso |
|---|---|---|
| `--inv-shadow-sm` | `0 2px 8px rgba(0,0,0,0.3)` | Sombra sutil |
| `--inv-shadow-md` | `0 4px 16px rgba(0,0,0,0.4)` | Cards em repouso |
| `--inv-shadow-lg` | `0 8px 32px rgba(0,0,0,0.5)` | Cards com hover |
| `--inv-shadow-xl` | `0 12px 48px rgba(0,0,0,0.6)` | Modais |
| `--inv-shadow-gold` | `0 8px 24px rgba(212,175,55,0.2)` | Hover dourado |
| `--inv-shadow-green` | `0 4px 12px rgba(16,185,129,0.1)` | Hover verde suave |

---

## 6. Breakpoints Responsivos

| Nome | Valor | Comportamento |
|---|---|---|
| Tablet | `max-width: 900px` | Tipografia reduzida, grids compactos |
| Mobile | `max-width: 600px` | `clamp()` mínimo, hyphens: auto |
| Mobile médio | `max-width: 768px` | Menu oculto, hero reposicionado |
| Mobile pequeno | `max-width: 480px` | Padding mínimo, fontes compactas |
| Microtela | `max-width: 360px` | Fonte 0.85rem máximo |

### Tokens Responsivos (prefixo `--inv-rfs-`)

| Token | Valor | Aplica em |
|---|---|---|
| `--inv-rfs-900-heading` | `1.5rem` | `.section-title`, `.inv-category-title` em ≤900px |
| `--inv-rfs-900-card-h3` | `1.1rem` | `.learning-card h3`, `.inv-card-title` em ≤900px |
| `--inv-rfs-900-h1` | `2rem` | H1 das abas Renda Fixa/Variável em ≤900px |
| `--inv-rfs-900-hero-h2` | `1.8rem` | H2 hero com inline `2.4rem` em páginas auxiliares ≤900px |
| `--inv-rfs-600-section` | `clamp(1.5rem, 6vw, 1.7rem)` | `.section-title` Primeiros Passos em ≤600px |
| `--inv-rfs-600-category` | `clamp(1.15rem, 5vw, 1.3rem)` | `.inv-category-title` em ≤600px |
| `--inv-rfs-600-inicio-h2` | `clamp(1.25rem, 5.5vw, 1.5rem)` | Seções do `#inicio` em ≤600px |
| `--inv-rfs-600-h1` | `clamp(1.5rem, 6vw, 1.9rem)` | H1 Renda Fixa/Variável em ≤600px |
| `--inv-rfs-600-h2-renda` | `clamp(1.15rem, 5vw, 1.4rem)` | H2 Renda Fixa/Variável em ≤600px |
| `--inv-rfs-600-article-h2` | `clamp(1.15rem, 5vw, 1.4rem)` | `.article-content h2` em ≤600px |
| `--inv-rfs-600-card-h3` | `1rem` | Card headings em ≤600px |

### Tabela de Equivalência Desktop → Mobile

| Elemento | Desktop | Token | Tablet ≤900px | Mobile ≤600px |
|---|---|---|---|---|
| `.section-title` PP | `2.25rem` (classe) / `2rem` (inline) | `--inv-rfs-900-heading` | `1.5rem` | `clamp(1.5rem,6vw,1.7rem)` |
| `.inv-category-title` | `1.75rem` (classe) / `2rem` (inline PP) | `--inv-rfs-900-heading` | `1.5rem` | `clamp(1.15rem,5vw,1.3rem)` |
| `.article-content h2` | variável por página | `--inv-rfs-900-heading` | `1.5rem` | `clamp(1.15rem,5vw,1.4rem)` |
| `.learning-card h3` | ~1.1rem (via CSS) | `--inv-rfs-900-card-h3` | `1.1rem` | `1rem` |
| Hero páginas auxiliares | `2.4rem` (inline) | `--inv-rfs-900-hero-h2` | `1.8rem` | `clamp(1.5rem,6vw,1.9rem)` |

### Exceções Oficiais da Home (index.html)

A escala geral responsiva utiliza os breakpoints primários de **900px** e **600px**. A Home mantém uma camada adicional de refinamento próprio em **768px, 480px e 360px**, aprovada durante DS-01 e que **não deve ser removida nem generalizada automaticamente**.

Esses ajustes existem no `#inicio` da Home e cobrem:
- `@media (max-width: 768px)`: tipografia e layout geral do `#inicio`
- `@media (max-width: 480px)`: compactação adicional para telas pequenas
- `@media (max-width: 360px)`: micro-ajuste para telas mínimas

**Motivo:** a densidade informacional da Home (simuladores, cards, listas, botões) exige uma grating mobile mais fina que as páginas de artigo. Os valores (1.6rem → 1.45rem → 1.3rem para títulos; 0.95rem → 0.9rem → 0.85rem para parágrafos) são uma escada própria da Home e não pertencem ao sistema universal de tokens.

**Regra de convivência:** onde os blocos 768/480/360px e os blocos 900/600px se sobrepõem no mesmo elemento, o bloco 900/600px vence (por estar mais abaixo no arquivo). Isso é intencional: os seletores específicos do Lote 1 (ex.: `#inicio > .content-wrapper > section > .content-wrapper > h2`) têm prioridade sobre os seletores largos do bloco 768px (`#inicio h2`).

### Exceção: `line-height: 1.22` (não tokenizado)

O valor `1.22` de `line-height` usado em `.inv-category-title` nos blocos mobile (≤600px) é um ajuste fino de categoria preservado sem token. Presente em:
- `artigo-styles.css` Lote 3
- `defesa-investidor.css` Lote 2
- `instrumentos-avancados.css` Lote 2

Razão: nível de precisão contextual que não justifica token global.

### Exceção: `font-size: 2rem` em `.inv-category-title` da Home

Os `h3.inv-category-title` da aba **Primeiros Passos** em `index.html` usam `style="font-size: 2rem"` inline. Isso é um override local da Home — o padrão da classe (definido em `inv-design-system.css`) é `1.75rem` e o token `--inv-fs-category: 1.75rem` captura o padrão da classe, não a exceção inline.

**Não transformar o `2rem` em token global.** Se a Home precisar ser normalizada, remover o inline style desses elementos e usar o token.

---

## 7. Classes Semânticas Padronizadas

### Classes Existentes (não alterar)

| Classe | Definida em | Propósito |
|---|---|---|
| `.section-title` | `styles.css` | Título principal de aba (2.25rem, dourado) |
| `.section-subtitle` | `styles.css` | Subtítulo de aba (1.125rem, verde suave) |
| `.inv-category-title` | `artigo-styles.css` | H3 de categoria dentro de seção |
| `.inv-card-title` | `inv-design-system.css` | Título de card de instrumento |
| `.inv-card-description` | `inv-design-system.css` | Descrição de card de instrumento |

### Classes Novas (adicionadas no `invlab-design-tokens.css`)

| Classe | Propósito | Não confundir com |
|---|---|---|
| `.inv-section-title` | H2 de seção — 2rem, dourado, sem border-bottom | `.section-title` do `styles.css` (2.25rem + border-bottom) |
| `.inv-body-lead` | Parágrafo em destaque — 1.1rem, rgba(255,255,255,0.85) | — |
| `.inv-body-text` | Parágrafo de seção — 1rem, centralizado, max 700px | — |
| `.inv-body-caption` | Texto pequeno de card — 0.9rem, #9CA3AF | `.inv-card-description` (0.9375rem, sem max-width) |

> **Removidas vs v1.0:** `.inv-page-title` (idêntica a `.inv-section-title`, eliminada) e `.inv-category-subtitle` (conflitava com a classe homônima em `inv-design-system.css`).

### Classes Existentes que não devem ser redefinidas

| Classe | Definida em | Desktop size | Risco |
|---|---|---|---|
| `.section-title` | `styles.css` | `2.25rem` + `border-bottom` | Redefinir muda border-bottom |
| `.section-subtitle` | `styles.css` | `1.125rem`, verde | — |
| `.inv-category-title` | `inv-design-system.css` | `1.75rem` | Inline `2rem` na Home é override local |
| `.inv-category-subtitle` | `inv-design-system.css` | `1.05rem`, `line-height: 1.6` | Conflito se adicionado nos tokens |
| `.inv-card-title` | `inv-design-system.css` | `1.125rem` | — |
| `.inv-card-description` | `inv-design-system.css` | `0.9375rem` | — |

---

## 8. Componentes de Botão

### Botão Principal — Simulador

```css
.btn-simulador-invlab {
    background: linear-gradient(135deg, #355E3B 0%, #CCAA66 100%);
    border: 1px solid rgba(204,170,102,0.3);
    color: #E4E4E4;
    padding: 14px 32px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
}
```

---

## 9. Gradientes de Marca

| Nome | Valor | Uso |
|---|---|---|
| Gold Touch | `linear-gradient(135deg, #355E3B 0%, #CCAA66 100%)` | Botão simulador |
| Dark | `linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)` | Fundos escuros |
| Success | `linear-gradient(135deg, #00D924 0%, #00B894 100%)` | Destaque positivo |

---

## 10. Regras de Não-Regressão

1. **Home (index.html) não muda visualmente um pixel no desktop** — qualquer ajuste vai dentro de `@media (max-width: 900px)` ou `@media (max-width: 600px)` exclusivamente.
2. **Desktop de todas as páginas permanece intocado** — tokens e classes só substituem inline styles quando o resultado visual é idêntico.
3. **Não usar tokens para alterar valores** — tokens encapsulam os valores que já existem; se precisar mudar um valor, muda o token com consciência.
4. **Cascade: artigo-styles.css → page-specific.css → inline `<style>`** — respeitar a ordem ao adicionar regras.
5. **Sem `!important` fora de media queries** — dentro de `@media`, permitido para sobrepor inline styles.
6. **Blocos 768/480/360px da Home são exceções oficiais** — não remover, não generalizar, não converter em tokens. Ver "Exceções Oficiais da Home" na seção 6.
