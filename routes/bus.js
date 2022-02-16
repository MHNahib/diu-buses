const express = require("express");
const { Bus, busValidation } = require("../models/bus");
const mongoose = require("mongoose");

const router = express.Router();

// get bus list
router.get("/", async (req, res) => {
  const bus = await Bus.find().sort("name");

  res.send(bus);
});

// add new bus
router.post("/", async (req, res) => {
  // validate request
  const { error } = busValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // add new bus
  const bus = new Bus({
    name: req.body.name,
    type: req.body.type,
    sits: req.body.sits,
  });

  await bus.save();

  res.send(bus);
});

// edit bus
router.put("/:id", async (req, res) => {
  // validate requierst body
  const { error } = busValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(404).send(`Bus not found`);

  // check bus is valid or not
  const bus = await Bus.findById(req.params.id);

  if (!bus) return res.status(404).send("Bus not found");

  bus.name = req.body.name;
  bus.type = req.body.type;
  bus.sits = req.body.sits;

  await bus.save();

  res.send(bus);
});

// delete bus
router.delete("/:id", async (req, res) => {
  // validate requierst body
  const { error } = busValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(404).send(`Bus not found`);

  // check bus is valid or not and delete
  const bus = await Bus.findByIdAndRemove(req.params.id);

  if (!bus) return res.status(404).send("Bus not found");

  res.send(`successfully removed`);
});

module.exports = router;
