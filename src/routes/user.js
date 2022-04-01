const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const UserController = require('../controllers/user.controller');

router.post('/register',
    [
        check("name", "name should be atleast 3 characters").isLength({min: 3}),
        check("email", "email is required").isEmail(),
        check("password", "password should be atleast 3 char").isLength({min: 3}),
    ], UserController.createUser);

router.get('/all', UserController.getAllUsers);

module.exports = router