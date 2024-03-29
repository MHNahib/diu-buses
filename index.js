require("dotenv").config();
const express = require("express");
const path = require("path");
// const helmet = require("helmet");
const asyncError = require("express-async-errors");
const cookieParser = require("cookie-parser");
const db = require("./setup/db");
const passport = require("passport");
const flash = require("connect-flash");
const flashMsg = require("./middleware/flash");
const session = require("express-session");
const methodOverride = require("method-override");
// routers path
const home = require("./routes/home");
const about = require("./routes/about");
const logout = require("./routes/logout");
const student = require("./routes/auth/student");
const employee = require("./routes/auth/employee");
const teacher = require("./routes/auth/teacher");
const bus = require("./routes/bus");
const route = require("./routes/route");
const schedule = require("./routes/schedule");
const pricing = require("./routes/pricing");
const tickets = require("./routes/ticket");
const drivers = require("./routes/driver");
const howto = require("./routes/howto");
const dashboard = require("./routes/dashboard/dashboard");
const dashboardRoute = require("./routes/dashboard/routes");
const dashboardDriver = require("./routes/dashboard/driver");
const dashboardBus = require("./routes/dashboard/bus");
const dashboardSchedule = require("./routes/dashboard/schedule");
const search = require("./routes/search");
const bookSeat = require("./routes/book.seat");
const requestNewBus = require("./routes/request.new.bus");
const ticketDetails = require("./routes/dashboard/ticket");
const resetPassword = require("./routes/reset.password");

const app = express();
app.use(express.urlencoded({ extended: true }));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// flash
app.use(flash());
app.use(flashMsg);
app.use(methodOverride("_method"));

// public folder
app.use(express.static(__dirname + "/public"));

// passport config
// const initializePassport = require("./config/passport.config");

// initializePassport(passport);

// middleware
// app.use(helmet());
app.use(express.json());
app.use(cookieParser());
const error = require("./middleware/error");

// view engine
app.set("view engine", "ejs");

// routers
app.use("/", home);
app.use("/about", about);
app.use("/logout", logout);
app.use("/auth/student", student);
app.use("/auth/employee", employee);
app.use("/auth/teacher", teacher);
app.use("/bus", bus);
app.use("/route", route);
app.use("/schedule", schedule);
app.use("/pricing", pricing);
app.use("/tickets", tickets);
app.use("/drivers", drivers);
app.use("/search", search);
app.use("/book-seat", bookSeat);
app.use("/reset-password", resetPassword);
app.use("/how-to", howto);
app.use("/dashboard", dashboard);
app.use("/dashboard/route", dashboardRoute);
app.use("/dashboard/drivers", dashboardDriver);
app.use("/dashboard/bus", dashboardBus);
app.use("/dashboard/schedule", dashboardSchedule);
app.use("/dashboard/request", requestNewBus);
app.use("/dashboard/ticket", ticketDetails);

app.use(error);

// 404 page
app.get("*", (req, res) => {
  res.render("404", { title: `404` });
});
// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`on port ${port}`);
});
