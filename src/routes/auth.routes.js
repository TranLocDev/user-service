const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validator');
const { authMiddleware } = require('../middleware/auth.middleware');

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required')
];

router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/refresh-token', refreshTokenValidation, validateRequest, authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router; 