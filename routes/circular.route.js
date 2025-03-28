
const express = require('express');
const { addCircluar, deleteCircular, getAllCircular } = require('../controllers/circular.controller');
const circularRoute = express.Router();
const upload = require('../middleware/uploadMidleware');

circularRoute.post('/',upload.single('file'), addCircluar);
circularRoute.delete('/:id',deleteCircular);
circularRoute.get('/', getAllCircular);

module.exports = circularRoute;