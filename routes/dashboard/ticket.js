const express = require("express");
const { Ticket } = require("../../models/ticket");
const { Student } = require("../../models/student");
const { Teacher } = require("../../models/teacher");
const { Employee } = require("../../models/employee");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  if (req.user.role[0] === "Student")
    user = await Student.findById(req.user._id);
  if (req.user.role[0] === "Teacher")
    user = await Teacher.findById(req.user._id);
  if (req.user.role[0] === "Employee")
    user = await Employee.findById(req.user._id);

  //   console.log(user._id);
  const ticket = await Ticket.find({ userId: user._id }).sort("date");

  res.render("ticket", { responce: ticket });
});

module.exports = router;
