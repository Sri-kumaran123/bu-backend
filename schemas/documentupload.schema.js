const mongoose = require('mongoose');

const DocumentSchema = mongoose.Schema({
    user :{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    purpose:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
    file:{
        type:mongoose.Types.ObjectId,
        ref:"File",
        required:true
    },
    new:{
        type:Boolean,
        required:true,
        default:true
    }
});

const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;