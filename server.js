const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Conexão com PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cadastro_usuarios',
  password: 'impacta',
  port: 5432, // padrão do PostgreSQL
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '.'))); // Servir arquivos estáticos (HTML, CSS, JS)

// Rota para exibir o formulário (opcional, se você acessar direto o HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para cadastrar aluno
app.post('/cadastrar', async (req, res) => {
  const { nome, data_nascimento, telefone, email, altura, peso, imc } = req.body;

  console.log(req.body);  // Verifique se os dados estão chegando corretamente

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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
