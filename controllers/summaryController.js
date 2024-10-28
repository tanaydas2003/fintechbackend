const Transaction = require('../models/Transaction');
exports.getSummary = async (req, res, next) => {
  try {
    const [summary] = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalVolume: {
            $sum: {
              $cond: [
                { $eq: ["$status", "successful"] },
                "$amount",
                0,
              ],
            },
          },
          averageAmount: {
            $avg: {
              $cond: [
                { $eq: ["$status", "successful"] },
                "$amount",
                null,
              ],
            },
          },
          totalTransactions: { $count: {} },
          successCount: {
            $sum: { $cond: [{ $eq: ["$status", "successful"] }, 1, 0] },
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    next(err);
  }
};
