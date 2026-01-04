const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');

// Validation pour l'inscription
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
];

// Validation pour la connexion
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes publiques
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);

// Route pour vérification inter-services (accessible sans auth stricte)
router.get('/:id', userController.getUserById);

// Routes protégées (nécessitent authentification)
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.delete('/profile', authenticate, userController.deleteAccount);
router.post('/password', authenticate, userController.changePassword);

module.exports = router;
