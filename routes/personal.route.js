const express = require('express');
const { createNewPersonal, updatePersonal, getPersonalByUser } = require('../controllers/personal.controller.js');

const personalRoute = express.Router();

// ✅ Create a new personal profile
personalRoute.post('/create', createNewPersonal);

// ✅ Update an existing personal profile
personalRoute.put('/update', updatePersonal);

// ✅ Get personal profile by user ID
personalRoute.get('/:userId', getPersonalByUser);

module.exports = personalRoute;
