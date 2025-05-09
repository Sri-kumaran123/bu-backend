const mongoose = require("mongoose");
require("dotenv").config(); 

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/bu', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log('MongoDB Connected ✅');
      } catch (err) {
        console.error('MongoDB connection error ❌', err);
        process.exit(1);
      }
};

module.exports = connectDB;
