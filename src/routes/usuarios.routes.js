// Camada de rotas: associa cada metodo HTTP a funcao correspondente do controller.

const express = require('express');
const controller = require('../controllers/usuarios.controller');

const router = express.Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.post('/', controller.criar);
router.put('/:id', controller.substituir);
router.patch('/:id', controller.atualizarParcial);
router.delete('/:id', controller.remover);

module.exports = router;
