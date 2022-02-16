const express = require("express");
const helmet = require("helmet");
const asyncError = require("express-async-errors");
const db = require("./setup/db");
// routers path
const home = require("./routes/home");
const about = require("./routes/about");
const student = require("./routes/auth/student");

const app = express();

// middleware
app.use(helmet());
app.use(express.json());
const error = require("./middleware/error");

// routers
app.use("/", home);
app.use("/about", about);
app.use("/auth/student", student);

app.use(error);

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`on port ${port}`);
});
