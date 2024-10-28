const express = require('express');
const { getRecentTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /recent-transactions - Get the latest transactions
router.get('/', authMiddleware, getRecentTransactions);

module.exports = router;
