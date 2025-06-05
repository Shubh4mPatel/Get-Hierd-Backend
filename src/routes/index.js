const express = require('express');
const auth= require('./auth'); // Assuming auth.js is in the same directory
const router = express.Router();

router.use('auth',auth);


module.exports = router;

