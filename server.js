require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!process.env.DATABASE_URL) {
  console.error('ERRO: defina a variável de ambiente DATABASE_URL (string de conexão do Postgres).');
  process.exit(1);
}
if (!ADMIN_PASSWORD) {
  console.error('ERRO: defina a variável de ambiente ADMIN_PASSWORD (senha do painel de admin).');
  process.exit(1);
}

// Conexão com o banco Postgres na nuvem (ex: Neon, Supabase, Railway...)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Cria a tabela automaticamente se ainda não existir
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mensagens (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      categoria TEXT,
      mensagem TEXT,
      lida BOOLEAN DEFAULT FALSE,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Banco de dados pronto.');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware simples de autenticação do admin
function checkAdminAuth(req, res, next) {
  const senha = req.headers['x-admin-password'];
  if (senha !== ADMIN_PASSWORD) {
    return res.status(401).json({ erro: 'Senha inválida.' });
  }
  next();
}

// --- Rota pública: recebe o formulário de contato do site ---
app.post('/api/mensagens', async (req, res) => {
  try {
    const { nome, telefone, categoria, mensagem } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ erro: 'Nome e telefone são obrigatórios.' });
    }

    const result = await pool.query(
      `INSERT INTO mensagens (nome, telefone, categoria, mensagem)
       VALUES ($1, $2, $3, $4) RETURNING id, criado_em`,
      [nome, telefone, categoria || null, mensagem || null]
    );

    res.status(201).json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar a mensagem.' });
  }
});

// --- Rotas protegidas: usadas pelo painel de admin ---
app.get('/api/mensagens', checkAdminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM mensagens ORDER BY criado_em DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar mensagens.' });
  }
});

app.patch('/api/mensagens/:id/lida', checkAdminAuth, async (req, res) => {
  try {
    await pool.query('UPDATE mensagens SET lida = TRUE WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar mensagem.' });
  }
});

app.delete('/api/mensagens/:id', checkAdminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM mensagens WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao excluir mensagem.' });
  }
});

app.listen(PORT, async () => {
  await initDb();
  console.log(`Servidor rodando na porta ${PORT}`);
});
