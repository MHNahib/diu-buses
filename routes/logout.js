const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("booked");
  req.flash("error_msg", "Acess denied. Please login.");
  res.redirect("/auth/student/login");
});

module.exports = router;
