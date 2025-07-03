const mongoose = require("mongoose");
const moment = require("moment");
const { CARD_TYPE } = require("../../utils/constant");

const atmSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
  },

  card_no: {
    type: String,
    required: true,
    unique: true,
  },

  cvv: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    // default: Date.now,
  },

  expiry: {
    type: Date,
    // default: () => moment().add(3, "years").toDate(),
  },

  pin: {
    type: String,
    required: true,
  },

  card_type: {
    type: String,
    required: true,
    enum: Object.keys(CARD_TYPE),
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

const atmModel = mongoose.model("atms", atmSchema);
module.exports = atmModel;
