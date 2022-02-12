const express = require("express");
const asyncError = require("express-async-errors");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("index");
});

module.exports = router;
