const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    regNo:{
        type:String,
        required:true,
    },
    Department:{
        type:String,
        default:"Department of Computer Applications",
        required:true,
    },
    course:{
        type:String,
        required:true,
        enum:["MCA","M.Sc Cyber Security","M.Sc Data Analytics"]
    },
    batch:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Batch', 
        required:true
    }
},{timestamps:true})



const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;