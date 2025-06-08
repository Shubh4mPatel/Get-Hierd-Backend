const express = require("express");
const router = express.Router();
const headerValidator = require("../../middleware/headerValidator");

router.use('/api/v1', headerValidator.validateApiKey,routes);

module.exports = router;