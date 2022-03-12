const jwt = require("jsonwebtoken");
require("dotenv").config();

const booking = (req, res, next) => {
  const token = req.cookies.booked;
  if (!token) {
    next();
  }
  // return res
  //   .status(401)
  //   .render("studentLogin", { error: "Acess denied. Please login." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.booked = decoded;
    // console.log(req.user);
    next();
  } catch (ex) {
    // lgoout with clear cookie message
    // req.flash("error_msg", "Invalid token. Please login.");
    // return res.redirect("/auth/student/login");
  }
};

module.exports = booking;
