const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// schedule schema
const scheduleSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Routes",
  },
  startTime: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
});

/**
 *  todo:
 *  1. update time option in startTIme and departureTime
 */

const Schedule = new mongoose.model("Schedule", scheduleSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    routeId: Joi.objectId().required(),
    startTime: Joi.string().required(),
    departureTime: Joi.string().required(),
  });

  return schema.validate(body);
};

module.exports.Schedule = Schedule;
module.exports.scheduleValidation = validation;
