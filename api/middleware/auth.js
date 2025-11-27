const jwt = require('jsonwebtoken');
const { getPool } = require('../config/database');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Authorization header must be: Bearer <token>' 
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify user still exists in database
      const pool = getPool();
      const [users] = await pool.execute(
        'SELECT id, email, full_name, created_at FROM users WHERE id = ?',
        [decoded.userId]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      req.user = users[0];
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Token expired' 
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token' 
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

module.exports = { requireAuth };

