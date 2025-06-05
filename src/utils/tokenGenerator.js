const appError = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

class Token {
    constructor() {
        this.accessSecretKey = process.env.JWT_ACCESS_SECRET_KEY;
        this.refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
        this.accessExpirationTime = process.env.JWT_ACCESS_EXPIRATION_TIME;
        this.refreshExpirationTime = process.env.JWT_REFRESH_EXPIRATION_TIME;
    }

    generateAcessToken(payLoad) {
        const token = jwt.sign(payLoad, this.accessSecretKey, { expiresIn: this.accessExpirationTime });
        return token;
    }

    refreshToken(payLoad) {
        const token = jwt.sign(payLoad, this.refreshSecretKey, { expiresIn: this.refreshExpirationTime });
        return token;
    }

    verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, this.accessSecretKey);
            return decoded;
        } catch (err) {
            throw new appError('Invalid access token', 401);
        }
    }
    verifyRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, this.refreshSecretKey);
            return decoded;
        } catch (err) {
            throw new appError('Invalid refresh token', 401);
        }
    }

}

module.exports = Token;