const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/s3.controller');
const upload = require('../middleware/s3.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validator');

const deleteImageValidation = [
  body('imageUrl')
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Invalid image URL format')
];

router.post('/upload', authMiddleware, upload.single('file'), uploadController.uploadFile);
router.delete('/delete', authMiddleware, deleteImageValidation, validateRequest, uploadController.deleteImage);

module.exports = router; 