const mongoose = require("mongoose");
const Joi = require("joi");

// employee schema
const employeentSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 9,
  },
  employeeName: {
    type: String,
    required: true,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
  },
  role: {
    type: String,
    required: true,
  },
});

const Employee = new mongoose.model("Employee", employeentSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    employeeId: Joi.string().min(9).max(9).required(),
    employeeName: Joi.string().max(255).required(),
    password: Joi.string().required(),
    active: Joi.boolean().required(),
    role: Joi.string().required(),
  });
  return schema.validate(body);
};
