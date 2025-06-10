const express = require("express");
const router = express.Router();
const headerValidator = require("../../middleware/headerValidator");

router.use('/', headerValidator.validateApiKey);
router.use('/', headerValidator.validateAuthToken);

module.exports = router;