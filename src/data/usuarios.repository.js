// Camada de dados: simula a persistencia usando um array em memoria.
// Ao reiniciar o servidor os registros sao perdidos e o id volta a contar do 1.

const usuarios = [];
let proximoId = 1;

function listarTodos() {
  return usuarios;
}

function buscarPorId(id) {
  return usuarios.find((usuario) => usuario.id === id);
}

function criar({ nome, email }) {
  const usuario = { id: proximoId++, nome, email };
  usuarios.push(usuario);
  return usuario;
}

// Aplica somente os campos recebidos, mantendo os demais intactos
function atualizar(id, dados) {
  const usuario = buscarPorId(id);

  if (!usuario) {
    return null;
  }

  if (dados.nome !== undefined) {
    usuario.nome = dados.nome;
  }

  if (dados.email !== undefined) {
    usuario.email = dados.email;
  }

  return usuario;
}

function remover(id) {
  const indice = usuarios.findIndex((usuario) => usuario.id === id);

  if (indice === -1) {
    return false;
  }

  usuarios.splice(indice, 1);
  return true;
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  remover,
};
