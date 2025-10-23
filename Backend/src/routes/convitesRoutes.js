const express = require('express');
const router = express.Router();
const convitesController = require('../controllers/convitesController');

// POST /api/convites - Criar novo convite
router.post('/convites', convitesController.criarConvite);

// GET /api/convites/:qrCode - Validar convite
router.get('/convites/:qrCode', convitesController.validarConvite);

// PATCH /api/convites/:qrCode/utilizar - Marcar como utilizado
router.patch('/convites/:qrCode/utilizar', convitesController.utilizarConvite);

module.exports = router;