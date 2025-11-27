const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { getPool } = require('../config/database');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /users/me
router.get('/me', async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        created_at: req.user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /users/me (optional bonus)
const updateProfileValidation = [
  body('full_name').optional().trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required')
];

router.put('/me', updateProfileValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { full_name, email } = req.body;
    const pool = getPool();
    const updates = [];
    const values = [];
    
    if (full_name) {
      updates.push('full_name = ?');
      values.push(full_name);
    }
    
    if (email && email !== req.user.email) {
      // Check if email is already taken
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.id]
      );
      
      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }
      
      updates.push('email = ?');
      values.push(email);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    values.push(req.user.id);
    
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    // Fetch updated user
    const [users] = await pool.execute(
      'SELECT id, email, full_name, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: users[0]
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /users/password (optional bonus)
const changePasswordValidation = [
  body('current_password').notEmpty().withMessage('Current password is required'),
  body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
];

router.patch('/password', changePasswordValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { current_password, new_password } = req.body;
    const pool = getPool();
    
    // Get current password hash
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const bcrypt = require('bcrypt');
    const isValidPassword = await bcrypt.compare(current_password, users[0].password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const saltRounds = 10;
    const new_password_hash = await bcrypt.hash(new_password, saltRounds);
    
    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [new_password_hash, req.user.id]
    );
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

