const express = require("express");
const helmet = require("helmet");
const asyncError = require("express-async-errors");
const db = require("./setup/db");
// routers path
const home = require("./routes/home");
const about = require("./routes/about");
const student = require("./routes/auth/student");
const employee = require("./routes/auth/employee");
const teacher = require("./routes/auth/teacher");
const bus = require("./routes/bus");
const route = require("./routes/route");
const schedule = require("./routes/schedule");
const pricing = require("./routes/pricing");
const tickets = require("./routes/ticket");
const drivers = require("./routes/driver");

const app = express();

// middleware
app.use(helmet());
app.use(express.json());
const error = require("./middleware/error");

// routers
app.use("/", home);
app.use("/about", about);
app.use("/auth/student", student);
app.use("/auth/employee", employee);
app.use("/auth/teacher", teacher);
app.use("/bus", bus);
app.use("/route", route);
app.use("/schedule", schedule);
app.use("/pricing", pricing);
app.use("/tickets", tickets);
app.use("/drivers", drivers);

app.use(error);

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`on port ${port}`);
});
