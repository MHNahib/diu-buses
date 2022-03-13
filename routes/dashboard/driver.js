const express = require("express");
const { Driver, driverValidation } = require("../../models/dirver");
const auth = require("../../middleware/auth");
const restrict = require("../../middleware/restrict");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", auth, restrict, async (req, res) => {
  const driver = await Driver.find().select("driverName phone");

  res.render("driver", { responce: driver });
});

// add dirver view
router.get("/add", auth, restrict, async (req, res) => {
  res.render("createDriver", {});
});

// add new driver
router.post("/", auth, restrict, async (req, res) => {
  const { error } = driverValidation(req.body);

  if (error)
    return res
      .status(400)
      .render("createDriver", { error: error.details[0].message });

  const driver = new Driver({
    driverName: req.body.driverName,
    phone: req.body.phone,
  });
  await driver.save();

  req.flash("success_msg", `Successfully added ${req.body.driverName}`);
  res.redirect("/dashboard/drivers");
});

// edit driver
router.get("/:id", auth, restrict, async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).send(`Route not found`);

  res.render("editDriver", { responce: driver });
});

// update driver
router.post("/:id", auth, restrict, async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).send(`Route not found`);

  const { error } = driverValidation(req.body);
  if (error)
    return res.status(400).render("editDriver", {
      error: error.details[0].message,
      responce: driver,
    });

  driver.driverName = req.body.driverName;
  driver.phone = req.body.phone;

  await driver.save();
  req.flash("success_msg", `Successfully updated ${req.body.driverName}`);
  res.redirect("/dashboard/drivers");
});

// delete driver
router.delete("/:id", auth, restrict, async (req, res) => {
  const driver = await Driver.findByIdAndRemove(req.params.id);

  if (!driver) return res.status(404).send("Driver not found");

  req.flash("success_msg", "Successfully deleted.");
  res.redirect("/dashboard/drivers");
});

module.exports = router;
