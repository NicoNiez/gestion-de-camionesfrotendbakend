// routes/acompananteRoutes.js
const express = require('express');
const router = express.Router();
const acompananteController = require('../controllers/acompananteController.js');
const authMiddleware = require('../middleware/auth.js');

// GET para todos los acompañantes
router.get('/', authMiddleware, acompananteController.getAcompanantes); // <--- Línea 11

// GET para un acompañante por ID
router.get('/:id', authMiddleware, acompananteController.getAcompanante);

// POST para crear un acompañante
router.post('/', authMiddleware, acompananteController.createAcompanante);

// PUT para actualizar un acompañante
router.put('/:id', authMiddleware, acompananteController.updateAcompanante);

// DELETE para eliminar un acompañante
router.delete('/:id', authMiddleware, acompananteController.deleteAcompanante);

module.exports = router;