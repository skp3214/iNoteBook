const express = require('express');
const { body } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const authController = require('../controller/auth.controller');
const router = express.Router();

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], authController.createUser);

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], authController.loginUser);

router.post('/getuser', fetchuser, authController.getUser);

module.exports = router;
