// models/scheduleModel.js
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  assignedAttendant: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Loading", "Offloading"],
    required: true,
  },
  products: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
