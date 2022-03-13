const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();
const user = require("../../middleware/user");
const auth = require("../../middleware/auth");
const redirect = require("../../middleware/redirect");
const { Teacher, teacherValidation } = require("../../models/teacher");

router.get("/signup", user, redirect, (req, res) => {
  // res.render("studentLogin");
  res.render("teacherSignup", { error: undefined });
});

router.post("/signup", async (req, res) => {
  // validate request body
  const { error } = teacherValidation(req.body);
  if (error)
    return res
      .status(400)
      .render("teacherSignup", { error: error.details[0].message });

  // check user is already exist or not
  let user = await Teacher.findOne({ employeeId: req.body.employeeId });
  if (user)
    return res.status(400).render("teacherSignup", {
      error: `${req.body.employeeId} already exists`,
    });

  // hash password
  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);

  user = new Teacher({
    employeeId: req.body.employeeId,
    employeeName: req.body.employeeName,
    password: password,
    email: req.body.email,
    password: password,
    gender: req.body.gender,
  });

  await user.save();

  // res.send({
  //   employeeId: user.employeeId,
  //   employeeName: user.employeeName,
  //   role: user.role,
  // });
  req.flash("success_msg", "You are now registared. Now you can login.");
  res.redirect("/auth/teacher/login");
});

router.get("/login", user, redirect, (req, res) => {
  // res.render("studentLogin");
  res.render("teacherLogin", { error: undefined });
});

router.post("/login", async (req, res) => {
  // vaidate request body
  const { error } = validation(req.body);
  if (error)
    return res
      .status(400)
      .render("teacherLogin", { error: error.details[0].message });

  // check user is already exist or not
  let user = await Teacher.findOne({ employeeId: req.body.employeeId });
  if (!user)
    return res.status(400).render("teacherLogin", {
      error: `${req.body.employeeId} user not found`,
    });

  // validate password
  const isValid = await bcrypt.compare(req.body.password, user.password);

  if (!isValid)
    return res.status(403).render("teacherLogin", {
      error: "Teacher Id or password is incorrect.",
    });

  // sign jwt token

  const token = user.generateAuthToken();
  // res.header("x-auth-token", token).send({
  //   name: user.employeeName,
  //   id: user.employeeId,
  // });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  res.redirect("/");
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
