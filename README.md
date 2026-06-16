# 🏥 Sistema de Gestão Clínica

Um sistema web completo e elegante para gerenciar profissionais de saúde, pacientes, agendamentos, prescrições e exames laboratoriais. Desenvolvido com tecnologias modernas (React 19, Express 4, tRPC 11, MySQL) e pronto para produção.

## ✨ Características

### 🎯 Funcionalidades Principais

- **Gestão de Profissionais de Saúde**
  - Cadastro de Médicos (CRM, especialidade)
  - Cadastro de Fisioterapeutas (CREFITO)
  - Cadastro de Psicólogos (CRP)
  - Ativação/desativação de profissionais

- **Gestão de Pacientes**
  - Cadastro completo com CPF, data de nascimento
  - Histórico de contato e endereço
  - Visualização de agendamentos

- **Agendamentos**
  - Vincular profissional + paciente
  - Controle de status (agendado, realizado, cancelado)
  - Histórico completo

- **Prescrições Específicas por Categoria**
  - **Médico**: Prescrições com medicamentos e dosagens
  - **Fisioterapeuta**: Planos de reabilitação com exercícios
  - **Psicólogo**: Evoluções de sessão com anotações clínicas

- **Exames Laboratoriais**
  - Solicitação de exames
  - Rastreamento de status
  - Registro de resultados

- **Dashboard**
  - Visão geral com métricas principais
  - Últimas atividades
  - Status do sistema

### 🔐 Segurança

- ✅ Autenticação OAuth integrada
- ✅ Controle de acesso por papel (Admin/User)
- ✅ Validação de entrada com Zod
- ✅ Proteção contra SQL injection (Drizzle ORM)
- ✅ Cookies seguros (httpOnly, Secure, SameSite)

### 🎨 Design

- Interface elegante e profissional
- Componentes modernos (shadcn/ui)
- Responsivo para desktop e tablet
- Tema claro com cores sofisticadas
- Acessibilidade (WCAG 2.1)

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 22+ (ou use o Render para produção)
- pnpm (gerenciador de pacotes)
- MySQL/TiDB (para banco de dados)

### Desenvolvimento Local

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/health-management-system.git
   cd health-management-system
   ```

2. **Instale dependências**
   ```bash
   pnpm install
   ```

3. **Configure variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   # Edite .env.local com suas configurações
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

### Build para Produção

```bash
# Compile frontend e backend
pnpm build

# Inicie o servidor de produção
pnpm start
```

---

## 📦 Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React | 19.2.1 |
| **Styling** | Tailwind CSS | 4.1.14 |
| **UI Components** | shadcn/ui | Latest |
| **State Management** | TanStack Query | 5.90.2 |
| **API** | tRPC | 11.6.0 |
| **Backend** | Express | 4.21.2 |
| **ORM** | Drizzle | 0.44.5 |
| **Database** | MySQL/TiDB | Latest |
| **Build Tool** | Vite | 7.1.7 |
| **Runtime** | Node.js | 22+ |

---

## 📁 Estrutura do Projeto

```
health-management-system/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                  # Páginas principais
│   │   │   ├── Home.tsx            # Página inicial
│   │   │   ├── Dashboard.tsx       # Dashboard
│   │   │   ├── ProfessionalsPage.tsx
│   │   │   ├── PatientsPage.tsx
│   │   │   ├── AppointmentsPage.tsx
│   │   │   ├── PrescriptionsPage.tsx
│   │   │   └── ExamsPage.tsx
│   │   ├── components/             # Componentes reutilizáveis
│   │   │   ├── DashboardLayout.tsx # Layout principal
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   └── ...
│   │   ├── hooks/                  # Custom hooks
│   │   ├── contexts/               # React contexts
│   │   ├── lib/                    # Utilitários
│   │   ├── App.tsx                 # Roteamento
│   │   └── main.tsx                # Entry point
│   └── index.html
├── server/                          # Backend Express
│   ├── _core/                      # Infraestrutura
│   │   ├── index.ts                # Servidor principal
│   │   ├── oauth.ts                # Autenticação
│   │   ├── context.ts              # Contexto tRPC
│   │   └── ...
│   ├── routers.ts                  # Procedures tRPC
│   ├── db.ts                       # Query helpers
│   └── storage.ts                  # S3 helpers
├── drizzle/                         # Schema e migrações
│   ├── schema.ts                   # Definição de tabelas
│   └── migrations/                 # Arquivos SQL
├── shared/                          # Código compartilhado
├── package.json
├── tsconfig.json
├── vite.config.ts
└── RENDER_DEPLOYMENT_GUIDE.md      # Guia de deploy
```

---

## 🔧 Variáveis de Ambiente

### Desenvolvimento

Crie um arquivo `.env.local`:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/health_management

# JWT
JWT_SECRET=sua-chave-secreta-aleatoria

# OAuth (opcional em desenvolvimento)
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# Ambiente
NODE_ENV=development
```

### Produção (Render)

Configure as variáveis no painel do Render:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | Sua string de conexão MySQL |
| `JWT_SECRET` | Chave aleatória segura |
| `NODE_ENV` | `production` |

---

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor com hot reload

# Build
pnpm build            # Compila frontend e backend

# Produção
pnpm start            # Inicia servidor de produção

# Qualidade de código
pnpm check            # Verifica tipos TypeScript
pnpm format           # Formata código com Prettier
pnpm test             # Executa testes Vitest

# Banco de dados
pnpm db:push          # Gera migrações e aplica ao banco
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

1. **users** - Usuários e autenticação
2. **health_professionals** - Profissionais de saúde
3. **patients** - Dados dos pacientes
4. **appointments** - Agendamentos
5. **medical_prescriptions** - Prescrições médicas
6. **rehabilitation_plans** - Planos de fisioterapia
7. **session_evolutions** - Evoluções psicológicas
8. **lab_exams** - Exames laboratoriais

### Executar Migrações

```bash
# Gerar migrações a partir do schema
pnpm drizzle-kit generate

# Aplicar migrações ao banco
pnpm db:push
```

---

## 🔐 Autenticação e Autorização

### Fluxo de Autenticação

1. Usuário clica em "Login"
2. Redirecionado para portal OAuth
3. Após autenticação, retorna com token
4. Token armazenado em cookie seguro
5. Cada requisição valida o token

### Papéis de Usuário

- **Admin**: Acesso total ao sistema
- **User**: Visualiza apenas seus próprios dados

### Proteger Rotas

```typescript
// Apenas usuários autenticados
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <NotFound />;
}

// Apenas admins (no backend)
function requireAdmin(ctx: any) {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}
```

---

## 🧪 Testes

### Executar Testes

```bash
pnpm test
```

### Arquivo de Referência

Veja `server/auth.logout.test.ts` para exemplo de teste com Vitest.

---

## 📈 Performance

### Otimizações Implementadas

- ✅ Build otimizado com Vite + esbuild
- ✅ React 19 com Suspense
- ✅ tRPC com caching automático
- ✅ Tailwind CSS com purge
- ✅ Lazy loading de páginas

### Métricas Esperadas

- Tempo de carregamento: < 2s
- Tamanho do bundle: ~500KB gzipped
- Requisições por página: 5-10

---

## 🚀 Deploy no Render

Para fazer deploy no Render, siga o **[Guia Completo de Deploy](./RENDER_DEPLOYMENT_GUIDE.md)**.

### Resumo Rápido

1. Criar banco de dados (TiDB Cloud ou PlanetScale)
2. Fazer push do código para GitHub
3. Conectar repositório no Render
4. Adicionar variáveis de ambiente
5. Deploy automático em 5-10 minutos

---

## 📖 Documentação

| Documento | Descrição |
|-----------|-----------|
| [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) | Guia passo a passo para deploy |
| [PROJECT_TECHNICAL_REPORT.md](./PROJECT_TECHNICAL_REPORT.md) | Relatório técnico completo |
| [todo.md](./todo.md) | Rastreamento de funcionalidades |

---

## 🐛 Troubleshooting

### "Database connection failed"

**Solução**: Verifique se `DATABASE_URL` está correto e o banco está acessível.

```bash
# Teste a conexão
mysql -h seu-host -u seu-usuario -p seu-banco
```

### "Port 3000 already in use"

**Solução**: Use outra porta:

```bash
PORT=3001 pnpm dev
```

### "TypeScript errors"

**Solução**: Verifique tipos:

```bash
pnpm check
```

### "Build failed"

**Solução**: Limpe cache e reinstale:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

---

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação
2. Consulte os logs do servidor
3. Teste localmente com `pnpm dev`
4. Abra uma issue no GitHub

---

## 🎯 Roadmap

### v1.1 (Próximas 2 semanas)
- [ ] Validações de CPF/CNPJ
- [ ] Busca global
- [ ] Notificações por email

### v1.2 (Próximo mês)
- [ ] Relatórios em PDF
- [ ] Integração com calendário
- [ ] Backup automático

### v2.0 (3+ meses)
- [ ] App mobile
- [ ] Integração com prontuário eletrônico
- [ ] Análise de dados com IA

---

**Versão**: 1.0.0  
**Data**: Junho 2026  
**Autor**: Manus AI  
**Status**: ✅ Pronto para Produção

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ usando React, Express, tRPC e Tailwind CSS.
