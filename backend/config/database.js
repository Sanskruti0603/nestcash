require("dotenv").config();
const mongoose = require("mongoose");
const URI = process.env.URI;

try {
  mongoose.connect(URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}
