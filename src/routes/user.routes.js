const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { validateRequest } = require('../middleware/validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const followController = require('../controllers/follow.controller');

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

// ----------------FOLLOW USER----------------

// Follow/unfollow a user
router.post('/follow', authMiddleware, followController.toggleFollow);

// Get followers of a user 
router.get('/:userId/followers', authMiddleware, followController.getFollowers);

// Get following of a user
router.get('/:userId/following', authMiddleware, followController.getFollowing);


module.exports = router;