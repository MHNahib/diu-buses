require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// student schema
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 12,
    unique: true,
  },
  studentName: {
    type: String,
    required: true,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 6,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

studentSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, studentName: this.studentName },
    process.env.JWT_TOKEN_SECRET
  );
};

const Student = new mongoose.model("Student", studentSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    studentId: Joi.string().max(12).min(12).required(),
    studentName: Joi.string().max(255).required(),
    password: Joi.string().required(),
    gender: Joi.string().max(6).min(4).required(),
    active: Joi.boolean(),
  });

  return schema.validate(body);
};

module.exports.Student = Student;
module.exports.studentValidation = validation;
