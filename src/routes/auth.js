const Authentication = require('../service/authentication');
const express = require('express');
const router = express.Router();  
const authService = new Authentication();


router.post('/register', async (req, res, next) => {       
    try {
        await authService.register(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        await authService.login(req, res, next);
    } catch (error) {
        next(error);
    }
}); 

router.post('/refresh', async (req, res, next) => {
    try {
        await authService.refresh(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post('/logout', async (req, res, next) => {
    try {
        await authService.logout(req, res, next);
    } catch (error) {
        next(error);
    }
});