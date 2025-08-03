  // /routes/cargaRoutes.js
const express = require('express');
const router = express.Router();
const cargaController = require('../controllers/cargaController.js');
const authMiddleware = require('../middleware/auth.js');

// Rutas para cargas

// Nota: Ya no es necesario poner '/cargas' en las rutas, ya está definido en app.js
router.post('/',authMiddleware, cargaController.createCarga);
router.get('/:id',authMiddleware, cargaController.getCarga);
router.get('/',authMiddleware,cargaController.getCargas);
router.delete('/:id', authMiddleware,cargaController.deleteCarga);
router.put('/:id',authMiddleware, cargaController.updateCarga);

module.exports = router;
