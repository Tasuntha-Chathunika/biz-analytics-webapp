const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { authenticateUser, restrictTo } = require('../middleware/authMiddleware');

// Recent transactions for dashboard widget (any authenticated user)
router.get('/recent', authenticateUser, salesController.getRecentTransactions);

// Sales record management
router.get('/', authenticateUser, restrictTo('admin', 'manager'), salesController.getSales);
router.delete('/:id', authenticateUser, restrictTo('admin'), salesController.deleteSale);
router.delete('/', authenticateUser, restrictTo('admin'), salesController.clearSales);

module.exports = router;
