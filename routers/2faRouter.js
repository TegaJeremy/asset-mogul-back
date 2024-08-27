const express = require('express');
const router = express.Router();
const authController = require('../controllers/2faAutentation');

// Routes
router.get('/QrCODE', authController.getQRCodePage);
router.get('/code', authController.getQRCodeData);
router.post('/verify', express.urlencoded({ extended: true }), authController.verifyToken);


module.exports = router;
