const SemesterMarks = require('../schemas/semestermarks.schema.js');
const SemesterDetail = require('../schemas/semesterdetail.schmea.js');
const Student = require('../schemas/student.schema.js');
const Subject = require('../schemas/subject.schema.js');

// ✅ Create a new semester marks entry
const createNewSemMarks = async (req, res) => {
    try {
        const { semester, student, subjects } = req.body;

        if (!semester || !student || !subjects || !Array.isArray(subjects)) {
            return res.status(400).json({ msg: "Semester, student, and subjects are required." });
        }

        // Ensure semester exists
        const semesterExists = await SemesterDetail.findById(semester);
        if (!semesterExists) {
            return res.status(404).json({ msg: "Semester not found." });
        }

        // Ensure student exists
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            return res.status(404).json({ msg: "Student not found." });
        }

        // Validate subjects and marks
        for (const entry of subjects) {
            const subjectExists = await Subject.findById(entry.subject);
            if (!subjectExists) {
                return res.status(404).json({ msg: `Subject with ID ${entry.subject} not found.` });
            }
            if (entry.marks < 0 || entry.marks > 100) {
                return res.status(400).json({ msg: `Marks must be between 0 and 100 for subject ${entry.subject}` });
            }
        }

        const newSemesterMarks = new SemesterMarks({ semester, student, subjects });
        await newSemesterMarks.save();

        res.status(201).json({ msg: "Semester marks added successfully", semesterMarks: newSemesterMarks });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

// ✅ Update marks for a student's semester subjects
const updateSubjects = async (req, res) => {
    try {
        const { semesterMarksId, subjects } = req.body;

        if (!semesterMarksId || !subjects || !Array.isArray(subjects)) {
            return res.status(400).json({ msg: "Semester marks ID and subjects are required." });
        }

        const semesterMarks = await SemesterMarks.findById(semesterMarksId);
        if (!semesterMarks) {
            return res.status(404).json({ msg: "Semester marks entry not found." });
        }

        // Validate subject entries
        for (const entry of subjects) {
            if (!entry.subject || entry.marks < 0 || entry.marks > 100) {
                return res.status(400).json({ msg: `Invalid data for subject ${entry.subject}` });
            }
        }

        // Update marks
        semesterMarks.subjects = subjects;
        await semesterMarks.save();

        res.status(200).json({ msg: "Semester marks updated successfully", semesterMarks });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

// ✅ Get semester marks for a student in a given semester
const getSemMarkBySemesterAndStudent = async (req, res) => {
    try {
        const { semester, student } = req.query;

        if (!semester || !student) {
            return res.status(400).json({ msg: "Semester and student ID are required." });
        }

        const semesterMarks = await SemesterMarks.findOne({ semester, student })
            .populate("semester")
            .populate("student")
            .populate("subjects.subject"); // Populate subject details

        if (!semesterMarks) {
            return res.status(404).json({ msg: "Semester marks not found for the given student and semester." });
        }

        res.status(200).json({ semesterMarks });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

module.exports = { createNewSemMarks, updateSubjects, getSemMarkBySemesterAndStudent };
