const express = require("express");
const { Schedule, scheduleValidation } = require("../../models/schedule");
const { Bus, busValidation } = require("../../models/bus");
const { Route, routeValidation } = require("../../models/route");
const { Driver } = require("../../models/dirver");
const auth = require("../../middleware/auth");
const restrict = require("../../middleware/restrict");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", auth, restrict, async (req, res) => {
  const schedule = await Schedule.find({
    date: { $gte: new Date().toISOString().slice(0, 10) },
  })
    .sort("startTime date")
    .limit(20);

  //   console.log(schedule);
  res.render("schedule", { responce: schedule });
});

router.post("/search", auth, restrict, async (req, res) => {
  const schedule = await Schedule.find({
    date: { $eq: req.body.date },
  }).sort("startTime");

  //   console.log(schedule);
  res.render("schedule", {
    responce: schedule,
  });
});

// add scadule view
router.get("/add", auth, restrict, async (req, res) => {
  const bus = await Bus.find().select("name").sort("name");
  const route = await Route.find().sort("name");
  const driver = await Driver.find().sort("driverName").select("driverName");
  // console.log(route);

  const rowList = [];
  // let location = [];

  // store location
  for (let i = 0; i < route.length; i++) {
    for (let j = 0; j < route[i].busStoppages.length; j++) {
      rowList.push(route[i].busStoppages[j]);
    }
  }

  const location = [...new Set(rowList)];

  res.render("createSchedule", { bus, route, driver, location });
});

// add new schadule
router.post("/", auth, restrict, async (req, res) => {
  let bus = await Bus.find().select("name").sort("name");
  let route = await Route.find().sort("name");
  let driver = await Driver.find().sort("driverName").select("driverName");

  const rowList = [];
  // let location = [];

  // store location
  for (let i = 0; i < route.length; i++) {
    for (let j = 0; j < route[i].busStoppages.length; j++) {
      rowList.push(route[i].busStoppages[j]);
    }
  }

  const location = [...new Set(rowList)];

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

  // console.log(req.body);

  // check bus
  bus = await Bus.findById(req.body.busId);
  if (!bus) return res.status(404).send(`Bus not found`);

  route = await Route.findById(req.body.routeId);
  if (!route) return res.status(404).send(`Route not found`);

  driver = await Driver.findById(req.body.driverId);
  if (!route) return res.status(404).send(`Driver not found`);

  // add new bus

  // calcuate date diffrerence
  const endDate = new Date(req.body.scheduleTo);
  const startDate = new Date(req.body.scheduleFrom);
  const diff = new Date(endDate - startDate) / (1000 * 3600 * 24);
  // console.log(`diff: ${diff}`);
  const offDays = [];

  if (req.body.saturday === "on") offDays.push(6);
  if (req.body.sunday === "on") offDays.push(0);
  if (req.body.monday === "on") offDays.push(1);
  if (req.body.tuesday === "on") offDays.push(2);
  if (req.body.wednesday === "on") offDays.push(3);
  if (req.body.thursday === "on") offDays.push(4);
  if (req.body.friday === "on") offDays.push(5);

  if (diff === 0) {
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
      date: startDate,
    });
    await schedule.save();
  } else {
    for (let i = 0; i <= diff; i++) {
      let day = startDate.getDay();
      // console.log(`day: ${day} `);
      if (offDays.includes(day)) {
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
          date: startDate,
        });
        await schedule.save();
        startDate.setDate(startDate.getDate() + 1);
        // console.log(i);
        // console.log(startDate);
      } else {
        startDate.setDate(startDate.getDate() + 1);
        continue;
      }
    }
  }

  req.flash("success_msg", `Successfully added new schedule`);
  res.redirect("/dashboard/schedule");
});

// edit schadule
router.get("/:id", auth, restrict, async (req, res) => {
  const schadule = await Schedule.findById(req.params.id);
  if (!schadule) return res.status(404).send(`Schedule not found`);

  const bus = await Bus.find().select("name").sort("name");
  const route = await Route.find().sort("name");
  const driver = await Driver.find().sort("driverName").select("driverName");

  const rowList = [];
  // let location = [];

  // store location
  for (let i = 0; i < route.length; i++) {
    for (let j = 0; j < route[i].busStoppages.length; j++) {
      rowList.push(route[i].busStoppages[j]);
    }
  }

  const location = [...new Set(rowList)];

  res.render("editSchedule", {
    responce: schadule,
    bus,
    driver,
    route,
    location,
  });
});

// edit schedule
router.post("/:id", auth, restrict, async (req, res) => {
  // check bus is valid or not
  const schadule = await Schedule.findById(req.params.id);
  if (!schadule) return res.status(404).send(`Schedule not found`);

  let bus = await Bus.find().select("name").sort("name");
  let route = await Route.find().sort("name");
  let driver = await Driver.find().sort("driverName").select("driverName");

  const rowList = [];
  // let location = [];

  // store location
  for (let i = 0; i < route.length; i++) {
    for (let j = 0; j < route[i].busStoppages.length; j++) {
      rowList.push(route[i].busStoppages[j]);
    }
  }

  const location = [...new Set(rowList)];

  // console.log(req.body);
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
router.delete("/:id", auth, restrict, async (req, res) => {
  const schadule = await Schedule.findByIdAndRemove(req.params.id);

  if (!schadule) return res.status(404).send("Schedule not found");

  req.flash("success_msg", "Successfully deleted.");
  res.redirect("/dashboard/schedule");
});

module.exports = router;
