const express = require('express');
const router = express.Router();
const conductorController = require('../controllers/conductorController.js');
const authMiddleware = require('../middleware/auth.js');  // Importa el middleware de autenticación

// Rutas para conductores
router.get('/', authMiddleware, conductorController.getConductores);
router.get('/:numero_conductor', authMiddleware, conductorController.getConductor);
router.post('/', authMiddleware, conductorController.createConductor);
router.put('/:numero_conductor', authMiddleware, conductorController.updateConductor);
router.delete('/:numero_conductor', authMiddleware, conductorController.deleteConductor);

module.exports = router;