// ============================================
// alerta.routes.js
// ============================================

const router = require('express').Router();
const AlertaController = require('../controllers/alerta.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

// GET   /api/alertas              - Listar todas
// GET   /api/alertas/pendientes   - Solo pendientes (para badge en UI)
// PATCH /api/alertas/:id/leer     - Marcar como leída
// POST  /api/alertas/generar      - Ejecutar generación manual

router.get('/',                   AlertaController.getAll);
router.get('/pendientes',         AlertaController.getPendientes);
router.patch('/:id/leer',         AlertaController.marcarLeida);
router.post('/generar',           AlertaController.generarAutomaticas);

module.exports = router;