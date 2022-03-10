const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

const { Student, studentValidation } = require("../../models/student");

// passport.use(
//   new LocalStrategy((username, password, done) => {
//     console.log(`on local statigy`);
//     Student.findOne({ studentId: studentId }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       console.log(`found`);
//       console.log(user);
//       if (!user) {
//         req.flash(error_msg);
//         return done(null, false, { message: "Student Id not found" });
//       }
//       if (!bcrypt.compare(password, user.password)) {
//         req.flash(error_msg);
//         return done(null, false, { message: "Incorrect password" });
//       }
//       return done(null, user);
//     });
//   })
// );

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   Student.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

router.get("/signup", (req, res) => {
  // res.render("studentLogin");
  res.render("studentSignup", { error: undefined });
});

router.post("/signup", async (req, res) => {
  // console.log(req.body);
  // validate request body
  const { error } = studentValidation(req.body);
  if (error)
    return res
      .status(400)
      .render("studentSignup", { error: error.details[0].message });

  // check user is already exist or not
  let user = await Student.findOne({ studentId: req.body.studentId });
  if (user)
    return res.status(400).render("studentSignup", {
      error: `${req.body.studentId} already exists. Please login.`,
    });

  // hash password
  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);

  user = new Student({
    studentId: req.body.studentId,
    studentName: req.body.studentName,
    email: req.body.email,
    password: password,
    gender: req.body.gender,
  });

  await user.save();

  // res.send({
  //   studentId: user.studentId,
  //   studentName: user.studentName,
  //   gender: user.gender,
  // });
  req.flash("success_msg", "You are now registared. Now you can login.");
  res.redirect("/auth/student/login");
});

router.get("/login", (req, res) => {
  // res.render("studentLogin");
  res.render("studentLogin", { error: undefined });
});

router.post("/login", async (req, res) => {
  // console.log(req.body);
  // vaidate request body
  const { error } = validation(req.body);
  if (error)
    return res
      .status(400)
      .render("studentLogin", { error: error.details[0].message });
  // check user is already exist or not
  const user = await Student.findOne({ studentId: req.body.studentId });
  if (!user)
    return res.status(400).render("studentLogin", { error: "User not found" });
  // validate password
  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid)
    return res.status(403).render("studentLogin", {
      error: "Student Id or password is incorrect.",
    });
  // sign jwt token
  const token = user.generateAuthToken();
  // res.header("x-auth-token", token).send({
  //   name: user.studentName,
  //   id: user.studentId,
  // });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  res.redirect("/");
});

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/auth/student/login",
//     failureFlash: true,
//   })(req, res, next);
// });
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
