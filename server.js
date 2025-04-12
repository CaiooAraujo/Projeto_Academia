const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',      // exemplo: postgres
  host: 'localhost',
  database: 'cadastro_usuarios',
  password: 'impacta',    // a senha do seu PostgreSQL
  port: 5432,
});

// Middleware para ler dados do formulário HTML
app.use(bodyParser.urlencoded({ extended: true }));

// Servir o arquivo HTML quando acessar "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para tratar o formulário
app.post('/cadastrar', async (req, res) => {
  const { nome, data_nascimento, telefone, email, altura, peso } = req.body;

  try {
    await pool.query(
      'INSERT INTO usuarios (nome, data_nascimento, telefone, email, altura, peso) VALUES ($1, $2, $3, $4, $5, $6)',
      [nome, data_nascimento, telefone, email, altura, peso]
    );
    res.send('✅ Usuário cadastrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Erro ao cadastrar usuário.');
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
