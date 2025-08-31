import { Request, Response } from 'express';
const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../database/connection');

const SALT_ROUNDS = 12;
const DUPLICATE_KEY_ERROR_CODE = '23505';
const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const trimmedEmail = email?.trim();
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();

    // Basic validation
    if (!trimmedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password length check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    // Save to database
    const sql = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, is_verified, created_at
    `;

    const result = await query(sql, [
      trimmedEmail,
      passwordHash,
      trimmedFirstName,
      trimmedLastName,
    ]);

    return res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
    });
  } catch (error: unknown) {
    console.error('Signup error:', error);

    // Handle duplicate email
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === DUPLICATE_KEY_ERROR_CODE
    ) {
      const pgError = error as any;
      if (pgError.constraint === 'users_email_key') {
        return res
          .status(409)
          .json({ error: 'User with this email already exists' });
      }
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email?.trim();

    // Basic validation
    if (!trimmedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const sql = 'SELECT * FROM users WHERE email = $1';
    const result = await query(sql, [trimmedEmail]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user info (without password hash)
    const { password_hash, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
