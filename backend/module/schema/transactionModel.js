const mongoose = require("mongoose");
const moment = require("moment");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
  },

  amount: {
    type: Number,
    required: true,
  },

  isSuccess: {
    type: Boolean,
    default: false,
  },

  transaction_type: {
    type: String,
    enum: ["credit", "debit"],
  },

  description: {
    type: String,
  },

  razorpayPaymentId: {
    type: String,
    default: "",
  },

  razorpayOrderId: {
    type: String,
    default: "",
  },

  razorpaySignature: {
    type: String,
    default: "",
  },

  remark: {
    type: String,
    default: "Transaction Init",
  },

  createdAt: {
    type: String,
    default: () => moment().utc().toDate(),
  },

  updatedAt: {
    type: String,
    default: () => moment().utc().toDate(),
  },
});

const transactionModel = mongoose.model("transactions", transactionSchema);
module.exports = transactionModel;
