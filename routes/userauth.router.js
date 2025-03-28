const userauth = require('express').Router();
const {login, register, logout, refreshToken, getOneUser} = require("../controllers/userauth.controller.js");
const User = require('../schemas/user.schema.js');

const checkUserAvailable = async (req, res, next)=> {
    try{
        const {email} = req.body;
        console.log(email)
        const user = await User.findOne({email})

        if(user) req.user = user;

        next();
    } catch (err) {
        console.log(err.message);
        res.status(500).json({msg:"Server side error"});
    }
}

userauth.post('/login', login);

userauth.post('/register', register);

userauth.get('/refresh',refreshToken);

userauth.get('/logout', logout);

userauth.get('/user', getOneUser)


module.exports = userauth;