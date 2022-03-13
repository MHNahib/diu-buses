const jwt = require("jsonwebtoken");
require("dotenv").config();

const user = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    req.user = undefined;
    res.locals.user = undefined;
    // console.log("onuser");
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
      // console.log("try");
      // return res.redirect("/dashboard");
    } catch (ex) {
      console.log("catch");
      console.log(ex);
    }
  }

  next();
};

module.exports = user;
