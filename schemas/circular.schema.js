const mongoose = require('mongoose');

const circularScheam = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    file:{
        type:mongoose.Types.ObjectId,
        ref:"File",
        required:true
    }
});

const Circular = mongoose.model('Circular', circularScheam);
module.exports = Circular;