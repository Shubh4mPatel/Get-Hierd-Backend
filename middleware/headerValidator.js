const messages = require("../common/messages");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const headerValidator = {
    sendResponse: async (res, code, messageKey, data) => {
        const message = messages[messageKey] || messageKey;
        const response = {
            code,
            message,
            data
        }

        res.status(code);
        res.send(response);
    },

    validateApiKey: async (req, res, next) => {
        try {
            const apiKey = req.headers["api-key"] || "";
            if (apiKey != "") {
                if (api == process.env.API_KEY) {
                    next();
                }
                else {
                    await headerValidator.sendResponse(res, 401, "INVALID_API_KEY", null);
                }
            }
        } catch (error) {
            console.error("API Key validation error:", error);
            await headerValidator.sendResponse(res, 500, "INTERNAL_SERVER_ERROR", null);
        }
    },

    validateAuthToken: async (req, res, next) => {
        try {
            const authToken = req.headers['authorization'] || "";
            if (authToken != "") {
                const token = authToken.split(" ")[1];
                if (token) {
                    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                        if (err) {
                            return headerValidator.sendResponse(res, 401, "INVALID_AUTH_TOKEN", null);
                        }
                        req.user = decoded;
                        next();
                    });
                } else {
                    await headerValidator.sendResponse(res, 401, "MISSING_AUTH_TOKEN", null);
                }
            } else {
                await headerValidator.sendResponse(res, 401, "MISSING_AUTH_TOKEN", null);
            }
        } catch (error) {
            console.error("Auth token validation error:", error);
            await headerValidator.sendResponse(res, 500, "INTERNAL_SERVER_ERROR", null);
        }

    },

    getRefreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken === "") {
                return headerValidator.sendResponse(res, 401, "MISSING_REFRESH_TOKEN", null);
            }
            const { rows: userRefreshToken } = await db.query("SELECT * FROM users WHERE refresh_token = $1", [refreshToken]);
            if (userRefreshToken.length === 0) {
                return headerValidator.sendResponse(res, 401, "REFRESH_TOKEN_NOT_FOUND", null);
            }
            if (refreshToken == userRefreshToken.refreshToken) {
                jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
                    if (err) {
                        return headerValidator.sendResponse(res, 401, "INVALID_REFRESH_TOKEN", null);
                    }
                    req.refreshUser = decoded;
                    next();
                });
            } else {
                await headerValidator.sendResponse(res, 401, "INVALID_REFRESH_TOKEN", null);
            }
        } catch (error) {
            console.error("Refresh token validation error:", error);
            await headerValidator.sendResponse(res, 500, "INTERNAL_SERVER_ERROR", null);
        }
    }
}

module.exports = headerValidator;