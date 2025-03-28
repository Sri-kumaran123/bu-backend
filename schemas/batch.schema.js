const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    startYear: { 
        type: Number, 
        required: true,
        default: () => new Date().getFullYear()
    },
    endYear: { 
        type: Number, 
        required: true,
        default: () => new Date().getFullYear() + 2
    },
    finished: { 
        type: Boolean, 
        required: true, 
        default: false
    }, // ✅ Defaults to false (ongoing batch)
    currentYear: { 
        type: String, 
        required: true, 
        enum: ["I", "II"], // ✅ Allowed values: "I" or "II"
        default:"I"
    },
    semester: {
        type: String,
        required: true,
        enum: ['I', 'II', 'III', 'IV'], // Restrict values to these Roman numerals
        message: 'Semester must be I, II, III, or IV.',
        default:'I'
    },
    course:{
        type:String,
        required:true,
        enum:["MCA","M.Sc Cyber Security","M.Sc Data Analytics"]
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            default: [] // ✅ Default to an empty array
        }
    ]
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);
module.exports = Batch;
