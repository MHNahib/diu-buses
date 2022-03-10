require("dotenv").config();
const express = require("express");
const axios = require("axios");
// const auth = require("../middleware/auth");
// const roles = require("../middleware/roles");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("dashboard", {});
});

module.exports = router;
