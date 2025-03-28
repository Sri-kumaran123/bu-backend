const Batch = require("../schemas/batch.schema");
const SemesterDetail = require("../schemas/semesterdetail.schmea");

// ✅ Get all semesters
const getAllSemesters = async (req, res) => {
    try {
        const semesters = await SemesterDetail.find()
            .populate("batch")
            .populate("subjects");

        res.status(200).json(semesters);
    } catch (err) {
        console.error("Error fetching semesters:", err);
        res.status(500).json({ msg: "Server-side error" });
    }
};

// ✅ Get a specific semester by batch & sem
const getSemester = async (req, res) => {
    try {
        const { batch, sem } = req.body;

        if (!batch || !sem) {
            return res.status(400).json({ msg: "Batch and semester are required." });
        }
        const batchd = await Batch.findById(batch);
        const semester = await SemesterDetail.findOne({ batch, semester: sem })
            .populate("batch")
            .populate("subjects");

        if (!semester) {
            const semester = await SemesterDetail({
                batch,
                semester:sem,
                course:batch.course
            });
            return res.status(201).json(semester);
        }

        res.status(200).json(semester);
    } catch (err) {
        console.error("Error fetching semester:", err);
        res.status(500).json({ msg: "Server-side error" });
    }
};

// ✅ Add a new semester
const addSemester = async (req, res) => {
    try {
        const { batch, semester, course } = req.body;

        if (!batch || !semester || !course) {
            return res.status(400).json({ msg: "Batch, semester, and course are required." });
        }

        const newSemester = new SemesterDetail({ batch, semester, course });
        await newSemester.save();

        res.status(201).json({ msg: "Semester added successfully!", semester: newSemester });
    } catch (err) {
        console.error("Error adding semester:", err);
        res.status(500).json({ msg: "Server-side error" });
    }
};

// ✅ Add a subject to a semester
const addSubjectToSemester = async (req, res) => {
    try {
        const { batch, semester, subjectId } = req.body;

        const sem = await SemesterDetail.findOne({ batch, semester });

        if (!sem) {
            return res.status(404).json({ msg: "Semester not found." });
        }

        sem.subjects.push(subjectId);
        await sem.save();

        res.status(200).json({ msg: "Subject added successfully!", semester: sem });
    } catch (err) {
        console.error("Error adding subject:", err);
        res.status(500).json({ msg: "Server-side error" });
    }
};

// ✅ Remove a subject from a semester
const removeSubjectFromSemester = async (req, res) => {
    try {
        const { batch, semester, subjectId } = req.body;

        const sem = await SemesterDetail.findOne({ batch, semester });

        if (!sem) {
            return res.status(404).json({ msg: "Semester not found." });
        }

        sem.subjects = sem.subjects.filter(id => id.toString() !== subjectId);
        await sem.save();

        res.status(200).json({ msg: "Subject removed successfully!", semester: sem });
    } catch (err) {
        console.error("Error removing subject:", err);
        res.status(500).json({ msg: "Server-side error" });
    }
};

module.exports = {
    getAllSemesters,
    getSemester,
    addSemester,
    addSubjectToSemester,
    removeSubjectFromSemester
};
