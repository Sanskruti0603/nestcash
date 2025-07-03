const mongoose = require("mongoose");
const moment = require("moment");
const fixDepositSchema = new mongoose.Schema({
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

  interest_amount: {
    type: Number,
    default: 0,
  },

  isClaimed: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  duration: {
    type: Number, // in months or days, your choice
    required: true,
  },

  maturity_date: {
    type: Date,
    default: function () {
      return moment(this.createdAt).add(this.duration, "months").toDate();
    },
  },

  remark: {
    type: String,
    default: "",
  },

  claimed_date: {
    type: Date,
  },

  apply_for: {
    type: String,
    required: true,
    trim: true,
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

const fixDepositModel = mongoose.model("fixDeposits", fixDepositSchema);
module.exports = fixDepositModel;
