// Importa o módulo de conexão com o banco de dados
const conexao = require("../db");

// Função controller para realizar o cadastro de novos usuários
function cadastrar(req, res) {

    // Extrai o email e a senha enviados no corpo (body) da requisição HTTP
    const { email, senha } = req.body;

    // Instrução SQL usando placeholders (?) para evitar ataques de SQL Injection
    const sql = `
    INSERT INTO usuarios (email, senha)
    VALUES (?, ?)
    `;

    // Executa a instrução SQL no banco de dados passando os parâmetros [email, senha]
    conexao.query(sql, [email, senha], (erro, resultado) => {

        // Tratamento de erro caso a execução do SQL falhe
        if (erro) {
            console.log(erro);

            // Retorna status HTTP 500 (Internal Server Error) com uma mensagem em JSON
            return res.status(500).json({
                mensagem: "Erro ao cadastrar usuário."
            });
        }

        // Retorna status HTTP 201 (Created) indicando sucesso no cadastro
        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!"
        });

    });

}

// Exporta a função 'cadastrar' para poder ser utilizada pelas rotas do Express
module.exports = {
    cadastrar
};