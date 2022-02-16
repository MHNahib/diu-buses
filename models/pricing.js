const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// pricing schema
const pricingSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Routes",
  },
  from: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  to: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
});

const Pricing = new mongoose.model("Pricing", pricingSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    routeId: Joi.objectId().required(),
    from: Joi.number().min(0).max(1000).required(),
    to: Joi.number().min(0).max(1000).required(),
  });

  return schema.validate(body);
};

module.exports.Pricing = Pricing;
module.exports.pricingValidation = validation;
