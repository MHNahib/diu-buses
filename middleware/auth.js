const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash("error_msg", "Acess denied. Please login.");
    return res.redirect("/auth/student/login");
  }
  // return res
  //   .status(401)
  //   .render("studentLogin", { error: "Acess denied. Please login." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = decoded;
    // console.log(req.user);
    next();
  } catch (ex) {
    // res
    //   .status(400)
    //   .render("studentLogin", { error: "Invalid token. Please login." });

    req.flash("error_msg", "Invalid token. Please login.");
    return res.redirect("/auth/student/login");
  }
};

module.exports = auth;
