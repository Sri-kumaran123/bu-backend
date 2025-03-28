const mongoose = require('mongoose');

const SemesterDetailSchema = new mongoose.Schema({
   
    batch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required:true
    },
    semester: {
        type: String,
        required: true,
        enum: ["I", "II", "III", "IV"], // ✅ Restrict values to I-IV
        message: "Semester must be one of I, II, III, or IV ❌"
    },
    course:{
        type:String,
        required:true,
        enum:["MCA","M.Sc Cyber Security","M.Sc Data Analytics"]
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject', // References Subject model
            default:[],
        }
    ],
    
},{timestamps:true});

const SemesterDetail = mongoose.model('SemesterDetail', SemesterDetailSchema);
module.exports = SemesterDetail;
