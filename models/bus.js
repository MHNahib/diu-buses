const mongoose = require("mongoose");
const Joi = require("joi");

// bus schema
const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  type: {
    type: String,
    required: true,
    maxlength: 255,
  },
  sits: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    required: true,
  },
});

const Bus = new mongoose.model("Bus", busSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    type: Joi.string().max(255).required(),
    sits: Joi.number().min(0).max(100).required(),
  });

  return schema.validate(body);
};

module.exports.Bus = Bus;
module.exports.busValidation = validation;
