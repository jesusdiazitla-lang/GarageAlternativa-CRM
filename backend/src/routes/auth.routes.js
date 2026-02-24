// ============================================
// auth.routes.js
// ============================================

const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// POST /api/auth/login
router.post('/login', AuthController.login);

// POST /api/auth/register
router.post('/register', AuthController.register);

// GET /api/auth/me  (protegida)
router.get('/me', verificarToken, AuthController.me);

module.exports = router;