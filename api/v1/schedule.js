const express = require("express");
const { Schedule, scheduleValidation } = require("../../models/schedule");
const { Route } = require("../../models/route");
const mongoose = require("mongoose");
const router = express.Router();

// get all the scadule
router.get("/", async (req, res) => {
  const schedule = await Schedule.find().sort("startTime");

  res.send(schedule);
});

// add scadule
router.post("/", async (req, res) => {
  // validatre requirest body
  const { error } = scheduleValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate object id
  const isValid = mongoose.Types.ObjectId.isValid(req.body.routeId);
  if (!isValid) return res.status(403).send(`Route id is not valid`);

  // check route is exist or not
  const route = await Route.findById(req.body.routeId);

  if (!route) return res.status(404).send(`Route not found`);

  const schedule = new Schedule({
    routeId: req.body.routeId,
    startTime: req.body.startTime,
    departureTime: req.body.departureTime,
  });

  await schedule.save();

  res.send(schedule);
});

// edit scadule
router.put("/:id", async (req, res) => {
  // validatre requirest body
  const { error } = scheduleValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate object id
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(403).send(`Schedule id is not valid`);

  // check route is exist or not
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) return res.status(404).send(`Schedule not found`);

  schedule.routeId = req.body.routeId;
  schedule.startTime = req.body.startTime;
  schedule.departureTime = req.body.departureTime;

  await schedule.save();

  res.send(schedule);
});

// delelte scadule
router.delete("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(403).send(`invalid schedule id`);

  const schedule = await Schedule.findByIdAndRemove(req.params.id);

  if (!schedule) return res.status(404).send("Route not found");

  res.send(`successfully removed`);
});

module.exports = router;
