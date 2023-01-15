require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.port || 2000;

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());

app.use("/", require("./routes/routes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
