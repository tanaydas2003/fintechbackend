const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const transactionsRoute = require('./routes/transactions');
const summaryRoute = require('./routes/summary');
const recentTransactionsRoute = require('./routes/recentTransactions');
const errorLogger = require('./middleware/errorLogger');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

// Connect to database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/transactions', transactionsRoute);
app.use('/api/summary', summaryRoute);
app.use('/api/recent-transactions', recentTransactionsRoute);
app.use('/api', authRoutes);



// Error logging middleware
app.use(errorLogger);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
