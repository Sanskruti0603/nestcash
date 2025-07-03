const mongoose = require("mongoose");
const moment = require("moment");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  account_type: {
    type: String,
    required: true,
    enum: ["saving", "current"],
    default: "saving",
  },

  phone: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  status: {
    type: String,
    enum: ["active", "inactive", "blocked"],
    default: "inactive",
  },

  token: {
    type: String,
    default: null,
  },

  createdAt: {
    type: String,
    default: () => moment().utc().toDate(),
  },
  otp: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpExpiresAt: { type: Date },

  updatedAt: {
    type: String,
    default: () => moment().utc().toDate(),
  },
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
