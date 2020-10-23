const express = require("express");
// const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const apiRouter = require("./routes/api");

const app = express();

app.get("/", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
