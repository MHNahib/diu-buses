const jwt = require("jsonwebtoken");
require("dotenv").config();

const user = (req, res, next) => {
  if (!req.user.isAdmin) return res.redirect("/dashboard");

  next();
};

module.exports = user;
