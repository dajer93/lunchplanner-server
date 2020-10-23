const express = require('express');
const passport = require('passport');

const auth = require('../middleware/auth')();

const router = express.Router();

router.get("/recipes", auth.authenticate(), (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

router.post("/recipes", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

router.get("/week", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

router.post("/week", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

module.exports = router;