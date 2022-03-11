const express = require("express");
const { Schedule, scheduleValidation } = require("../../models/schedule");
const { Bus, busValidation } = require("../../models/bus");
const { Route, routeValidation } = require("../../models/route");
const { Driver } = require("../../models/dirver");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const schedule = await Schedule.find().sort("startTime");

  //   console.log(schedule);
  res.render("schedule", { responce: schedule });
});

// add scadule view
router.get("/add", async (req, res) => {
  const bus = await Bus.find().select("name").sort("name");
  const route = await Route.find().sort("name");
  const driver = await Driver.find().sort("driverName").select("driverName");
  // console.log(route);

  const rowList = [];
  let location = [];

  // store location
  for (let i = 0; i < route.length; i++) {
    for (let j = 0; j < route[i].busStoppages.length; j++) {
      rowList.push(route[i].busStoppages[j]);
    }
  }

  // removed duplicacy
  rowList.forEach((c) => {
    if (!location.includes(c)) {
      location.push(c);
    }
  });
  // console.log(location);

  res.render("createschedule", { bus, route, driver, location });
});

// add new schadule
router.post("/", async (req, res) => {
  let bus = await Bus.find().select("name").sort("name");
  let route = await Route.find().sort("name");
  let driver = await Driver.find().sort("driverName").select("driverName");

  const rowList = [];
  let location = [];

  // store location
  for (let i = 0; i < route.length; i++) {
    for (let j = 0; j < route[i].busStoppages.length; j++) {
      rowList.push(route[i].busStoppages[j]);
    }
  }

  // removed duplicacy
  rowList.forEach((c) => {
    if (!location.includes(c)) {
      location.push(c);
    }
  });

  // validate request
  //   console.log(req.body);
  const { error } = scheduleValidation(req.body);
  if (error)
    return res.status(400).render("createschedule", {
      error: error.details[0].message,
      bus,
      route,
      driver,
      location,
    });

  // check bus
  bus = await Bus.findById(req.body.busId);
  if (!bus) return res.status(404).send(`Bus not found`);

  route = await Route.findById(req.body.routeId);
  if (!route) return res.status(404).send(`Route not found`);

  driver = await Driver.findById(req.body.driverId);
  if (!route) return res.status(404).send(`Driver not found`);

  // add new bus
  const schedule = new Schedule({
    routeId: req.body.routeId,
    routeName: route.routeName,
    busStoppages: route.busStoppages,
    busId: req.body.name,
    busName: bus.name,
    driverId: req.body.driverId,
    driverName: driver.driverName,
    phone: driver.phone,
    startTime: req.body.startTime,
    availabeSeats: bus.seats,
    start: req.body.start,
    destination: req.body.destination,
  });

  await schedule.save();

  req.flash("success_msg", `Successfully added new schedule`);
  res.redirect("/dashboard/schedule");
});

// edit schadule
router.get("/:id", async (req, res) => {
  const schadule = await Schedule.findById(req.params.id);
  if (!schadule) return res.status(404).send(`Schedule not found`);

  const bus = await Bus.find().select("name").sort("name");
  const route = await Route.find().sort("name");
  const driver = await Driver.find().sort("driverName").select("driverName");

  const rowList = [];
  let location = [];

  // store location
  for (let i = 0; i < route.length; i++) {
    for (let j = 0; j < route[i].busStoppages.length; j++) {
      rowList.push(route[i].busStoppages[j]);
    }
  }

  // removed duplicacy
  rowList.forEach((c) => {
    if (!location.includes(c)) {
      location.push(c);
    }
  });

  res.render("editSchedule", {
    responce: schadule,
    bus,
    driver,
    route,
    location,
  });
});

// edit schedule
router.post("/:id", async (req, res) => {
  // check bus is valid or not
  const schadule = await Schedule.findById(req.params.id);
  if (!schadule) return res.status(404).send(`Schedule not found`);

  let bus = await Bus.find().select("name").sort("name");
  let route = await Route.find().sort("name");
  let driver = await Driver.find().sort("driverName").select("driverName");

  const rowList = [];
  let location = [];

  // store location
  for (let i = 0; i < route.length; i++) {
    for (let j = 0; j < route[i].busStoppages.length; j++) {
      rowList.push(route[i].busStoppages[j]);
    }
  }

  // removed duplicacy
  rowList.forEach((c) => {
    if (!location.includes(c)) {
      location.push(c);
    }
  });

  console.log(req.body);
  // validate request
  const { error } = scheduleValidation(req.body);
  if (error)
    return res.status(400).render("createschedule", {
      error: error.details[0].message,
      bus,
      route,
      driver,
      location,
    });

  // check bus
  bus = await Bus.findById(req.body.busId);
  if (!bus) return res.status(404).send(`Bus not found`);

  route = await Route.findById(req.body.routeId);
  if (!route) return res.status(404).send(`Route not found`);

  driver = await Driver.findById(req.body.driverId);
  if (!route) return res.status(404).send(`Driver not found`);

  schadule.routeId = req.body.routeId;
  schadule.routeName = route.routeName;
  schadule.busStoppages = route.busStoppages;
  schadule.busId = req.body.name;
  schadule.busName = bus.name;
  schadule.driverId = req.body.driverId;
  schadule.driverName = driver.driverName;
  schadule.phone = driver.phone;
  schadule.startTime = req.body.startTime;
  schadule.availabeSeats = bus.seats;
  schadule.start = req.body.start;
  schadule.destination = req.body.destination;
  await schadule.save();

  req.flash("success_msg", `Successfully updated.`);
  res.redirect("/dashboard/schedule");
});

// delete schedule
router.delete("/:id", async (req, res) => {
  const schadule = await Schedule.findByIdAndRemove(req.params.id);

  if (!schadule) return res.status(404).send("Schedule not found");

  req.flash("success_msg", "Successfully deleted.");
  res.redirect("/dashboard/schedule");
});

module.exports = router;
