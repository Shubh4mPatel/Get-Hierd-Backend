const messages = require("../common/messages");

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
        
    }
}

module.exports = headerValidator;