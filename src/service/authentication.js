const db = require('../config/db');
const AppError = require('../utils/errorHandler');
const bcrypt = require('bcrypt');
const Token = require('../utils/tokenGenerator');

class Authentication {

  authenticate(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return next(new AppError('No token provided', 401));
      }

      const tokenChecker = new Token();
      const payload = tokenChecker.verifyAccessToken(token); // Will throw if invalid

      req.userId = payload; // Add user info to request
      next();

    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Token expired', 401));
      } else if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token', 401));
      } else {
        return next(new AppError(err.message, 500));
      }
    }
  }

  async register(req, res, next) {

  }


  async refresh(req, res, next) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401));
    }

    const tokenChecker = new Token();
    try {
      const payload = tokenChecker.verifyRefreshToken(refreshToken); // Will throw if invalid

      const query = 'SELECT * FROM users WHERE id = $1 AND refresh_token = $2';
      const { rows: user } = await db.query(query, [payload.userId, refreshToken]);

      if (user.length === 0) {
        return next(new AppError('User not found', 401));
      }

      const accessToken = tokenChecker.generateAcessToken({ userId: user.id });
      res.json({
        status: 'success',
        accessToken,
        user: {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name
        }
      }).status(200);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Refresh token expired', 401));
      } else if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid refresh token', 401));
      } else {
        return next(new AppError(err.message, 500));
      }
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';

    const { rows: user } = await db.query(query, [email, password]);
    if (user.length === 0) {
      return next(new AppError('User not found', 401));
    }

    const userPassword = user.password;

    if (await bcrypt.compare(password, userPassword)) {
      const token = new Token();
      const accessToken = token.generateAcessToken({ userId: user.id });
      const refreshToken = token.refreshToken({ userId: user.id });
      const query = 'UPDATE users SET refresh_token = $1 WHERE id = $2';
      await db.query(query, [refreshToken, user.id]);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      }).json(
        {
          status: 'success',
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
      ).status(200);
    } else {
      return next(new AppError('Invalid password', 401));
    }
  }

  async logout(req, res) {
    const { userId } = req.body;

    if (!userId) {
      return next(new AppError('User not found', 401));
    }

    const query = 'UPDATE users SET refresh_token = NULL WHERE id = $1';

    await db.query(query, [userId]);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }).json({
      status: 'success',
      message: 'Logged out successfully'
    }).status(200);
  }
}

module.exports = Authentication;