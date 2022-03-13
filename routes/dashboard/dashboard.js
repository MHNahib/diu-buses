require("dotenv").config();
const express = require("express");
const axios = require("axios");
const auth = require("../../middleware/auth");
const { RequestNewBus } = require("../../models/request.new.bus");
const { Schedule } = require("../../models/schedule");
const { Student } = require("../../models/student");
const { Teacher } = require("../../models/teacher");
const { Employee } = require("../../models/employee");
const { Ticket } = require("../../models/ticket");
// const roles = require("../middleware/roles");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  let user;

  // check user
  if (req.user.role[0] === "Student")
    user = await Student.findById(req.user._id);
  if (req.user.role[0] === "Teacher")
    user = await Teacher.findById(req.user._id);
  if (req.user.role[0] === "Employee")
    user = await Employee.findById(req.user._id);

  const ticket = await Ticket.find({ userId: user._id }).limit(5).sort("date");
  // const schedule = await Schedule.find().limit(5).sort("date");

  const schedule = await Schedule.find({
    date: { $gte: new Date().toISOString().slice(0, 10) },
  });

  if (user.isAdmin) {
    const requestNewBus = await RequestNewBus.find().limit(5).sort("date");
    return res.render("dashboard", { requestNewBus, ticket, schedule });
  }
  // console.log(schedule);

  res.render("dashboard", { ticket, schedule });
});

module.exports = router;
