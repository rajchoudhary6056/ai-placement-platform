const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("MONGO_URI is missing from .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");

    const connection = await mongoose.connect(
      mongoURI.trim()
    );

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(
      "MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;