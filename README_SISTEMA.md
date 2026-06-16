# Sistema de Gestão Clínica

Um sistema web elegante e profissional para gerenciamento de profissionais de saúde, pacientes, agendamentos, prescrições e exames laboratoriais.

## 🎯 Funcionalidades Principais

### 1. Gestão de Profissionais de Saúde
- **Médicos**: CRM, especialidade
- **Fisioterapeutas**: CREFITO
- **Psicólogos**: CRP
- Cadastro completo com dados de contato e bio profissional

### 2. Gestão de Pacientes
- Cadastro com dados pessoais (CPF, data de nascimento)
- Informações de contato
- Endereço

### 3. Agendamentos
- Vinculação profissional-paciente
- Data e hora do atendimento
- Status: Agendado, Realizado, Cancelado
- Notas adicionais

### 4. Prescrições Específicas por Categoria

#### Prescrições Médicas
- Adicionar múltiplos medicamentos
- Dosagem e frequência
- Duração do tratamento
- Observações clínicas

#### Planos de Reabilitação
- Diagnóstico
- Número de sessões
- Exercícios estruturados com descrição
- Frequência de exercícios

#### Evoluções de Sessão
- Anotações clínicas
- Estado emocional do paciente
- Plano de tratamento

### 5. Exames Laboratoriais
- Solicitação de exames
- Tipo de exame
- Status: Pendente, Realizado, Cancelado
- Registro de resultados

### 6. Dashboard
- Total de profissionais cadastrados
- Agendamentos do dia
- Exames pendentes
- Últimas atividades

### 7. Controle de Acesso
- **Admin**: Acesso completo a todas as funcionalidades
- **Profissional**: Visualiza apenas seus próprios atendimentos

## 🚀 Começando

### Instalação Local

```bash
# Clonar o repositório
git clone seu-repositorio-url
cd health-management-system

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Executar migrações do banco de dados
pnpm drizzle-kit migrate

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Acessar a Aplicação

1. Abra http://localhost:3000
2. Faça login com suas credenciais Manus
3. Comece a usar o sistema

## 📋 Estrutura do Projeto

```
health-management-system/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e configurações
│   │   └── App.tsx        # Componente principal
│   └── index.html
├── server/                # Backend Node.js
│   ├── routers.ts         # Procedures tRPC
│   ├── db.ts              # Queries do banco de dados
│   └── _core/             # Infraestrutura (OAuth, etc)
├── drizzle/               # Schema e migrações do banco
├── shared/                # Tipos e constantes compartilhadas
└── package.json
```

## 🔐 Autenticação

O sistema utiliza OAuth 2.0 da plataforma Manus para autenticação. Não é necessário gerenciar senhas - o login é feito através da conta Manus.

### Fluxo de Login

1. Usuário clica em "Fazer Login"
2. Redirecionado para portal Manus
3. Autentica com credenciais Manus
4. Retorna à aplicação autenticado
5. Acesso baseado no perfil (admin/profissional)

## 🗄️ Banco de Dados

### Tabelas Principais

- **users**: Usuários do sistema (criada automaticamente)
- **professionals**: Profissionais de saúde
- **patients**: Pacientes
- **appointments**: Agendamentos
- **medical_prescriptions**: Prescrições médicas
- **rehabilitation_plans**: Planos de reabilitação
- **session_evolutions**: Evoluções de sessão
- **lab_exams**: Exames laboratoriais

### Migrations

As migrações são gerenciadas com Drizzle ORM:

```bash
# Gerar nova migração após alterar schema
pnpm drizzle-kit generate

# Aplicar migrações
pnpm drizzle-kit migrate
```

## 🎨 Design e UX

- **Layout elegante** com sidebar navigation
- **Componentes modernos** usando shadcn/ui
- **Responsivo** para desktop e tablet
- **Acessível** com suporte a keyboard navigation
- **Temas** com suporte a dark/light mode

## 🔧 Configuração de Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=mysql://user:password@host:port/database

# Autenticação
JWT_SECRET=sua-chave-secreta
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# Owner
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=seu-nome

# APIs Manus
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

## 📝 Fluxos Principais

### Cadastrar Profissional

1. Acesse "Profissionais" no menu
2. Clique em "Novo Profissional"
3. Preencha dados (nome, email, telefone)
4. Selecione categoria (Médico/Fisioterapeuta/Psicólogo)
5. Preencha dados específicos da categoria
6. Clique em "Salvar"

### Agendar Atendimento

1. Acesse "Agendamentos"
2. Clique em "Novo Agendamento"
3. Selecione paciente e profissional
4. Escolha data e hora
5. Adicione observações (opcional)
6. Clique em "Salvar"

### Criar Prescrição

1. Acesse "Prescrições"
2. Clique em "Nova Prescrição"
3. Selecione tipo (Médica/Reabilitação/Evolução)
4. Preencha dados específicos
5. Clique em "Salvar"

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com coverage
pnpm test:coverage
```

## 📦 Build e Deploy

### Build para Produção

```bash
pnpm build
```

### Executar em Produção

```bash
pnpm start
```

### Deploy no Render

Consulte [DEPLOY_RENDER.md](./DEPLOY_RENDER.md) para instruções detalhadas.

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique `DATABASE_URL`
- Confirme que o banco está acessível
- Verifique credenciais

### Erro: "OAuth callback failed"
- Verifique variáveis de OAuth
- Confirme que a URL de callback está registrada
- Verifique `OAUTH_SERVER_URL`

### Página em branco após login
- Verifique os logs do servidor
- Limpe cache do navegador
- Verifique se as migrações foram executadas

## 📚 Documentação Adicional

- [Guia de Deploy no Render](./DEPLOY_RENDER.md)
- [Documentação do tRPC](https://trpc.io/docs)
- [Documentação do Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Commit suas mudanças
3. Faça push para a branch
4. Abra um Pull Request

## 📄 Licença

MIT

## 📞 Suporte

Para suporte e dúvidas:
- Consulte a documentação
- Verifique os logs
- Abra uma issue no repositório

## 🎓 Notas Técnicas

### Stack Tecnológico

- **Frontend**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend**: Express 4 + tRPC 11
- **Banco de Dados**: MySQL/TiDB + Drizzle ORM
- **Autenticação**: OAuth 2.0 (Manus)
- **Build**: Vite + esbuild
- **Testes**: Vitest

### Arquitetura

- **tRPC-first**: Procedures definem contratos end-to-end
- **Type-safe**: TypeScript em todo o stack
- **Superjson**: Serialização automática de tipos complexos
- **Controle de Acesso**: Procedures protegidas por role

### Performance

- **Code splitting**: Lazy loading de rotas
- **Caching**: React Query com invalidação inteligente
- **Otimização de banco**: Queries indexadas
- **CDN**: Assets servidos via CDN (se configurado)

## 🔄 Roadmap Futuro

- [ ] Relatórios e exportação de dados
- [ ] Notificações por email
- [ ] Integração com calendários
- [ ] App mobile
- [ ] Integração com sistemas de pagamento
- [ ] Histórico de alterações
- [ ] Backup automático

---

**Desenvolvido com ❤️ para profissionais de saúde**
