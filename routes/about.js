const express = require("express");
const user = require("../middleware/user");
const router = express.Router();

router.get("/", user, (req, res) => {
  res.render("about");
});

module.exports = router;
