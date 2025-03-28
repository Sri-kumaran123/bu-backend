const mongoose = require('mongoose');

const semesterMarksSchema = new mongoose.Schema({
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SemesterDetail',
        required:true,
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required:true
    },
    subjects: [
        {
            subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }, // 🔹 Link to Subject Schema
            marks: { type: Number, required: true, min: 0, max: 100 } // 🔹 Marks for each subject
        }
    ]
}, { timestamps: true });

const SemesterMarks = mongoose.model('SemesterMarks', semesterMarksSchema);
module.exports = SemesterMarks;
