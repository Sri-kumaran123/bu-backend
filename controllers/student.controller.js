const Batch = require('../schemas/batch.schema.js');
const Student = require('../schemas/student.schema.js');

// ✅ Create a new student
const createNewStudent = async (req, res) => {
    try {
        const { regNo, course } = req.body;
        const startYear =  new Date().getFullYear();
        const batch = await Batch.findOne({course, startYear, endYear:new Date().getFullYear() + 2})
        let {user} = req.body;
        if(!user) user = req.user.id;
    
        
        if (!user || !regNo || !course || !batch) {
            return res.status(400).json({ msg: "All fields are required." });
        }
        
        // Check if student already exists
        const existingStudent = await Student.findOne({ user });
        if (existingStudent) {
            return res.status(400).json({ msg: "Student already exists." });
        }

        const newStudent = new Student({
            user,
            regNo,
            course,
            batch:batch._id
        });

        await newStudent.save();
        res.status(201).json({ msg: "Student created successfully", student: newStudent });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

const getStudent = async (req, res) => {
    try {
        const students = await Student.find()
            .populate({
                path: 'batch',
                select: 'semester currentYear', // Select only semester & currentYear from batch
            })
            .populate({
                path: 'user', // If you want user details
                select: 'name email',
            });

        if (!students || students.length === 0) {
            return res.status(404).json({ msg: "No students found" });
        }

        res.status(200).json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

const getOneStudent = async (req, res) => {
    try {
        const user = req.user; // User data assigned in protect middleware using token

        const student = await Student.findOne({ user: user._id })
            .populate({
                path: 'batch',
                select: 'semester currentYear' // Fetch only semester & currentYear
            })
            .populate({
                path: 'user', // If you want user details
                select: 'name email',
            });

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        res.status(200).json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};
// ✅ Update student's registration number and course
const updateRegnoAndCourse = async (req, res) => {
    try {
        const { user, regNo, course } = req.body;

        if (!user || !regNo || !course) {
            return res.status(400).json({ msg: "User ID, RegNo, and Course are required." });
        }

        // Find and update student record
        const updatedStudent = await Student.findOneAndUpdate(
            { user },
            { regNo, course },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ msg: "Student not found." });
        }

        res.status(200).json({ msg: "Student updated successfully", student: updatedStudent });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

module.exports = { createNewStudent, updateRegnoAndCourse, getStudent, getOneStudent };
