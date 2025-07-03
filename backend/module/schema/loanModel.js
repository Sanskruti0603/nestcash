const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      default: 10,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    emiAmount: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    paidEMIs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("loan", loanSchema);
