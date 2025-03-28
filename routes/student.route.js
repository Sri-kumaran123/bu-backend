const express = require('express');
const studentRoute = express.Router();
const { createNewStudent, updateRegnoAndCourse, getStudent, getOneStudent } = require('../controllers/student.controller.js');


const xlsx = require("xlsx");

const User = require('../schemas/user.schema.js');
const Batch = require('../schemas/batch.schema.js');
const Student = require('../schemas/student.schema.js');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory instead of disk

const upload = multer({ storage: storage });
// Define routes for student operations
studentRoute.post("/upload-students/:batchId", upload.single("file"), async (req, res) => {
    try {
        const batchId = req.params.batchId;

        // Check if batch exists
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ error: "Batch not found" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log(' i run2');

        // Read the file
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        console.log('done');
        const sheetName = workbook.SheetNames[0];
        console.log('done')
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(sheetData);
        let createdStudents = [];

        for (const row of sheetData) {
            const { username, email, regNo, course } = row;

            if (!username || !email || !regNo || !course) {
                console.log("Skipping row due to missing data:", row);
                continue; // Skip rows with missing data
            }

            // Check if user already exists
            let user = await User.findOne({ email });
            console.log(user);
            if (!user) {
                user = new User({
                    username,
                    email,
                    password: regNo, // Use regNo as password
                    role: "student"
                });
                await user.save();
            }

            // Check if student exists
            let student = await Student.findOne({ regNo });
            if (!student) {
                student = new Student({
                    user: user._id,
                    regNo,
                    Department: "Department of Computer Applications", // Default
                    course:batch.course,
                    batch: batchId
                });
                console.log(' i run')
                await student.save();
            }

            // Add student to batch if not already added
            if (!batch.students.includes(student._id)) {
                batch.students.push(student._id);
            }

            createdStudents.push(student);
            console.log(' i run')
        }

        await batch.save(); // Save batch with new students
        console.log(' i run')
        res.json({
            message: "Students added successfully",
            students: createdStudents
        });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

studentRoute.post('/', createNewStudent);
studentRoute.put('/update', updateRegnoAndCourse);
studentRoute.get('/',getStudent);
studentRoute.get('/st',getOneStudent);

module.exports = studentRoute;