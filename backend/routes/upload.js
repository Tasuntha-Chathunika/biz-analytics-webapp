const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');

// අප්ලෝඩ් කරන ෆයිල් එක 'csvFile' කියන නමින් බාරගන්නවා
router.post('/', uploadMiddleware.single('csvFile'), uploadController.processCSV);

module.exports = router;
