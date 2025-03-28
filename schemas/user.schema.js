const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SemesterMarks = require('./semestermarks.schema');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  }, 
  role:{
    type:String,
    default:"user",
    required:true
  },
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
