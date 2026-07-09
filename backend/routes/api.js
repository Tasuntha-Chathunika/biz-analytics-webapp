const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const analyticsController = require('../controllers/analyticsController');
const salesController = require('../controllers/salesController');
const authController = require('../controllers/authController');
const { authenticateUser, restrictTo } = require('../middleware/authMiddleware');

// Multer setup for temporary storage before processing
const upload = multer({ dest: 'uploads/' });

// Auth routes (Public)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateUser, authController.getProfile);

// Analytics routes (Authenticated)
router.get('/analytics/kpi', authenticateUser, analyticsController.getKPIs);
router.get('/analytics/monthly-trend', authenticateUser, analyticsController.getMonthlyTrend);

// Restricted Analytics (Admin and Manager only)
router.get('/analytics/regional-sales', authenticateUser, restrictTo('admin', 'manager'), analyticsController.getRegionalSales);
router.get('/analytics/category-sales', authenticateUser, restrictTo('admin', 'manager'), analyticsController.getCategorySales);
router.get('/analytics/top-products', authenticateUser, restrictTo('admin', 'manager'), analyticsController.getTopProducts);

// Sales record management
router.get('/sales', authenticateUser, restrictTo('admin', 'manager'), salesController.getSales);
router.delete('/sales/:id', authenticateUser, restrictTo('admin'), salesController.deleteSale);
router.delete('/sales', authenticateUser, restrictTo('admin'), salesController.clearSales);

// Ingestion (Admin only)
router.post('/upload', authenticateUser, restrictTo('admin'), upload.single('file'), uploadController.uploadCSV);

// Recent transactions for dashboard widget (any authenticated user)
router.get('/sales/recent', authenticateUser, salesController.getRecentTransactions);

module.exports = router;
