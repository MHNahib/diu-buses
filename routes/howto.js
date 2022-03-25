const express = require("express");
const mongoose = require("mongoose");
const user = require("../middleware/user");
const router = express.Router();

router.get("/", user, (req, res) => {
  res.render("howto", {});
});

//

module.exports = router;
