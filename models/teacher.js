require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// employee schema
const teacherSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 9,
    unique: true,
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
    default: true,
  },
  role: {
    type: String,
    default: "Teacher",
  },
});

teacherSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, employeeId: this.employeeId },
    process.env.JWT_TOKEN_SECRET
  );
};

const Teacher = new mongoose.model("Teacher", teacherSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    employeeId: Joi.string().min(9).max(9).required(),
    employeeName: Joi.string().max(255).required(),
    password: Joi.string().required(),
    active: Joi.boolean(),
  });
  return schema.validate(body);
};

module.exports.Teacher = Teacher;
module.exports.teacherValidation = validation;
