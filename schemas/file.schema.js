
const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    filePath: { type: String, required: true }, 
    uploadDate: { type: Date, default: Date.now } 
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);
module.exports = File;