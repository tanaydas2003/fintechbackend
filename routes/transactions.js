// routes/transactions.js

const express = require('express');
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  getTransactionTrends, // Import the getTransactionTrends function
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /transactions/trends - Fetch transaction trends over time
router.get('/trends', authMiddleware, getTransactionTrends);

// GET /transactions - Fetch transactions with filters and pagination
router.get('/', authMiddleware, getTransactions);

// GET /transactions/:id - Fetch a transaction by ID
router.get('/:id', authMiddleware, getTransactionById);

// POST /transactions - Create a new transaction
router.post('/', authMiddleware, createTransaction);

module.exports = router;
