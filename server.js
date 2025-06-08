const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

// Conexão com PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cadastro_usuarios',
  password: 'impacta',
  port: 5432,
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // para POST JSON
app.use(express.static(path.join(__dirname, '.')));
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false
}));

// Rota Post para login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
      [email, senha]
    );

    if (result.rows.length > 0) {
      req.session.usuario = result.rows[0];
      res.redirect('/cliente');
    } else {
      res.send('Email ou senha inválidos');
    }
  } catch (err) {
    console.error('Erro no login:', err);
    res.send('Erro interno no servidor.');
  }
});

// Protege acesso ao cliente.html
app.get('/cliente', (req, res) => {
  if (req.session.usuario) {
    res.sendFile(path.join(__dirname, 'cliente.html'));
  } else {
    res.redirect('/login.html');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Cadastro de aluno
app.post('/cadastrar', async (req, res) => {
  const { nome, data_nascimento, telefone, email, altura, peso, imc } = req.body;
  const imcValor = parseFloat(imc);
  let classificacao = '';

  if (imcValor < 18.5) classificacao = "Magreza";
  else if (imcValor < 25) classificacao = "Normal";
  else if (imcValor < 30) classificacao = "Sobrepeso";
  else if (imcValor < 35) classificacao = "Obesidade grau I";
  else if (imcValor < 40) classificacao = "Obesidade grau II";
  else classificacao = "Obesidade grau III";

  try {
    await pool.query(
      `INSERT INTO usuarios (nome, data_nascimento, telefone, email, altura, peso, imc, classificacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [nome, data_nascimento, telefone, email, altura, peso, imcValor, classificacao]
    );
    res.send('Aluno cadastrado com sucesso!');
  } catch (err) {
    console.error('Erro ao cadastrar aluno:', err);
    res.status(500).send('Erro ao cadastrar aluno.');
  }
});

// Dados do usuário logado
app.get('/dados-usuario', (req, res) => {
  if (req.session.usuario) {
    res.json(req.session.usuario);
  } else {
    res.status(401).json({ erro: 'Usuário não está logado' });
  }
});

app.get('/preferencias', async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  const usuarioId = req.session.usuario.id;
  const classificacao = req.session.usuario.classificacao;

  try {
    // Busca preferências personalizadas
    const treinosUsuario = await pool.query(
      'SELECT nome_exercicio FROM treinos WHERE usuario_id = $1',
      [usuarioId]
    );

    const suplementosUsuario = await pool.query(
      'SELECT nome_suplemento FROM suplementos WHERE usuario_id = $1',
      [usuarioId]
    );

    // Se encontrou dados personalizados, retorna
    if (treinosUsuario.rows.length > 0 || suplementosUsuario.rows.length > 0) {
      return res.json({
        treinos: treinosUsuario.rows.map(t => t.nome_exercicio),
        suplementos: suplementosUsuario.rows.map(s => s.nome_suplemento)
      });
    }

    // Caso contrário, busca sugestões com base na classificação
    const sugestoesTreinos = await pool.query(
      'SELECT nome_exercicio FROM treinos WHERE usuario_id IS NULL AND classificacao_imc = $1',
      [classificacao]
    );

    const sugestoesSuplementos = await pool.query(
      'SELECT nome_suplemento FROM suplementos WHERE usuario_id IS NULL AND classificacao_imc = $1',
      [classificacao]
    );

    res.json({
      treinos: sugestoesTreinos.rows.map(t => t.nome_exercicio),
      suplementos: sugestoesSuplementos.rows.map(s => s.nome_suplemento)
    });

  } catch (err) {
    console.error('Erro ao buscar preferências:', err);
    console.error('Detalhes do erro:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar preferências' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
