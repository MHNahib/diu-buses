const express = require("express");
const express = require("helmet");
const asyncError = require("express-async-errors");
// routers path
const home = require("./routes/home");
const about = require("./routes/about");

// middleware
app.use(helmet());
const error = require("./middleware/error");

const app = express();

// routers
app.use("/", home);
app.use("/about", about);

app.use(error);

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`on port ${port}`);
});
