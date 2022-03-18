const express = require("express");
const { Student } = require("../models/student");
const { Teacher } = require("../models/teacher");
const { Employee } = require("../models/employee");
const { sendMail } = require("../setup/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("reset", {});
});

router.post("/", async (req, res) => {
  let user;
  let authLink;

  //   check student
  if (user === null || user === undefined) {
    user = await Student.findOne({ email: req.body.email });
    if (user !== null) authLink = `student`;
  }

  //   check teacher
  if (user === null || user === undefined) {
    user = await Teacher.findOne({ email: req.body.email });
    if (user !== null) authLink = `teacher`;
  }

  //   check employee
  if (user === null || user === undefined) {
    user = await Employee.findOne({ email: req.body.email });

    if (user === null || user === undefined) {
      return res.status(403).render("reset", {
        error: "No email address found!",
      });
    } else authLink = `employee`;
  }

  // token generator
  const secret = process.env.JWT_TOKEN_SECRET + user.password;
  const payload = {
    _id: user._id,
    email: user.email,
  };
  const token = jwt.sign(payload, secret, {
    expiresIn: "15m",
  });
  const link = `${req.protocol}://${req.get("host")}/reset-password/${
    user._id
  }/${token}`;

  sendMail(user.email, link)
    .then((result) => {
      req.flash(
        "success_msg",
        "Reset Link has been sent to your email. Please check (If the link is not in inbox please check spam.). "
      );
      return res.redirect(`/auth/${authLink}/login`);
    })
    .catch((error) => {
      console.log(error.message);
  
      return res.status(403).render("reset", {
        error: "Something went wrong! Please try again",
      });
    });
});

// rest link

router.get("/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  let user;

  // check student
  if (user === null || user === undefined) {
    user = await Student.findById(id);
  }

  //   check teacher
  if (user === null || user === undefined) {
    user = await Teacher.findById(id);
  }

  //   check employee
  if (user === null || user === undefined) {
    user = await Employee.findById(id);

    if (user === null || user === undefined) {
      return res.status(403).render("reset", {
        error:
          "No user found with the id. May be the token is invalid or the user doews not even exist",
      });
    }
  }

  //   extract token
  const secret = process.env.JWT_TOKEN_SECRET + user.password;

  // verify
  try {
    const payload = jwt.verify(token, secret);
    return res.render("resetSubmit", { email: user.email });
  } catch (ex) {
    return res.status(403).render("reset", {
      error: "Token authentication failed. Link has been expired. Try again!",
    });
  }

  res.render("reset", {});
});

// rest link post

router.post("/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  let user;
  let authLink;

  // check student
  if (user === null || user === undefined) {
    user = await Student.findById(id);
    if (user !== null) authLink = `student`;
  }

  //   check teacher
  if (user === null || user === undefined) {
    user = await Teacher.findById(id);
    if (user !== null) authLink = `teacher`;
  }

  //   check employee
  if (user === null || user === undefined) {
    user = await Employee.findById(id);

    if (user === null || user === undefined) {
      return res.status(403).render("reset", {
        error:
          "No user found with the id. May be the token is invalid or the user doews not even exist",
      });
    } else authLink = `employee`;
  }

  //   extract token
  const secret = process.env.JWT_TOKEN_SECRET + user.password;

  // verify
  try {
    const payload = jwt.verify(token, secret);
    let salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(req.body.password, salt);
    user.password = password;

    await user.save();

    req.flash("success_msg", "Password has been updated. Please login.");
    return res.redirect(`/auth/${authLink}/login`);
  } catch (ex) {
    console.log(ex);
    return res.status(403).render("reset", {
      error: "Token authentication failed. Link has been expired. Try again!",
    });
  }

  res.render("reset", {});
});

module.exports = router;
