const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// schedule schema
const scheduleSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Routes",
  },
  routeName: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buses",
  },
  busName: {
    type: String,
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drivers",
  },
  driverName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    min: 11,
    max: 14,
    required: true,
  },
  availabeSeats: {
    type: Number,
    default: 0,
  },
  bookedBy: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tickets",
      },
    ],
  },
  bookedSeats: {
    type: [String],
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Schedule = new mongoose.model("Schedule", scheduleSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    routeId: Joi.objectId().required(),
    startTime: Joi.string().required(),
    busId: Joi.objectId().required(),
    driverId: Joi.objectId().required(),
  });

  return schema.validate(body);
};

module.exports.Schedule = Schedule;
module.exports.scheduleValidation = validation;
