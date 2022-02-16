const express = require("express");
const { Pricing, pricingValidation } = require("../models/pricing");
const { Route } = require("../models/route");
const mongoose = require("mongoose");

const router = express.Router();

// get all pricing list
router.get("/:id", async (req, res) => {
  // validate mongoose id validation
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(403).send(`Id is not valid`);

  // check id exists or not
  const pricing = await Pricing.find({ routeId: req.params.id });
  if (!pricing) return res.status(404).send(`Route not fond`);

  res.send(pricing);
});

router.post("/", async (req, res) => {
  // validate request body
  const { error } = pricingValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check route id exists or not
  const route = await Route.findById(req.body.routeId);
  if (!route) return res.status(404).send(`Route not found`);

  const pricing = new Pricing({
    routeId: req.body.routeId,
    from: req.body.from,
    to: req.body.to,
    price: req.body.price,
  });

  await pricing.save();
  res.send(pricing);
});

// edit pricing
router.put("/:id", async (req, res) => {
  // check pricing is exist or not
  const pricing = await Pricing.findById(req.params.id);
  if (!pricing) return res.status(404).send(`Pricing id not found`);

  // validate request body
  const { error } = pricingValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check route id exists or not
  const route = await Route.findById(req.body.routeId);
  if (!route) return res.status(404).send(`Route not found`);

  pricing.routeId = req.body.routeId;
  pricing.from = req.body.from;
  pricing.to = req.body.to;
  pricing.price = req.body.price;

  await pricing.save();
  res.send(pricing);
});

// delelte pricing
router.delete("/:id", async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) return res.status(403).send(`invalid schedule id`);

  const pricing = await Pricing.findByIdAndRemove(req.params.id);

  if (!pricing) return res.status(404).send("Pricing not found");

  res.send(`successfully removed`);
});

module.exports = router;
