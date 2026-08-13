const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Permite receber JSON no corpo das requisicoes
app.use(express.json());

// "Banco de dados" em memoria
const usuarios = [];
let proximoId = 1;

// POST /usuarios - cria um novo usuario
app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body || {};

  if (!nome) {
    return res.status(400).json({ error: 'O campo nome é obrigatório.' });
  }

  if (!email) {
    return res.status(400).json({ error: 'O campo e-mail é obrigatório.' });
  }

  const usuario = { id: proximoId++, nome, email };
  usuarios.push(usuario);

  return res.status(201).json({ data: usuario });
});

// GET /usuarios - lista todos os usuarios
app.get('/usuarios', (req, res) => {
  return res.status(200).json(usuarios);
});

// GET /usuarios/:id - busca um usuario pelo id
app.get('/usuarios/:id', (req, res) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  return res.status(200).json(usuario);
});

const servidor = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

servidor.on('error', (erro) => {
  if (erro.code === 'EADDRINUSE') {
    console.error(`A porta ${PORT} ja esta em uso. Use: PORT=3001 node server.js`);
  } else {
    console.error(erro);
  }
  process.exit(1);
});
