# 🎓 Feras Sem Futuro

> Educação financeira sem conflito de interesses. Sem comissões, sem jargão.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## 🌐 Site

**Produção:** [www.ferasemfuturo.com.br](https://www.ferasemfuturo.com.br)

## 📚 Sobre

Portal educativo sobre educação financeira, investimentos e planejamento financeiro pessoal. 100% gratuito e imparcial.

### Funcionalidades

- ✅ Artigos educativos sobre investimentos
- ✅ Comparador inteligente de investimentos (CDB, Tesouro, Poupança)
- ✅ Calculadora de juros compostos
- ✅ Sistema de histórico local (LocalStorage)
- ✅ Design mobile-first e responsivo
- ✅ PWA-ready (Progressive Web App)

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Gráficos:** Chart.js
- **Dados:** CSV (preparado para API futura)
- **Backend:** Node.js + Express
- **Deploy:** Railway
- **Domínio:** Registro.br

## 🚀 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

## 📦 Deploy

### Railway (Automático)

1. Push para GitHub
2. Conecte o repositório no Railway
3. Deploy automático a cada push na branch `main`

### Configurar Domínio

No Railway:
1. Settings → Domains
2. Add Domain → `ferasemfuturo.com.br`
3. Configure DNS no Registro.br:
   - CNAME: `www` → `[seu-app].up.railway.app`
   - ALIAS/ANAME: `@` → `[seu-app].up.railway.app`

## 📂 Estrutura

```
Do_Your_Self/
├── index.html                  # Página principal
├── pages/
│   ├── comparador-investimentos.html
│   ├── artigo-gerente.html
│   ├── artigo-poupanca.html
│   └── artigo-reserva.html
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   └── artigo.css
│   ├── js/
│   │   └── script.js
│   └── images/
│       └── Logo_tutorfinanceiro.png
├── ROBOS_Codigos_Financeiros/
│   └── CDB_Bancos_Completo.csv
├── server.js                   # Servidor Express
├── package.json
└── railway.json
```

## 🔮 Roadmap

- [ ] API para dados de investimentos (atualização automática)
- [ ] Sistema de usuários (login)
- [ ] Histórico sincronizado na nuvem
- [ ] Export PDF/Excel
- [ ] Compartilhamento de simulações
- [ ] App mobile (React Native)
- [ ] Notificações de novos conteúdos
- [ ] Calculadora de aposentadoria

## 📄 Licença

MIT © Feras Sem Futuro

---

**Feito com 💜 para democratizar educação financeira no Brasil**

