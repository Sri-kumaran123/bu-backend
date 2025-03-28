const express = require('express');
const { createNewSemMarks, updateSubjects, getSemMarkBySemesterAndStudent } = require('../controllers/semestermarks.controller.js');

const semMarksRoute = express.Router();

// ✅ Route to create new semester marks entry
semMarksRoute.post('/create', createNewSemMarks);

// ✅ Route to update subject marks for a semester
semMarksRoute.put('/update', updateSubjects);

// ✅ Route to get semester marks for a student
semMarksRoute.get('/get', getSemMarkBySemesterAndStudent);

module.exports = semMarksRoute;