const mongoose = require("mongoose");
const moment = require("moment");
const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["transaction", "atm", "fixed_deposit", "general"],
    default: "general",
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

module.exports = mongoose.model("notifications", notificationSchema);
