const express = require("express");
const { Schedule, scheduleValidation } = require("../models/schedule");
const user = require("../middleware/user");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", user, async (req, res) => {
  const schedule = await Schedule.find({
    date: { $eq: new Date().toISOString().slice(0, 10) },
  }).sort("startTime");

  //   console.log(schedule);
  res.render("todaysSchedule", { responce: schedule });
});

//

module.exports = router;
