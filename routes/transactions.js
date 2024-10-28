const express = require('express');
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  getTransactionTrends, 
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/trends', authMiddleware, getTransactionTrends);

router.get('/', authMiddleware, getTransactions);

router.get('/:id', authMiddleware, getTransactionById);

router.post('/', authMiddleware, createTransaction);

module.exports = router;
