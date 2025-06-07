const express = require("express");
const router = express.Router();
const headerValidator = require("../../middleware/headerValidator");

router.use('/', headerValidator.validateApiKey);

module.exports = router;