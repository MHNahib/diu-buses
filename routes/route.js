const express = require("express");
const { Route, routeValidation } = require("../models/route");
const mongoose = require("mongoose");
const router = express.Router();

// get all the route list
router.get("/", async (req, res) => {
  const route = await Route.find().sort("name");

  res.send(route);
});

// add new rote
router.post("/", async (req, res) => {
  // validate request body
  const { error } = routeValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const route = new Route({
    routeNo: req.body.routeNo,
    busStoppages: req.body.busStoppages,
    routeName: req.body.routeName,
  });

  await route.save();

  res.send(route);
});

// edit route
router.put("/:id", async (req, res) => {
  // validate request body
  const { error } = routeValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(404).send(`Route not found`);

  const route = await Route.findById(req.params.id);
  if (!route) return res.status(404).send(`Route not found`);

  route.routeNo = req.body.routeNo;
  route.busStoppages = req.body.busStoppages;
  route.routeName = req.body.routeName;
  await route.save();

  res.send(route);
});

// delete route
router.delete("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(403).send(`invalid route id`);

  const route = await Route.findByIdAndRemove(req.params.id);

  if (!route) return res.status(404).send("Route not found");

  res.send(`successfully removed`);
});

module.exports = router;
