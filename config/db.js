const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MONGODB SUCCESSFULLY CONNECTED");
  } catch (error) {
    console.log("MONGODB SERVER ISSUE");
  }
};

module.exports = connectDB;
