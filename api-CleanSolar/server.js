// Importa os módulos necessários do Node.js
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Módulo de conexão com o banco de dados MySQL

// Inicializa o aplicativo Express
const app = express();

// Habilita o CORS (Cross-Origin Resource Sharing) para permitir requisições de outras origens (ex: React Native / Web)
app.use(cors());

// Configura os middlewares para aceitar requisições com corpo JSON e URL Encoded
// O limite de 50mb é ideal para permitir o envio de imagens convertidas em Base64
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==========================================
// ROTA 1: Cadastro de Usuário (POST /usuarios/cadastro)
// Salva e-mail, senha e a localização obtida no momento do registro
// ==========================================
app.post("/usuarios/cadastro", (req, res) => {
  // Extrai os dados enviados no corpo da requisição
  const { email, senha, localizacao } = req.body;

  // Validação: Confere se os campos essenciais foram preenchidos
  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  // Padroniza o e-mail removendo espaços e convertendo para minúsculas
  const emailFormatado = email.trim().toLowerCase();

  // Instrução SQL para inserir o novo registro (coluna 'localicao' no MySQL)
  const sql = "INSERT INTO usuarios (email, senha, localicao) VALUES (?, ?, ?)";

  // Executa a consulta no MySQL de forma segura
  db.query(sql, [emailFormatado, senha, localizacao || null], (err, result) => {
    if (err) {
      // Trata o erro de e-mail duplicado no banco
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ mensagem: "E-mail já cadastrado." });
      }
      console.error("Erro no MySQL ao cadastrar:", err);
      return res.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
    }

    // Retorna a confirmação de criação da conta (Status 201)
    return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  });
});

// ==========================================
// ROTA 2: Login de Usuário (POST /usuarios/login)
// Valida o e-mail e compara a senha cadastrada
// ==========================================
app.post("/usuarios/login", (req, res) => {
  // Extrai e-mail e senha do corpo da requisição
  const { email, senha } = req.body;

  // Validação simples de preenchimento
  if (!email || !senha) {
    return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
  }

  const emailFormatado = email.trim().toLowerCase();
  const sql = "SELECT * FROM usuarios WHERE email = ?";

  // Consulta o banco para encontrar o usuário pelo e-mail
  db.query(sql, [emailFormatado], (err, results) => {
    if (err) {
      console.error("Erro no MySQL ao logar:", err);
      return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }

    // Retorna erro caso o e-mail não seja localizado no banco
    if (!results || results.length === 0) {
      return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
    }

    const usuario = results[0];

    // Valida se a senha informada é idêntica à salva no MySQL
    if (usuario.senha !== senha) {
      return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
    }

    // Retorna a confirmação de login com os dados essenciais do usuário
    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: { 
        id: usuario.id, 
        email: usuario.email, 
        foto: usuario.fotos_de_perfil || null 
      }
    });
  });
});

// ==========================================
// ROTA 3: Buscar Perfil (GET /usuarios/:id)
// Retorna os dados completos do usuário indicado pelo ID
// ==========================================
app.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;

  // Usa 'AS' no SQL para renomear as colunas do MySQL para os nomes esperados na resposta JSON
  const sql = "SELECT id, email, senha, fotos_de_perfil AS foto, localicao AS localizacao FROM usuarios WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar perfil:", err);
      return res.status(500).json({ mensagem: "Erro ao buscar dados do usuário." });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    // Retorna o objeto com as informações do perfil do usuário
    return res.status(200).json(results[0]);
  });
});

// ==========================================
// ROTA 4: Atualizar Foto de Perfil (PUT /usuarios/:id/foto)
// Atualiza exclusivamente a coluna de foto do registro no MySQL
// ==========================================
app.put("/usuarios/:id/foto", (req, res) => {
  const { id } = req.params;
  const { foto } = req.body;

  // Garante que o payload da foto não veio vazio
  if (!foto) {
    return res.status(400).json({ mensagem: "Nenhuma foto foi fornecida." });
  }

  const sql = "UPDATE usuarios SET fotos_de_perfil = ? WHERE id = ?";

  // Atualiza o registro no banco de dados
  db.query(sql, [foto, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar foto no MySQL:", err);
      return res.status(500).json({ mensagem: "Erro ao salvar a foto de perfil." });
    }

    return res.status(200).json({ mensagem: "Foto atualizada com sucesso!" });
  });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});