const Transaction = require('../models/Transaction');

// GET /transactions 
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, dateRange, type, status } = req.query;
    const filter = {};

    if (type) filter.type = type;

    if (status) filter.status = status;

    if (dateRange) {
      const [start, end] = dateRange.split(',');
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }

    const transactions = await Transaction.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalTransactions = await Transaction.countDocuments(filter);

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
// GET /transactions/:id
exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};
// GET /recent-transactions
exports.getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(10); 
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

// POST /transactions 
exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, date, type, status } = req.body;

    if (!amount || !date || !type || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
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


// GET /transactions/trends 
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
