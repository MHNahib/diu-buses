require("dotenv").config();
const express = require("express");
const axios = require("axios");
const Joi = require("joi");
const mongoose = require("mongoose");
const { Route, routeValidation } = require("../../models/route");
const auth = require("../../middleware/auth");
const restrict = require("../../middleware/restrict");
const router = express.Router();

// route
router.get("/", auth, restrict, async (req, res) => {
  const route = await Route.find()
    .sort("name")
    .select("_id routeNo busStoppages routeName");

  // const responce = await axios.get(`${process.env.LOCAL_URL}/route`);
  res.render("route", { responce: route });
});

router.get("/add", auth, restrict, async (req, res) => {
  res.render("createRoute", {});
});

// add new rote
router.post("/", auth, restrict, async (req, res) => {
  // validate request body
  const { error } = validation(req.body);
  if (error)
    return res
      .status(400)
      .render("editRoute", { error: error.details[0].message });

  let busStoppageStr = req.body.busStoppages.replace(/\s+/g, " ").trim();
  // console.log(busStoppageStr);
  const splitArray = busStoppageStr.split(",");
  // console.log(splitArray);
  const trimmed = splitArray.map((element) => {
    return element.trim();
  });
  // console.log(trimmed);
  req.body.busStoppages = trimmed;

  const route = new Route({
    routeNo: req.body.routeNo,
    busStoppages: req.body.busStoppages,
    routeName: req.body.routeName,
  });

  await route.save();
  req.flash("success_msg", `Successfully added ${req.body.routeNo}`);
  res.redirect("/dashboard/route");
});
// router edit view
router.get("/:id", auth, restrict, async (req, res) => {
  const responce = await axios.get(
    `${process.env.LOCAL_URL}/route/${req.params.id}`
  );
  res.render("editRoute", { responce: responce.data });
});

// route edit post
router.post("/:id", auth, restrict, async (req, res) => {
  const { error } = validation(req.body);

  if (error)
    return res
      .status(400)
      .render("editRoute", { error: error.details[0].message });

  const route = await Route.findById(req.params.id);
  if (!route) return res.status(404).send(`Route not found`);

  let busStoppageStr = req.body.busStoppages.replace(/\s+/g, " ").trim();
  // console.log(busStoppageStr);
  const splitArray = busStoppageStr.split(",");
  // console.log(splitArray);
  const trimmed = splitArray.map((element) => {
    return element.trim();
  });
  // console.log(trimmed);
  req.body.busStoppages = trimmed;

  route.routeNo = req.body.routeNo;
  route.busStoppages = req.body.busStoppages;
  route.routeName = req.body.routeName;
  await route.save();

  res.redirect("/dashboard/route");
});

const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    routeNo: Joi.string().max(10).required(),
    busStoppages: Joi.string().required(),
    routeName: Joi.string().max(255).required(),
  });
  return schema.validate(body);
};

// view delete
router.delete("/:id", auth, restrict, async (req, res) => {
  const route = await Route.findByIdAndRemove(req.params.id);

  if (!route) return res.status(404).send("Route not found");

  req.flash("success_msg", "Successfully deleted.");
  res.redirect("/dashboard/route");
});

module.exports = router;
