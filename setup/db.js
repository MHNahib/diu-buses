const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/diubuses")
  .then(() => console.log(`connected`))
  .catch((err) => console.log(err));
