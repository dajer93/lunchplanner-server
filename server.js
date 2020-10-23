require('dotenv').config()
const express = require("express");

require("./services/db");
const authRouter = require("./routes/auth");
const apiRouter = require("./routes/api");

const app = express();

app.get("/", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.use(express.json())
app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
