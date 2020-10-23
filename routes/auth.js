const express = require("express");
const passport = require("passport");
const jwt = require("jwt-simple");

const config = require("../config.js");
const User = require("../models/User");

const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log("Error Happened In auth /token Route");
    } else {
      var payload = {
        id: user.id,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
      };
      var token = jwt.encode(payload, config.jwtSecret);
      res.json({
        token: token,
      });
    }
  });
});

router.post("/register", (req, res, next) => {
  const newUser = new User({
    username: req.body.email,
    name: req.body.name
  });

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({
        ok: false,
        errcode: "REGISTER_ERROR",
        message: err,
      });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ ok: true, status: "Registration Successful!" });
    }
  });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

router.get("/verification", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

module.exports = router;
