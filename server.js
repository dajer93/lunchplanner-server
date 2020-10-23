require("dotenv").config();
const express = require("express");
const passport = require("passport");
const localStrategy = require("passport-local");
const cors = require('cors');
const path = require('path');

const auth = require("./middleware/auth")();
require("./services/db");
const authRouter = require("./routes/auth");
const apiRouter = require("./routes/api");
const User = require("./models/User");

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(auth.initialize());
app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.get("/", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
