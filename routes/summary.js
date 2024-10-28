const express = require('express');
const { getSummary } = require('../controllers/summaryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /summary - Get transaction summary metrics
router.get('/', authMiddleware, getSummary);

module.exports = router;
