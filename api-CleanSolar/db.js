// Importa o módulo mysql2 para permitir a comunicação do Node.js com o MySQL
const mysql = require("mysql2");

// Cria a configuração de conexão com as credenciais do banco de dados
const conexao = mysql.createConnection({
    host: "localhost",      // Endereço do servidor MySQL (local)
    user: "root",           // Nome do usuário do banco de dados
    password: "Fe281109*",   // Senha de acesso ao MySQL
    database: "CleanSolar"  // Nome do banco de dados que será utilizado
});

// Tenta estabelecer a conexão com o banco de dados MySQL
conexao.connect((erro) => {
    // Trata a resposta de erro caso ocorra falha ao tentar conectar
    if(erro) {
        console.log("Erro ao conectar", erro);
        return;
    }

    // Exibe mensagem de sucesso no terminal quando a conexão é estabelecida
    console.log("Banco de dados conectados");
});

// Exporta o objeto de conexão para ser reutilizado nos controllers/rotas da aplicação
module.exports = conexao;