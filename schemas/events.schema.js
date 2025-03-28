const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    }, 
    desc:{
        type:String,
        required:true
    },
    image:{
        type:mongoose.Types.ObjectId,
        ref:"File",
    },
    time:{
        type:String,
        required:true
    },
    user: {
        type: [mongoose.Types.ObjectId], // Array of ObjectIds
        ref: "User",
        default: [] // Default to an empty array
    },
    location:{
        type:String,
        default:"Bharathiar Uniersity"
    }
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;