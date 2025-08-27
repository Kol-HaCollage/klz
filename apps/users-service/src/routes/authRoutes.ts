const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../database/connection');
const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req: any, res: any) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password length check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save to database
    const sql = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, is_verified, created_at
    `;

    const result = await query(sql, [email, passwordHash, firstName, lastName]);

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
    });
  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle duplicate email
    if (error.code === '23505' && error.constraint === 'users_email_key') {
      return res
        .status(409)
        .json({ error: 'User with this email already exists' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login

router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const sql = 'SELECT * FROM users WHERE email = $1';
    const result = await query(sql, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log(
      'Found user:',
      user.email,
      'hash length:',
      user.password_hash?.length
    );

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user info (without password hash)
    const { password_hash: _passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
