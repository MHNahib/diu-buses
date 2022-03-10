const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();

const { Employee, employeeValidation } = require("../../models/employee");

router.post("/signup", async (req, res) => {
  // validate request body
  const { error } = employeeValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check user is already exist or not
  let user = await Employee.findOne({ employeeId: req.body.employeeId });
  if (user)
    return res.status(400).send(`${req.body.employeeId} already exists`);

  // hash password
  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);

  user = new Employee({
    employeeId: req.body.employeeId,
    employeeName: req.body.employeeName,
    password: password,
    role: req.body.role,
  });

  await user.save();

  res.send({
    employeeId: user.employeeId,
    employeeName: user.employeeName,
    role: user.role,
  });
});

router.post("/login", async (req, res) => {
  // vaidate request body
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check user is already exist or not
  let user = await Employee.findOne({ employeeId: req.body.employeeId });
  if (!user)
    return res.status(400).send(`${req.body.employeeId} user not found`);

  // validate password
  const isValid = await bcrypt.compare(req.body.password, user.password);

  if (!isValid)
    return res.status(403).send(`employee id or password is not currect`);

  // sign jwt token

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    name: user.employeeName,
    id: user.employeeId,
  });
});

// login validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    employeeId: Joi.string().min(9).max(9).required(),
    password: Joi.string().required(),
  });

  return schema.validate(body);
};

module.exports = router;
