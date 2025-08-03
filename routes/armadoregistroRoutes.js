const express = require('express');
const router = express.Router();
const armadoregistroController = require('../controllers/armadoregistroController.js');
const authMiddleware = require('../middleware/auth.js');  // Importa el middleware de autenticación

// Rutas para registros de armado
router.get('/', authMiddleware, armadoregistroController.getArmadoRegistros);
router.get('/:id', authMiddleware, armadoregistroController.getArmadoRegistro);
router.post('/', authMiddleware, armadoregistroController.createArmadoRegistro);
router.put('/:id', authMiddleware, armadoregistroController.updateArmadoRegistro);
router.delete('/:id', authMiddleware, armadoregistroController.deleteArmadoRegistro);

module.exports = router;
