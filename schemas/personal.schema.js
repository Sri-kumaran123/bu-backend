
const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    parentNumber: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true }
}, { timestamps: true });

const Personal = mongoose.model('Profile', personalSchema);
module.exports = Personal;