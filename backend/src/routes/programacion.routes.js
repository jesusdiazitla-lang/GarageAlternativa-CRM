// ============================================
// programacion.routes.js
// ============================================

const router = require('express').Router();
const ProgramacionController = require('../controllers/programacion.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

// GET    /api/programaciones                         - Listar todas
// GET    /api/programaciones/proximas?dias=7         - Próximas (para dashboard)
// GET    /api/programaciones/vehiculo/:id_vehiculo   - Por vehículo
// POST   /api/programaciones                         - Crear
// GET    /api/programaciones/:id                     - Obtener por ID
// PUT    /api/programaciones/:id                     - Actualizar
// PATCH  /api/programaciones/:id/estado              - Solo cambiar estado
// DELETE /api/programaciones/:id                     - Eliminar

router.get('/proximas',                    ProgramacionController.getProximas);
router.get('/vehiculo/:id_vehiculo',       ProgramacionController.getByVehiculo);
router.get('/',                            ProgramacionController.getAll);
router.post('/',                           ProgramacionController.create);
router.get('/:id',                         ProgramacionController.getById);
router.put('/:id',                         ProgramacionController.update);
router.patch('/:id/estado',                ProgramacionController.updateEstado);
router.delete('/:id',                      ProgramacionController.delete);

module.exports = router;