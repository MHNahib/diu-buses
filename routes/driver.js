const express = require("express");
const { Driver, driverValidation } = require("../models/dirver");
const mongoose = require("mongoose");
const router = express.Router();

// get all the driver list
router.get("/", async (req, res) => {
  const driver = await Driver.find().select("driverName phone");

  res.send(driver);
});

// add new driver
router.post("/", async (req, res) => {
  const { error } = driverValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const driver = new Driver({
    driverName: req.body.driverName,
    phone: req.body.phone,
  });
  await driver.save();

  res.send({
    driverName: req.body.driverName,
    phone: req.body.phone,
    status: "success",
  });
});

// update driver
router.put("/:id", async (req, res) => {
  const { error } = driverValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).send(`Route not found`);

  driver.driverName = req.body.driverName;
  driver.phone = req.body.phone;

  await driver.save();

  res.send({
    driverName: req.body.driverName,
    phone: req.body.phone,
    status: "success",
  });
});

// delete driver
router.delete("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(403).send(`invalid driver id`);

  const driver = await Driver.findByIdAndRemove(req.params.id);

  if (!driver) return res.status(404).send("Driver not found");

  res.send(`successfully removed`);
});

module.exports = router;
