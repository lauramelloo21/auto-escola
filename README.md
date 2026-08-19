# Backend — Rota Livre Auto Escola

Backend simples em Node.js + Express que recebe as mensagens do formulário
de contato do site e as salva em um banco Postgres na nuvem. Inclui um
painel de admin em `/admin` protegido por senha.

## 1. Criar o banco de dados (Neon — grátis)

1. Acesse https://neon.tech e crie uma conta gratuita.
2. Crie um novo projeto (pode aceitar as opções padrão).
3. Na página do projeto, copie a "Connection string" — algo como:
   `postgresql://usuario:senha@ep-xxxx.neon.tech/neondb?sslmode=require`
4. Guarde essa string, você vai precisar dela no passo 3.

## 2. Testar localmente (opcional)

```bash
cd backend
npm install
cp .env.example .env
# edite o .env e cole sua DATABASE_URL do Neon + escolha uma ADMIN_PASSWORD
npm start
```

O servidor sobe em `http://localhost:3000`. O painel de admin fica em
`http://localhost:3000/admin`.

## 3. Publicar o backend (Render — grátis)

1. Suba a pasta `backend/` para um repositório no GitHub (pode ser o mesmo
   repositório do site, ou um separado).
2. Acesse https://render.com e crie uma conta gratuita.
3. Clique em "New +" → "Web Service" e conecte seu repositório do GitHub.
4. Configure:
   - **Root Directory**: `backend` (se estiver no mesmo repositório do site)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Em "Environment Variables", adicione:
   - `DATABASE_URL` → a connection string do Neon
   - `ADMIN_PASSWORD` → a senha que você quer usar no painel de admin
6. Clique em "Create Web Service". Em alguns minutos você recebe uma URL
   tipo `https://auto-escola-backend.onrender.com`.

> No plano gratuito do Render, o servidor "dorme" depois de um tempo sem
> uso e demora ~30s para acordar no primeiro acesso do dia. Normal.

## 4. Conectar o site ao backend

No arquivo `script.js` do site, troque:

```js
const BACKEND_URL = 'https://SEU-BACKEND-AQUI.onrender.com';
```

pela URL real que o Render te deu. Depois suba o site de novo
(GitHub Pages, Netlify, etc).

## 5. Acessar o painel de admin

Abra `https://SEU-BACKEND-AQUI.onrender.com/admin`, digite a senha que
você definiu em `ADMIN_PASSWORD` e veja as mensagens recebidas — pode
marcar como lida ou excluir.

## Estrutura das rotas

| Rota                          | Método | Uso                                  |
|-------------------------------|--------|---------------------------------------|
| `/api/mensagens`              | POST   | Pública — o site envia o formulário  |
| `/api/mensagens`               | GET    | Protegida — lista as mensagens        |
| `/api/mensagens/:id/lida`     | PATCH  | Protegida — marca como lida           |
| `/api/mensagens/:id`          | DELETE | Protegida — exclui uma mensagem       |
| `/admin`                      | —      | Painel visual (HTML) com login        |
