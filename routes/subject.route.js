const express = require('express');
const subjectRoute = express.Router();
const { getAllSubject, insertNewSubject, editSubject, deleteOneSubject } = require('../controllers/subject.controller.js');

// Define routes for subject operations
subjectRoute.get('/', getAllSubject);
subjectRoute.post('/', insertNewSubject);
subjectRoute.put('/:id', editSubject);
subjectRoute.delete('/:id', deleteOneSubject);

module.exports = subjectRoute;