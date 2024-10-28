const express = require('express');
const { getSummary } = require('../controllers/summaryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authMiddleware, getSummary);

module.exports = router;
