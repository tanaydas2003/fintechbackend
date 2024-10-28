const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

// Temporary user for demonstration
const user = {
  id: "123",
  username: "testuser",
  password: "password123"
};

// Hardcoded JWT secret for testing
const JWT_SECRET = "vite123";  // Replace with your chosen secret

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are correct
  if (username === user.username && password === user.password) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,  // Use the hardcoded secret here
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
