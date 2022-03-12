const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// schedule schema
const requestNewBus = new mongoose.Schema({
  bookedSchedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedules",
  },
  newSchedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedules",
  },
  routeName: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const RequestNewBus = new mongoose.model("RequestNewBus", requestNewBus);

module.exports.RequestNewBus = RequestNewBus;
