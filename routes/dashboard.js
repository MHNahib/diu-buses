const express = require("express");
const { Driver, driverValidation } = require("../models/dirver");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("dashboard", {});
});

module.exports = router;
