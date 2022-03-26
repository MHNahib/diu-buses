const express = require("express");
const Joi = require("joi");
const { Route, routeValidation } = require("../models/route");
const { Schedule } = require("../models/schedule");
const user = require("../middleware/user");
const redirect = require("../middleware/redirect");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", user, async (req, res) => {
  const route = await Route.find();
  // console.log(route);

  const rowList = [];
  // let location = [];

  // store location
  // for (let i = 0; i < route.length; i++) {
  //   for (let j = 0; j < route[i].busStoppages.length; j++) {
  //     rowList.push(route[i].busStoppages[j]);
  //   }
  // }

  // const location = [...new Set(rowList)];

  res.render("search", { responce: route });
});

// search schedule
router.post("/", user, async (req, res) => {
  // validate request
  const { error } = validation(req.body);
  if (error)
    return res
      .status(400)
      .render("search", { error: error.details[0].message });

  // console.log(req.body);

  // const start = req.body.start.trim();
  // console.log(start);
  const schedule = await Schedule.find({
    // start: /.*Dhanmondi - Sobhanbag.*/i,
    // busStoppages: { $in: [{ `$regex: s| req.body.start/gi }`] },
    // busStoppages: { $in: [`/.*${req.body.start}.*/i`] },
    busStoppages: { $in: [req.body.start.trim(), req.body.destination.trim()] },
    startTime: { $eq: req.body.startTime },
    date: { $gte: new Date().toISOString().slice(0, 10) },
  });

  // console.log(schedule);
  if (schedule.length === 0) {
    req.flash(
      "error_msg",
      "No bus found! Try with different location or time."
    );
    return res.redirect("/search");
  }
  res.render("show", {
    responce: schedule,
    location: { from: req.body.start.trim(), to: req.body.destination.trim() },
  });
});

// show search result
// router.get("/result", (req, res) => {
//   res.render("show", { responce: {} });
// });

const validation = (body) => {
  const schema = Joi.object({
    startTime: Joi.string().required(),
    start: Joi.string().required(),
    destination: Joi.string().required(),
  });
  return schema.validate(body);
};

module.exports = router;
