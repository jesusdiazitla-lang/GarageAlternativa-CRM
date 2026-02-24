// ============================================
// mantenimiento.routes.js
// ============================================

const router = require('express').Router();
const MantenimientoController = require('../controllers/mantenimiento.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

// GET    /api/mantenimientos                        - Listar todos
// POST   /api/mantenimientos                        - Registrar mantenimiento
// GET    /api/mantenimientos/:id                    - Obtener por ID
// PUT    /api/mantenimientos/:id                    - Actualizar
// DELETE /api/mantenimientos/:id                    - Eliminar
// GET    /api/mantenimientos/vehiculo/:id_vehiculo  - Historial de un vehículo

router.get('/vehiculo/:id_vehiculo', MantenimientoController.getByVehiculo);
router.get('/',      MantenimientoController.getAll);
router.post('/',     MantenimientoController.create);
router.get('/:id',   MantenimientoController.getById);
router.put('/:id',   MantenimientoController.update);
router.delete('/:id', MantenimientoController.delete);

module.exports = router;