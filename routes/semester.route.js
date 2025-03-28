const express = require("express");
const {
    getAllSemesters,
    getSemester,
    addSemester,
    addSubjectToSemester,
    removeSubjectFromSemester
} = require("../controllers/semester.controller");

const semesterRouter = express.Router();

// API routes
semesterRouter.get("/semesters", getAllSemesters);
semesterRouter.post("/semestera", getSemester);
semesterRouter.post("/semester/add", addSemester);
semesterRouter.post("/semester/subject/add", addSubjectToSemester);
semesterRouter.post("/semester/subject/remove", removeSubjectFromSemester);

module.exports = semesterRouter;
