const express = require("express");
const { Bus, busValidation } = require("../../models/bus");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  const bus = await Bus.find().select("name type seats").sort("name");

  res.render("bus", { responce: bus });
});

// add bus view
router.get("/add", async (req, res) => {
  res.render("createBus", {});
});

// add new bus
router.post("/", async (req, res) => {
  // validate request
  // console.log(typeof req.body.seats);
  const { error } = busValidation(req.body);
  if (error)
    return res
      .status(400)
      .render("createBus", { error: error.details[0].message });

  // add new bus
  const bus = new Bus({
    name: req.body.name,
    type: req.body.type,
    seats: req.body.seats,
  });

  await bus.save();

  req.flash("success_msg", `Successfully added ${req.body.name}`);
  res.redirect("/dashboard/bus");
});

// edit driver
router.get("/:id", async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) return res.status(404).send(`Bus not found`);

  res.render("editBus", { responce: bus });
});

// edit bus
router.post("/:id", async (req, res) => {
  // check bus is valid or not
  const bus = await Bus.findById(req.params.id);

  if (!bus) return res.status(404).send("Bus not found");

  // validate requierst body
  const { error } = busValidation(req.body);
  if (error)
    return res.status(400).render("editBus", {
      error: error.details[0].message,
      responce: bus,
    });

  bus.name = req.body.name;
  bus.type = req.body.type;
  bus.seats = req.body.seats;

  await bus.save();

  req.flash("success_msg", `Successfully updated ${req.body.name}`);
  res.redirect("/dashboard/bus");
});

// delete bus
router.delete("/:id", async (req, res) => {
  // check bus is valid or not and delete
  const bus = await Bus.findByIdAndRemove(req.params.id);

  if (!bus) return res.status(404).send("Bus not found");

  req.flash("success_msg", "Successfully deleted.");
  res.redirect("/dashboard/bus");
});

module.exports = router;
