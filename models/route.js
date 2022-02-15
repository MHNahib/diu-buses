const mongoose = require("mongoose");
const Joi = require("joi");

// route schema
const routeSchema = new mongoose.Schema({
  routeNo: {
    type: String,
    required: true,
    maxlength: 10,
  },
  busStoppages: {
    type: [String],
    required: true,
  },
  routeName: {
    type: String,
    required: true,
    maxlength: 255,
  },
});

const Route = new mongoose.model("Route", routeSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    routeNo: Joi.string().max(10).required(),
    busStoppages: Joi.array().required(),
    routeName: Joi.string().max(255).required(),
  });
  return schema.validate(body);
};

module.exports.Route = Route;
module.exports.routeValidation = validation;
