const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("booked");
  req.flash("success_msg", "Successfully logout.");
  res.redirect("/auth/student/login");
});

module.exports = router;
