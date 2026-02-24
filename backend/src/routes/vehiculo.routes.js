// ============================================
// vehiculo.routes.js
// ============================================

const router = require('express').Router();
const VehiculoController = require('../controllers/vehiculo.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

// GET    /api/vehiculos           - Listar todos (con ?buscar=término)
// POST   /api/vehiculos           - Registrar vehículo
// GET    /api/vehiculos/:id       - Obtener vehículo
// PUT    /api/vehiculos/:id       - Actualizar vehículo
// DELETE /api/vehiculos/:id       - Eliminar vehículo

router.get('/',      VehiculoController.getAll);
router.post('/',     VehiculoController.create);
router.get('/:id',   VehiculoController.getById);
router.put('/:id',   VehiculoController.update);
router.delete('/:id', VehiculoController.delete);

module.exports = router;