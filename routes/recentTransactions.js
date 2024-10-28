const express = require('express');
const { getRecentTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authMiddleware, getRecentTransactions);

module.exports = router;
