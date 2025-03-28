const express = require('express');
const getuserRoute = express.Router();
const User = require('../schemas/user.schema');

const getOneUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user) return res.status(404).json({msg:"User not found"});

        res.status(200).json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({msg:"Seerver side error"});
    }
}

getuserRoute.get('/',getOneUser);

module.exports = getuserRoute;