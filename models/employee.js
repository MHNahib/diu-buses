require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// employee schema
const employeentSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    maxlength: 255,
  },
  gender: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 6,
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
    type: [String],
    default: ["Employee"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

employeentSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.employeeName,
      role: this.role,
      isAdmin: this.isAdmin,
      gender: this.gender,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const Employee = new mongoose.model("Employee", employeentSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    employeeId: Joi.string().min(9).max(9).required(),
    employeeName: Joi.string().max(255).required(),
    password: Joi.string().required(),
    gender: Joi.string().max(6).min(4).required(),
    active: Joi.boolean(),
    email: Joi.string().max(255).required(),
  });
  return schema.validate(body);
};

module.exports.Employee = Employee;
module.exports.employeeValidation = validation;
