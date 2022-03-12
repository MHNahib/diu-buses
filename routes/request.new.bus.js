const express = require("express");
const { Schedule, scheduleValidation } = require("../models/schedule");
const { Bus, busValidation } = require("../models/bus");
const { Route, routeValidation } = require("../models/route");
const { Driver } = require("../models/dirver");
const { RequestNewBus } = require("../models/request.new.bus");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const requestNewBus = await RequestNewBus.find().sort("date");

  res.render("request", { responce: requestNewBus });
});

// // add request view
// router.get("/add", async (req, res) => {
//   const bus = await Bus.find().select("name").sort("name");
//   const route = await Route.find().sort("name");
//   const driver = await Driver.find().sort("driverName").select("driverName");
//   // console.log(route);

//   const rowList = [];
//   // let location = [];

//   // store location
//   for (let i = 0; i < route.length; i++) {
//     for (let j = 0; j < route[i].busStoppages.length; j++) {
//       rowList.push(route[i].busStoppages[j]);
//     }
//   }

//   const location = [...new Set(rowList)];

//   res.render("createRequest", { bus, route, driver, location });
// });

// // add new request
// router.post("/", async (req, res) => {
//   let bus = await Bus.find().select("name").sort("name");
//   let route = await Route.find().sort("name");
//   let driver = await Driver.find().sort("driverName").select("driverName");

//   const rowList = [];
//   // let location = [];

//   // store location
//   for (let i = 0; i < route.length; i++) {
//     for (let j = 0; j < route[i].busStoppages.length; j++) {
//       rowList.push(route[i].busStoppages[j]);
//     }
//   }

//   const location = [...new Set(rowList)];

//   // validate request
//   //   console.log(req.body);
//   const { error } = scheduleValidation(req.body);
//   if (error)
//     return res.status(400).render("createschedule", {
//       error: error.details[0].message,
//       bus,
//       route,
//       driver,
//       location,
//     });

//   // check bus
//   bus = await Bus.findById(req.body.busId);
//   if (!bus) return res.status(404).send(`Bus not found`);

//   route = await Route.findById(req.body.routeId);
//   if (!route) return res.status(404).send(`Route not found`);

//   driver = await Driver.findById(req.body.driverId);
//   if (!route) return res.status(404).send(`Driver not found`);

//   // add new bus
//   const schedule = new Schedule({
//     routeId: req.body.routeId,
//     routeName: route.routeName,
//     busStoppages: route.busStoppages,
//     busId: req.body.name,
//     busName: bus.name,
//     driverId: req.body.driverId,
//     driverName: driver.driverName,
//     phone: driver.phone,
//     startTime: req.body.startTime,
//     availabeSeats: bus.seats,
//     start: req.body.start,
//     destination: req.body.destination,
//   });

//   await schedule.save();

//   req.flash("success_msg", `Successfully added new schedule`);
//   res.redirect("/dashboard/request");
// });

// edit request
router.get("/:id", async (req, res) => {
  const requestNewBus = await RequestNewBus.findById(req.params.id);
  // console.log(requestNewBus);
  const schadule = await Schedule.findById(requestNewBus.bookedSchedule);
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

  res.render("editRequest", {
    responce: requestNewBus,
    bus,
    driver,
    route,
    location,
  });
});

// edit request
router.post("/:id", async (req, res) => {
  // check request new bus
  const requestNewBus = await RequestNewBus.findById(req.params.id);

  if (!requestNewBus) return res.status(404).send(`Report not found`);

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
    return res.status(400).render("createRequest", {
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

  // console.log(requestNewBus);
  if (!requestNewBus.hasOwnProperty("newSchedule")) {
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
    requestNewBus.newSchedule = schedule._id;
    requestNewBus.status = true;
    await requestNewBus.save();

    req.flash("success_msg", `Successfully added.`);
    return res.redirect("/dashboard/request");
  }
  // check bus is valid or not
  let schadule = await Schedule.findById(requestNewBus.newSchedule);
  // console.log(`on post`);
  if (!requestNewBus.newSchedule)
    if (!schadule) return res.status(404).send(`Schedule not found`);
  // console.log(schadule);
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
  res.redirect("/dashboard/request");
});

// delete schedule
router.delete("/:id", async (req, res) => {
  const requestNewBus = await RequestNewBus.findByIdAndRemove(req.params.id);

  if (!schadule) return res.status(404).send("Schedule not found");

  req.flash("success_msg", "Successfully deleted.");
  res.redirect("/dashboard/request");
});

module.exports = router;
