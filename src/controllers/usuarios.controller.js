// Camada de regras: valida os dados recebidos e define o status HTTP da resposta.

const repositorio = require('../data/usuarios.repository');

const ERRO_NOME = 'O campo nome é obrigatório.';
const ERRO_EMAIL = 'O campo e-mail é obrigatório.';
const ERRO_NAO_ENCONTRADO = 'Usuário não encontrado';

// GET /usuarios
function listar(req, res) {
  return res.status(200).json(repositorio.listarTodos());
}

// GET /usuarios/:id
function buscar(req, res) {
  const usuario = repositorio.buscarPorId(Number(req.params.id));

  if (!usuario) {
    return res.status(404).json({ error: ERRO_NAO_ENCONTRADO });
  }

  return res.status(200).json(usuario);
}

// POST /usuarios
function criar(req, res) {
  const { nome, email } = req.body || {};

  if (!nome) {
    return res.status(400).json({ error: ERRO_NOME });
  }

  if (!email) {
    return res.status(400).json({ error: ERRO_EMAIL });
  }

  const usuario = repositorio.criar({ nome, email });

  return res.status(201).json({ data: usuario });
}

// PUT /usuarios/:id - substituicao completa, exige todos os campos
function substituir(req, res) {
  const { nome, email } = req.body || {};

  if (!nome) {
    return res.status(400).json({ error: ERRO_NOME });
  }

  if (!email) {
    return res.status(400).json({ error: ERRO_EMAIL });
  }

  const usuario = repositorio.atualizar(Number(req.params.id), { nome, email });

  if (!usuario) {
    return res.status(404).json({ error: ERRO_NAO_ENCONTRADO });
  }

  return res.status(200).json({ data: usuario });
}

// PATCH /usuarios/:id - atualizacao parcial, aceita um campo ou outro
function atualizarParcial(req, res) {
  const { nome, email } = req.body || {};

  if (nome === undefined && email === undefined) {
    return res.status(400).json({ error: 'Informe ao menos um campo para atualizar.' });
  }

  if (nome !== undefined && !nome) {
    return res.status(400).json({ error: ERRO_NOME });
  }

  if (email !== undefined && !email) {
    return res.status(400).json({ error: ERRO_EMAIL });
  }

  const usuario = repositorio.atualizar(Number(req.params.id), { nome, email });

  if (!usuario) {
    return res.status(404).json({ error: ERRO_NAO_ENCONTRADO });
  }

  return res.status(200).json({ data: usuario });
}

// DELETE /usuarios/:id - responde 204 sem corpo quando remove com sucesso
function remover(req, res) {
  const removido = repositorio.remover(Number(req.params.id));

  if (!removido) {
    return res.status(404).json({ error: ERRO_NAO_ENCONTRADO });
  }

  return res.status(204).send();
}

module.exports = {
  listar,
  buscar,
  criar,
  substituir,
  atualizarParcial,
  remover,
};
