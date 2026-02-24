// ============================================
// cliente.routes.js
// ============================================

const router = require('express').Router();
const ClienteController = require('../controllers/cliente.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Todas las rutas de clientes requieren autenticación
router.use(verificarToken);

// GET    /api/clientes         - Listar todos (con ?buscar=término)
// POST   /api/clientes         - Crear cliente
// GET    /api/clientes/:id     - Obtener cliente con sus vehículos
// PUT    /api/clientes/:id     - Actualizar cliente
// DELETE /api/clientes/:id     - Eliminar cliente (soft delete)

router.get('/',     ClienteController.getAll);
router.post('/',    ClienteController.create);
router.get('/:id',  ClienteController.getById);
router.put('/:id',  ClienteController.update);
router.delete('/:id', ClienteController.delete);

module.exports = router;