require("dotenv").config();
const mongoose = require("mongoose");

// local
// mongoose
//   .connect("mongodb://localhost/diubuses")
//   .then(() => console.log(`connected`))
//   .catch((err) => console.log(err));
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connected`);
  })
  .catch((err) => console.log(err));
