# Guia Completo de Deploy no Render

## 📋 Visão Geral

Este guia fornece instruções passo a passo para fazer deploy do **Sistema de Gestão Clínica** no Render, uma plataforma de hospedagem moderna que simplifica o processo de deployment. O projeto está totalmente configurado e pronto para produção.

---

## 🎯 Pré-requisitos

Antes de começar, certifique-se de que você possui:

1. **Conta no Render** - Acesse [render.com](https://render.com) e crie uma conta gratuita
2. **Repositório Git** - O projeto deve estar em um repositório GitHub, GitLab ou Gitea
3. **Banco de Dados MySQL** - Você pode usar:
   - **TiDB Cloud** (recomendado, gratuito): https://tidbcloud.com
   - **PlanetScale** (gratuito): https://planetscale.com
   - **MySQL hospedado** em outro provedor
4. **Variáveis de Ambiente** - Você precisará de algumas chaves e URLs

---

## 📊 Arquitetura do Projeto

O projeto é uma aplicação **full-stack** com a seguinte estrutura:

| Componente | Tecnologia | Descrição |
|-----------|-----------|-----------|
| **Frontend** | React 19 + Tailwind CSS | Interface elegante com 6 módulos principais |
| **Backend** | Express 4 + tRPC 11 | API type-safe com autenticação OAuth |
| **Banco de Dados** | MySQL/TiDB | 7 tabelas com relações completas |
| **Build Tool** | Vite + esbuild | Build otimizado para produção |
| **Runtime** | Node.js 22+ | Servidor único que serve frontend e backend |

---

## 🚀 Passo 1: Preparar o Banco de Dados

### Opção A: TiDB Cloud (Recomendado)

1. Acesse [tidbcloud.com](https://tidbcloud.com)
2. Clique em **"Sign Up"** e crie uma conta
3. Após login, clique em **"Create Cluster"**
4. Selecione:
   - **Plan**: Free Tier (gratuito)
   - **Region**: Selecione a região mais próxima de você
   - **Cluster Name**: `health-management-prod`
5. Clique em **"Create"** e aguarde 5-10 minutos
6. Após criado, clique no cluster e vá para **"Connection"**
7. Copie a **MySQL Connection String** (será algo como):
   ```
   mysql://root:password@host:4000/database
   ```
8. **Salve esta string** - você usará como `DATABASE_URL`

### Opção B: PlanetScale

1. Acesse [planetscale.com](https://planetscale.com)
2. Clique em **"Sign Up"** com GitHub
3. Clique em **"Create a database"**
4. Preencha:
   - **Database name**: `health-management`
   - **Region**: Próxima a você
5. Clique em **"Create database"**
6. Vá para **"Connect"** e copie a **MySQL Connection String**
7. **Salve esta string** - você usará como `DATABASE_URL`

---

## 🔑 Passo 2: Preparar Variáveis de Ambiente

Você precisará de 3 variáveis principais:

| Variável | Valor | Exemplo |
|----------|-------|---------|
| `DATABASE_URL` | String de conexão MySQL | `mysql://root:pass@host:4000/db` |
| `JWT_SECRET` | Chave aleatória para sessões | `abc123xyz789def456ghi` |
| `NODE_ENV` | Ambiente de produção | `production` |

### Como gerar `JWT_SECRET`:

Execute este comando no seu terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado (será uma string de 64 caracteres).

---

## 📦 Passo 3: Preparar o Repositório Git

1. **Clone ou navegue até o repositório**:
   ```bash
   cd /caminho/do/seu/projeto
   ```

2. **Verifique se há mudanças pendentes**:
   ```bash
   git status
   ```

3. **Faça commit de todas as mudanças**:
   ```bash
   git add .
   git commit -m "Preparar para deploy no Render"
   ```

4. **Faça push para o repositório remoto**:
   ```bash
   git push origin main
   ```

**Nota**: Se você não tem um repositório Git ainda, crie um no GitHub:
- Acesse [github.com/new](https://github.com/new)
- Crie um repositório chamado `health-management-system`
- Siga as instruções para fazer push do código local

---

## 🎛️ Passo 4: Criar Serviço no Render

1. **Acesse o Render**:
   - Vá para [dashboard.render.com](https://dashboard.render.com)
   - Faça login com sua conta

2. **Clique em "New +"** no canto superior direito

3. **Selecione "Web Service"**

4. **Conecte seu repositório**:
   - Clique em "Connect account" se necessário
   - Selecione o repositório `health-management-system`
   - Clique em "Connect"

5. **Configure o serviço**:
   - **Name**: `health-management-system`
   - **Environment**: `Node`
   - **Build Command**: 
     ```
     pnpm install && pnpm build
     ```
   - **Start Command**: 
     ```
     pnpm start
     ```

6. **Selecione o plano**:
   - **Free** (recomendado para começar)
   - Você pode fazer upgrade depois se necessário

7. **Clique em "Create Web Service"**

---

## 🔐 Passo 5: Adicionar Variáveis de Ambiente

1. **No painel do Render**, após criar o serviço, vá para **"Environment"**

2. **Clique em "Add Environment Variable"** e adicione:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Sua string de conexão MySQL (do Passo 2) |
   | `JWT_SECRET` | Sua chave aleatória gerada (do Passo 2) |
   | `NODE_ENV` | `production` |

3. **Clique em "Save"**

**Importante**: As variáveis `VITE_APP_ID`, `OAUTH_SERVER_URL` e outras serão injetadas automaticamente pelo Manus quando necessário.

---

## ⏳ Passo 6: Aguardar o Deploy

1. **Monitore o progresso**:
   - O Render começará a fazer build automaticamente
   - Você verá o status em tempo real no painel
   - O build deve levar 5-10 minutos

2. **Verifique os logs**:
   - Clique em **"Logs"** para ver o progresso
   - Procure por mensagens de erro

3. **Aguarde até ficar "Live"**:
   - Quando o status mudar para "Live" (verde), o deploy foi bem-sucedido
   - Você receberá uma URL pública (ex: `https://health-management-system.onrender.com`)

---

## ✅ Passo 7: Testar a Aplicação

1. **Acesse a URL pública**:
   - Clique na URL gerada pelo Render
   - Ou acesse manualmente: `https://seu-app-name.onrender.com`

2. **Verifique se o site carrega**:
   - Você deve ver o dashboard do sistema
   - O menu lateral deve estar visível
   - Todas as páginas devem ser acessíveis

3. **Teste as funcionalidades**:
   - Clique em "Profissionais", "Pacientes", "Agendamentos", etc.
   - As listas devem aparecer vazias (esperado, sem dados ainda)
   - Não deve haver erros de console

---

## 🗄️ Passo 8: Executar Migrações do Banco de Dados

Após o primeiro deploy bem-sucedido, você precisa criar as tabelas no banco de dados.

### Opção A: Via Render Shell (Recomendado)

1. **No painel do Render**, clique em **"Shell"** (canto superior direito)

2. **Execute o comando de migração**:
   ```bash
   pnpm db:push
   ```

3. **Aguarde a conclusão**:
   - Você verá mensagens indicando que as tabelas foram criadas
   - Se houver erros, verifique se o `DATABASE_URL` está correto

### Opção B: Via Cliente MySQL Local

Se preferir, pode executar as migrações localmente:

1. **Instale o MySQL CLI** (se não tiver):
   ```bash
   # macOS
   brew install mysql-client
   
   # Ubuntu/Debian
   sudo apt-get install mysql-client
   ```

2. **Conecte ao banco remoto**:
   ```bash
   mysql -h seu-host -u seu-usuario -p seu-banco < drizzle/0001_dusty_nicolaos.sql
   ```

3. **Insira a senha quando solicitado**

---

## 🔄 Passo 9: Fazer Atualizações Futuras

Sempre que você fizer mudanças no código:

1. **Faça commit e push**:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

2. **O Render fará rebuild automaticamente**:
   - Você verá o status "Building" no painel
   - Após 5-10 minutos, voltará a "Live"
   - Não é necessário fazer nada manualmente

---

## 🆘 Troubleshooting

### Erro: "Build failed"

**Solução**: Verifique os logs:
1. Clique em **"Logs"** no painel do Render
2. Procure pela mensagem de erro
3. Erros comuns:
   - `DATABASE_URL não configurado` → Adicione a variável de ambiente
   - `pnpm: command not found` → O Render deve instalar automaticamente
   - Erros de TypeScript → Verifique se o código compila localmente com `pnpm check`

### Erro: "Application failed to start"

**Solução**:
1. Verifique se `DATABASE_URL` está correto
2. Verifique se o banco de dados está acessível
3. Clique em **"Restart"** no painel para reiniciar o serviço

### Site carrega mas mostra erro "Invalid URL"

**Solução**: Isso indica que as variáveis de ambiente OAuth não foram injetadas. Aguarde alguns minutos e recarregue a página.

### Banco de dados não conecta

**Solução**:
1. Verifique se a string `DATABASE_URL` está correta
2. Verifique se o banco de dados está ativo (no TiDB Cloud ou PlanetScale)
3. Verifique se você tem acesso de rede (firewall)
4. Para TiDB Cloud: certifique-se de que seu IP está na whitelist

---

## 📈 Próximos Passos

Após o deploy bem-sucedido:

1. **Criar usuários admin**:
   - Acesse o banco de dados
   - Insira um usuário com `role = 'admin'`

2. **Fazer backup do banco de dados**:
   - Configure backups automáticos no seu provedor de banco

3. **Configurar domínio customizado** (opcional):
   - No Render, vá para **"Settings"** → **"Custom Domain"**
   - Aponte seu domínio para o Render

4. **Monitorar performance**:
   - Clique em **"Analytics"** no painel do Render
   - Monitore CPU, memória e requisições

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs do Render** - Clique em "Logs" para ver mensagens de erro
2. **Verifique a documentação do Render** - https://render.com/docs
3. **Verifique o status do banco de dados** - Acesse o painel do TiDB Cloud ou PlanetScale
4. **Teste localmente** - Execute `pnpm dev` para verificar se funciona em desenvolvimento

---

## ✨ Resumo Rápido

| Etapa | Tempo | Ação |
|-------|-------|------|
| 1. Criar banco de dados | 10 min | TiDB Cloud ou PlanetScale |
| 2. Preparar variáveis | 5 min | Gerar `JWT_SECRET` e copiar `DATABASE_URL` |
| 3. Fazer push do código | 2 min | `git push origin main` |
| 4. Criar serviço no Render | 5 min | Conectar repositório e configurar |
| 5. Adicionar variáveis | 2 min | Adicionar `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV` |
| 6. Aguardar deploy | 10 min | Monitorar logs até ficar "Live" |
| 7. Testar aplicação | 5 min | Acessar URL e verificar funcionalidades |
| 8. Executar migrações | 2 min | `pnpm db:push` no Render Shell |
| **Total** | **~41 min** | Aplicação em produção! 🎉 |

---

**Versão**: 1.0  
**Última atualização**: Junho 2026  
**Autor**: Manus AI
