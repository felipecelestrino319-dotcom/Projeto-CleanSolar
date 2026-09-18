// Importa o framework Express para gerenciar as rotas da aplicação
const express = require("express");

// Cria um roteador do Express para definir os endpoints da API
const router = express.Router();

// Importa a conexão com o banco de dados MySQL configurada no arquivo db.js
const conexao = require("./db");

// ==========================================
// ROTA 1: Cadastro de Usuário (POST /cadastro)
// Recebe email, senha e a localização fixa de criação da conta
// ==========================================
router.post("/cadastro", (req, res) => {
  // Extrai os dados do corpo da requisição (body)
  const { email, senha, localizacao } = req.body;

  // Validação: Verifica se o e-mail e a senha foram enviados
  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios"
    });
  }

  // Instrução SQL para inserir um novo registro na tabela 'usuarios'
  const sql = "INSERT INTO usuarios (email, senha, localizacao) VALUES (?, ?, ?)";

  // Executa a consulta no MySQL passando os parâmetros de forma segura (PreparedStatement)
  conexao.query(sql, [email, senha, localizacao || "Não informada"], (erro, resultado) => {
    // Trata eventuais erros durante a gravação no banco de dados
    if (erro) {
      console.log(erro);
      return res.status(500).json({
        mensagem: "Erro ao cadastrar usuário"
      });
    }

    // Retorna resposta de sucesso (Status 201 - Criado) com o ID gerado no MySQL
    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      id: resultado.insertId
    });
  });
});

// ==========================================
// ROTA 2: Autenticação de Login (POST /login)
// Verifica se o e-mail e a senha coincidem com o registro no banco
// ==========================================
router.post("/login", (req, res) => {
  // Extrai o e-mail e a senha enviados pelo formulário/app
  const { email, senha } = req.body;

  // Validação dos campos obrigatórios
  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios"
    });
  }

  // Instrução SQL para buscar um usuário com as credenciais informadas
  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

  // Executa a busca no banco de dados
  conexao.query(sql, [email, senha], (erro, resultados) => {
    // Trata erros internos do servidor ou de conexão com a base
    if (erro) {
      console.log(erro);
      return res.status(500).json({
        mensagem: "Erro interno no servidor"
      });
    }

    // Se a consulta retornar um array vazio, as credenciais estão incorretas
    if (resultados.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos"
      });
    }

    // Retorna os dados do usuário autenticado (omitindo dados sensíveis como a senha na resposta)
    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: resultados[0].id,
        email: resultados[0].email
      }
    });
  });
});

// ==========================================
// ROTA 3: Buscar Perfil (GET /perfil/:id)
// Retorna e-mail, foto e a localização fixa de cadastro por ID
// ==========================================
router.get("/perfil/:id", (req, res) => {
  // Captura o ID fornecido como parâmetro na URL (ex: /perfil/1)
  const { id } = req.params;

  // Consulta no MySQL que seleciona apenas os campos necessários do perfil
  const sql = "SELECT id, email, foto, localizacao FROM usuarios WHERE id = ?";

  // Executa a consulta
  conexao.query(sql, [id], (erro, resultado) => {
    // Trata erro de execução na base de dados
    if (erro) return res.status(500).json({ mensagem: "Erro ao buscar perfil" });

    // Verifica se nenhum usuário foi localizado com o ID informado
    if (resultado.length === 0) return res.status(404).json({ mensagem: "Usuário não encontrado" });

    // Retorna o objeto com os dados do perfil localizado
    res.json(resultado[0]);
  });
});

// ==========================================
// ROTA 4: Atualizar Foto de Perfil (PUT /perfil/:id/foto)
// Atualiza exclusivamente o campo de foto do usuário indicado
// ==========================================
router.put("/perfil/:id/foto", (req, res) => {
  // Obtém o ID do usuário através do parâmetro de rota
  const { id } = req.params;

  // Obtém os dados da nova foto (ex: string Base64 ou URL) enviados no corpo da requisição
  const { foto } = req.body;

  // Validação: Confere se o dado da foto foi enviado
  if (!foto) {
    return res.status(400).json({ mensagem: "A foto é obrigatória" });
  }

  // Instrução SQL de atualização do campo foto para o usuário especificado
  const sql = "UPDATE usuarios SET foto = ? WHERE id = ?";

  // Executa a instrução de atualização no banco
  conexao.query(sql, [foto, id], (erro, resultado) => {
    // Trata falhas na execução do UPDATE
    if (erro) {
      console.log(erro);
      return res.status(500).json({ mensagem: "Erro ao atualizar foto de perfil" });
    }

    // Retorna confirmação de sucesso
    res.json({ mensagem: "Foto de perfil atualizada com sucesso!" });
  });
});

// Exporta as rotas para que possam ser utilizadas no servidor principal (index.js/server.js)
module.exports = router;