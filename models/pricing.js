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
    type: String,
    required: true,
    maxlength: 255,
  },
  to: {
    type: String,
    required: true,
    maxlength: 255,
  },
});

const Pricing = new mongoose.model("Pricing", pricingSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    routeId: Joi.objectId().required(),
    from: Joi.string().max(255).required(),
    to: Joi.string().max(255).required(),
  });

  return schema.validate(body);
};

module.exports.Pricing = Pricing;
module.exports.pricingValidation = validation;
