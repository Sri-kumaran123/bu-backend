const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    course:{
        type:String,
        required:true,
        enum:["MCA","M.Sc Cyber Security","M.Sc Data Analytics"]
    },
    
})