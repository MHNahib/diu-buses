const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();

const { Student, studentValidation } = require("../../models/student");

router.post("/signup", async (req, res) => {
  // validate request body
  const { error } = studentValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check user is already exist or not
  let user = await Student.findOne({ studentId: req.body.studentId });
  if (user) return res.status(400).send(`${req.body.studentId} already exists`);

  // hash password
  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);

  user = new Student({
    studentId: req.body.studentId,
    studentName: req.body.studentName,
    password: password,
    gender: req.body.gender,
  });

  await user.save();

  res.send({
    studentId: user.studentId,
    studentName: user.studentName,
    gender: user.gender,
  });
});

router.post("/login", async (req, res) => {
  // vaidate request body
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check user is already exist or not
  const user = await Student.findOne({ studentId: req.body.studentId });
  if (!user)
    return res.status(400).send(`${req.body.studentId} user not found`);

  // validate password
  const isValid = await bcrypt.compare(req.body.password, user.password);

  if (!isValid)
    return res.status(403).send(`student id or password is not currect`);

  // sign jwt token

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    name: user.studentName,
    id: user.studentId,
  });
});

// login validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    studentId: Joi.string().max(12).min(12).required(),
    password: Joi.string().required(),
  });

  return schema.validate(body);
};

module.exports = router;
