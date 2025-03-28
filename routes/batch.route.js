const express = require('express');
const batchRoute = express.Router();
const { createNewBatch, getBatchBasedCourseAndEndYear, updateYear, updateSemester, getAllBatch } = require('../controllers/batch.controller.js');

// Define routes for batch operations

batchRoute.put('/:id/year', updateYear);
batchRoute.put('/:id/semester', updateSemester);
batchRoute.post('/', createNewBatch);
batchRoute.get('/all', getAllBatch);
batchRoute.get('/', getBatchBasedCourseAndEndYear);

module.exports = batchRoute;