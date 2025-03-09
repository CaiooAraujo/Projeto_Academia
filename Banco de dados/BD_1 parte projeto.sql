CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

INSERT INTO alunos (nome) VALUES ('André Ferreira'), ('Carlos Silva'), ('Flavia Souza'), ('Mariana Costa');

CREATE TABLE treinos (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id),
    exercicio TEXT,
    repeticoes INT,
    carga INT
);