const Batch = require('../schemas/batch.schema.js');

const createNewBatch = async (req, res) => {
    try {
        const { startYear, endYear, currentYear, semester, course } = req.body;

        if (!startYear || !endYear || !currentYear || !semester || !course) {
            return res.status(400).json({ msg: "All fields are required." });
        }
        
        // Check if a batch with the same course, startYear, and endYear already exists
        const existingBatch = await Batch.findOne({ course, startYear, endYear });

        if (existingBatch) {
            return res.status(400).json({ msg: "A batch for this course already exists in the given year range." });
        }

        // Create new batch with default values
        const newBatch = new Batch({
            // startYear,
            // endYear,
            // currentYear: currentYear || "I",  // Default to "I"
            // semester: semester || "I",  // Default to "I"
            course
        });

        await newBatch.save();
        res.status(201).json({ msg: "Batch created successfully", batch: newBatch });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};


// ✅ Get batches based on course and end year
const getBatchBasedCourseAndEndYear = async (req, res) => {
    try {
        const { course, endYear } = req.query;

        if (!course || !endYear) {
            return res.status(400).json({ msg: "Course and End Year are required" });
        }

        const batches = await Batch.find({ course, endYear });
        res.status(200).json(batches);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

const getAllBatch = async (req, res) =>{
    try {
        const batches = await Batch.find({}).populate({
            path: "students",
            select: "regNo user Department course"
        });

        res.status(200).json(batches);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server side error" });
    }
}

// ✅ Update current year for a batch
const updateYear = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentYear } = req.body;

        if (!["I", "II"].includes(currentYear)) {
            return res.status(400).json({ msg: "Invalid year. Allowed values: I, II" });
        }

        const updatedBatch = await Batch.findByIdAndUpdate(id, { currentYear }, { new: true });

        if (!updatedBatch) {
            return res.status(404).json({ msg: "Batch not found" });
        }

        res.status(200).json({ msg: "Batch year updated successfully", batch: updatedBatch });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

// ✅ Update semester for a batch
const updateSemester = async (req, res) => {
    try {
        const { id } = req.params;
        const { semester } = req.body;

        if (!["I", "II", "III", "IV"].includes(semester)) {
            return res.status(400).json({ msg: "Invalid semester. Allowed values: I, II, III, IV" });
        }

        const updatedBatch = await Batch.findByIdAndUpdate(id, { semester }, { new: true });

        if (!updatedBatch) {
            return res.status(404).json({ msg: "Batch not found" });
        }

        res.status(200).json({ msg: "Batch semester updated successfully", batch: updatedBatch });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server side error" });
    }
};

module.exports = { createNewBatch, getBatchBasedCourseAndEndYear, updateYear, updateSemester, getAllBatch};