const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateUser, restrictTo } = require('../middleware/authMiddleware');

// Analytics routes (Authenticated)
router.get('/kpi', authenticateUser, analyticsController.getKPIs);
router.get('/monthly-trend', authenticateUser, analyticsController.getMonthlyTrend);

// Restricted Analytics (Admin and Manager only)
router.get('/regional-sales', authenticateUser, analyticsController.getRegionalSales);
router.get('/category-sales', authenticateUser, analyticsController.getCategorySales);
router.get('/top-products', authenticateUser, analyticsController.getTopProducts);

module.exports = router;
