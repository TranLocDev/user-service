const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { validateRequest } = require('../middleware/validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const registerValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('fullname')
    .notEmpty().withMessage('Fullname is required')
    .isLength({ min: 3 }).withMessage('Fullname must be at least 3 characters long')
];

router.post('/register', registerValidation, validateRequest, userController.register);
router.get('/profile', authMiddleware, userController.getProfile);
router.patch('/profile', authMiddleware, upload.single('file'), userController.updateProfile);
// routes/user.routes.js
router.post('/list', userController.getListUserByIds);

module.exports = router; 