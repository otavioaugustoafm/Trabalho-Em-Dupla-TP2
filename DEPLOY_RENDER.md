# Guia de Deploy no Render

Este documento fornece instruções passo a passo para fazer deploy do Sistema de Gestão Clínica no Render.

## Pré-requisitos

1. Conta no Render (https://render.com)
2. Repositório Git (GitHub, GitLab ou Gitea)
3. Variáveis de ambiente configuradas

## Passo 1: Preparar o Repositório

1. Faça push do código para seu repositório Git
2. Certifique-se de que o arquivo `package.json` está na raiz do projeto
3. Verifique se o arquivo `.gitignore` está configurado corretamente

## Passo 2: Criar um Serviço Web no Render

1. Acesse https://render.com/dashboard
2. Clique em "New +" e selecione "Web Service"
3. Conecte seu repositório Git
4. Configure as seguintes opções:

### Configurações Básicas
- **Name**: `health-management-system` (ou o nome desejado)
- **Environment**: Node
- **Region**: Escolha a região mais próxima
- **Branch**: main (ou sua branch padrão)

### Build Command
```bash
pnpm install && pnpm build
```

### Start Command
```bash
pnpm start
```

### Plan
- Comece com o plano gratuito para testes
- Upgrade para plano pago conforme necessário

## Passo 3: Configurar Variáveis de Ambiente

No painel do Render, vá para "Environment" e adicione as seguintes variáveis:

```
DATABASE_URL=mysql://usuario:senha@host:porta/database
JWT_SECRET=sua-chave-secreta-aqui
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=seu-nome
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
NODE_ENV=production
```

### Obtendo as Variáveis

- **DATABASE_URL**: Crie um banco MySQL/TiDB e obtenha a string de conexão
- **JWT_SECRET**: Gere uma chave aleatória segura
- **VITE_APP_ID**: Obtenha do seu painel Manus
- **OAUTH_SERVER_URL** e **VITE_OAUTH_PORTAL_URL**: Fornecidos pela plataforma Manus
- **OWNER_OPEN_ID** e **OWNER_NAME**: Suas credenciais Manus
- **BUILT_IN_FORGE_API_KEY**: Chave de API fornecida por Manus

## Passo 4: Configurar Banco de Dados

Se você não tiver um banco MySQL/TiDB:

### Opção 1: Usar TiDB Cloud (Recomendado)
1. Acesse https://tidbcloud.com
2. Crie um cluster gratuito
3. Obtenha a string de conexão
4. Adicione como `DATABASE_URL`

### Opção 2: Usar MySQL em outro serviço
1. Configure um MySQL em outro provedor
2. Obtenha a string de conexão
3. Adicione como `DATABASE_URL`

## Passo 5: Deploy

1. Clique em "Create Web Service"
2. O Render iniciará o build automaticamente
3. Aguarde a conclusão (geralmente 5-10 minutos)
4. Acesse sua aplicação através da URL fornecida

## Passo 6: Executar Migrações do Banco de Dados

Após o deploy bem-sucedido:

1. Acesse o painel do Render
2. Vá para "Shell" (se disponível)
3. Execute:
```bash
pnpm drizzle-kit migrate
```

Ou execute as migrações SQL manualmente através do painel de administração do banco de dados.

## Monitoramento e Logs

### Acessar Logs
1. No painel do Render, clique em "Logs"
2. Monitore erros e avisos
3. Verifique a saída de inicialização

### Verificar Status
- Acesse a URL da aplicação
- Verifique se a página de login carrega corretamente
- Teste o fluxo de autenticação

## Troubleshooting

### Erro: "Cannot find module"
- Verifique se todas as dependências estão em `package.json`
- Execute `pnpm install` localmente
- Faça commit de `pnpm-lock.yaml`

### Erro: "Database connection failed"
- Verifique a `DATABASE_URL`
- Confirme que o banco de dados está acessível
- Verifique firewall e regras de acesso

### Erro: "OAuth callback failed"
- Verifique as variáveis de OAuth
- Confirme que a URL de callback está registrada no Manus
- Verifique se `OAUTH_SERVER_URL` está correto

### Aplicação lenta
- Verifique se está usando plano pago
- Monitore o uso de CPU e memória
- Considere upgrade de plano

## Atualizações e Manutenção

### Deploy de Atualizações
1. Faça commit das mudanças
2. Faça push para o repositório
3. O Render fará deploy automaticamente

### Backup do Banco de Dados
- Configure backups automáticos no seu provedor de banco de dados
- Realize backups regulares

## Segurança

1. **Variáveis de Ambiente**: Nunca commite variáveis sensíveis
2. **HTTPS**: O Render fornece HTTPS automaticamente
3. **Firewall do Banco de Dados**: Restrinja acesso apenas ao Render
4. **Atualizações**: Mantenha dependências atualizadas

## Domínio Customizado

1. No painel do Render, vá para "Custom Domain"
2. Adicione seu domínio
3. Configure os registros DNS conforme instruído
4. Aguarde a propagação DNS (até 48 horas)

## Suporte

Para problemas:
- Consulte a documentação do Render: https://render.com/docs
- Verifique os logs da aplicação
- Contate o suporte do Render

## Próximos Passos

1. Configure um domínio customizado
2. Configure CORS se necessário
3. Configure monitoramento e alertas
4. Implemente CI/CD adicional se desejado
