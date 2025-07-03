const mongoose = require("mongoose");
const moment = require("moment");

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  amount: {
    type: Number,
    default: 0,
  },

  account_type: {
    type: String,
    enum: ["saving", "current"],
    default: "saving",
  },

  accountNumber: {
    type: String,
    required: true,
  },

  isActive: {
    type: String,
    enum: ["0", "1"],
    default: "1",
  },

  isDelete: {
    type: String,
    enum: ["0", "1"],
    default: "0",
  },
  isFrozen: { type: Boolean, default: false },

  createdAt: {
    type: String,
    default: () => moment().utc().toDate(),
  },

  updatedAt: {
    type: String,
    default: () => moment().utc().toDate(),
  },
});

const accountModel = mongoose.model("accounts", accountSchema);
module.exports = accountModel;
