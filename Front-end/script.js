// Array para armazenar os alunos cadastrados
const alunos = [];

// Captura o evento de envio do formulário
document.getElementById("cadastroForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Pegar os valores dos campos
    const nome = document.getElementById("nome").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    // Salvar os dados em um objeto e adicionar ao array
    const aluno = {
        nome,
        dataNascimento,
        telefone,
        email
    };

    alunos.push(aluno);

    alunos.sort((a, b) => a.nome.localeCompare(b.nome));

    // Exibir mensagem de sucesso
    document.getElementById("mensagem").innerText = `Aluno cadastrado com sucesso! 
        Nome: ${nome}
        Data de Nascimento: ${dataNascimento}
        Telefone: ${telefone}
        Email: ${email}`;

         // Limpar os campos do formulário
    document.getElementById("cadastroForm").reset();
});

// Evento para abrir a lista de alunos em uma nova aba
document.getElementById("abrirLista").addEventListener("click", function() {
    // Criar uma nova aba e abrir a página HTML da lista de alunos
    const novaAba = window.open();
    novaAba.document.write(`
        <html>
            <head>
                <title>Lista de Alunos</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        padding: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        padding: 10px;
                        border-bottom: 1px solid #ddd;
                        text-align: left;
                    }
                    th {
                        background-color: #ff9800;
                        color: white;
                    }
                    tr:hover {
                        background-color: #f1f1f1;
                    }
                </style>
            </head>
            <body>
                <h2>Lista de Alunos Cadastrados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Data de Nascimento</th>
                            <th>Telefone</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${alunos.map(aluno => `
                            <tr>
                                <td>${aluno.nome}</td>
                                <td>${aluno.dataNascimento}</td>
                                <td>${aluno.telefone}</td>
                                <td>${aluno.email}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `);
});
