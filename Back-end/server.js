const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'seu_usuario', // Altere para o usuário do seu banco
    host: 'localhost',
    database: 'nome_do_banco', // Altere para o seu banco de dados
    password: 'sua_senha', // Altere para a sua senha de banco de dados
    port: 5432
});

app.use(cors());
app.use(express.json());

// Rota para cadastrar aluno
app.post('/api/alunos', async (req, res) => {
    const { nome, dataNascimento, telefone, email } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO alunos (nome, data_nascimento, telefone, email) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, dataNascimento, telefone, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar aluno' });
    }
});

// Rota para listar alunos
app.get('/api/alunos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alunos ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar alunos' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
