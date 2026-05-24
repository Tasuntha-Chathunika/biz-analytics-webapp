const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const analyticsController = require('../controllers/analyticsController');

// Multer setup for temporary storage before processing
const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/upload', upload.single('file'), uploadController.uploadCSV);
router.get('/analytics/kpi', analyticsController.getKPIs);
router.get('/analytics/regional-sales', analyticsController.getRegionalSales);
router.get('/analytics/monthly-trend', analyticsController.getMonthlyTrend);

module.exports = router;
