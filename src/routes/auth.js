const authService = require('../services/authentication');
const express = require('express');
const router = express.Router();  



router.post('/auth',authService.register(req, res, next));
router.post('/login', authService.login(req, res, next));
router.post('/refresh', authService.refresh(req, res, next));   
router.post('/logout', authService.logout(req, res, next));


module.exports = router;