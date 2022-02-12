const express = require("express");

// routers path
const home = require("./routes/home");

// middleware
const error = require("./middleware/error");

const app = express();

// routers
app.use("/", home);

app.use(error);

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`on port ${port}`);
});
