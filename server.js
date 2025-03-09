const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

// Inicializando o Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o PostgreSQL
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'cadastro_alunos',
    password: 'impacta',
    port: 5432
});
client.connect();

// Rota para servir o HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rota para cadastrar o aluno
app.post('/cadastro', (req, res) => {
    const { nome, data_nascimento, telefone, email } = req.body;

    // Inserindo os dados no banco
    const query = 'INSERT INTO alunos (nome, data_nascimento, telefone, email) VALUES ($1, $2, $3, $4)';
    const values = [nome, data_nascimento, telefone, email];

    client.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Erro ao cadastrar aluno');
        } else {
            res.send('Aluno cadastrado com sucesso!');
        }
    });
});

// Iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
