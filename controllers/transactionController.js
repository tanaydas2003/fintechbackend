const Transaction = require('../models/Transaction');

// GET /transactions - Fetch paginated transaction data with filters
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, dateRange, type, status } = req.query;
    const filter = {};

    // Filter by transaction type
    if (type) filter.type = type;

    // Filter by transaction status
    if (status) filter.status = status;

    // Filter by date range
    if (dateRange) {
      const [start, end] = dateRange.split(',');
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }

    // Fetch transactions with pagination
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Count total transactions for pagination info
    const totalTransactions = await Transaction.countDocuments(filter);

    // Return transactions along with pagination info
    res.json({
      totalTransactions,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTransactions / limit),
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

// GET /transactions/:id - Retrieve transaction details by ID
exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

// GET /recent-transactions - Fetch the latest transactions in real-time
exports.getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(10); // Example limit, modify as needed
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

// POST /transactions - Create a new transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, date, type, status } = req.body;

    // Validate required fields
    if (!amount || !date || !type || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create and save new transaction
    const transaction = new Transaction({
      amount,
      date: new Date(date),
      type,
      status,
    });
    await transaction.save();

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};


// GET /transactions/trends - Fetch transaction trends over time
exports.getTransactionTrends = async (req, res, next) => {
  try {
    const trends = await Transaction.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(trends);
  } catch (err) {
    next(err);
  }
};
