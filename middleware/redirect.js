const jwt = require("jsonwebtoken");
require("dotenv").config();

const user = (req, res, next) => {
  // const token = req.cookies.jwt;
  // let user = undefined;
  // if (!token) {
  //   console.log(`before `);

  //   console.log(`after`);
  // }
  if (typeof req.user != "undefined") return res.redirect("/dashboard");

  next();
};

module.exports = user;
