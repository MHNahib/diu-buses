require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// driver schema
const driverSchema = new mongoose.Schema({
  driverName: {
    type: String,
    max: 255,
    required: true,
  },
  phone: {
    type: String,
    min: 11,
    max: 14,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Driver = new mongoose.model("Driver", driverSchema);

// joi validation
const validation = (body) => {
  const schema = Joi.object({
    driverName: Joi.string().max(255).required(),
    phone: Joi.string().min(11).max(14).required(),
  });

  return schema.validate(body);
};

module.exports.Driver = Driver;
module.exports.driverValidation = validation;
