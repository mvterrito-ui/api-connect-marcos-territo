// Ponto de entrada: configura o servidor e monta as rotas da aplicacao.

const express = require('express');
const usuariosRoutes = require('./src/routes/usuarios.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Permite receber JSON no corpo das requisicoes
app.use(express.json());

// Todas as rotas do recurso usuarios respondem sob /usuarios
app.use('/usuarios', usuariosRoutes);

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
