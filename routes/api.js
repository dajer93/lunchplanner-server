const express = require("express");
const Calendar = require("../models/CalendarDay");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

const auth = require("../middleware/auth")();

const router = express.Router();

const isSameDay = (date1, date2) => {
  let dateObject1 = date1;
  let dateObject2 = date2;
  if (typeof date1 === "string") {
    dateObject1 = new Date(date1);
  }
  if (typeof date2 === "string") {
    dateObject2 = new Date(date2);
  }
  if (typeof date1 === "number") {
    dateObject1 = (new Date()).setTime(date1);
  }
  if (typeof date2 === "number") {
    dateObject2 = (new Date()).setTime(date2);
  }
  return (
    dateObject1.getDate() === dateObject2.getDate() &&
    dateObject1.getMonth() === dateObject2.getMonth() &&
    dateObject1.getYear() === dateObject2.getYear()
  );
}

router.get("/ingredients", auth.authenticate(), async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    if (!userId) {
      res.statusCode = 401;
      res.json({ ok: false, message: "Not authorized" });
    }

    const ingredients = await Ingredient.find({ createdBy: userId });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(ingredients);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ ok: false, message: "Something went wrong" });
  }
});

router.post("/ingredients", auth.authenticate(), async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    if (!userId) {
      res.statusCode = 401;
      res.json({ ok: false, message: "Not authorized" });
    }

    const newIngredient = new Ingredient({
      ...req.body,
      createdBy: req.user._id,
    });

    const saveIngredient = await newIngredient.save();

    res.statusCode = 200;
    res.json(saveIngredient);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ ok: false, message: "Something went wrong" });
  }
});

router.get("/recipes", auth.authenticate(), async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    if (!userId) {
      res.statusCode = 401;
      res.json({ ok: false, message: "Not authorized" });
    }

    const recipes = await Recipe.find({ createdBy: userId });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(recipes);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ ok: false, message: "Something went wrong" });
  }
});

router.post("/recipes", auth.authenticate(), async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    if (!userId) {
      res.statusCode = 401;
      res.json({ ok: false, message: "Not authorized" });
    }

    const newRecipe = new Recipe({
      ...req.body,
      createdBy: req.user._id,
    });

    const saveRecipe = await newRecipe.save();

    res.statusCode = 200;
    res.json(saveRecipe);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ ok: false, message: "Something went wrong" });
  }
});

router.delete("/recipes/:_id", auth.authenticate(), async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    if (!userId) {
      res.statusCode = 401;
      res.json({ ok: false, message: "Not authorized" });
    }

    const { _id } = req.params;

    if (!_id) {
      res.statusCode = 400;
      res.json({ ok: false, message: "No id set" });
    }

    await Recipe.deleteOne({ createdBy: userId, _id: _id });

    res.statusCode = 200;
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ ok: false, message: "Something went wrong" });
  }
});

router.get("/calendar", auth.authenticate(), async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    if (!userId) {
      res.statusCode = 401;
      res.json({ ok: false, message: "Not authorized" });
    }

    const calendar = await Calendar.find({ createdBy: userId });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(calendar);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ ok: false, message: "Something went wrong" });
  }
});

router.post("/calendar", auth.authenticate(), async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    if (!userId) {
      res.statusCode = 401;
      res.json({ ok: false, message: "Not authorized" });
    }

    const { date, foods } = req.body;

    if (!date) {
      res.statusCode = 400;
      res.json({ ok: false, message: "No date set" });
    }

    const savedCalendarDays = await Calendar.find({ createdBy: userId });
    const existingRecord = savedCalendarDays.find(({ date: savedDate }) => isSameDay(savedDate, date))

    if (existingRecord) {
      existingRecord.foods = [...existingRecord.foods, ...foods];

      await existingRecord.save();

      res.statusCode = 200;
      res.json(existingRecord);
    } else {
      const newCalendarDay = new Calendar({
        ...req.body,
        createdBy: req.user._id,
      });

      const createdRecord = await newCalendarDay.save();

      res.statusCode = 200;
      res.json(createdRecord);
    }
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ ok: false, message: "Something went wrong" });
  }
});

router.delete("/calendar/:date/:_id", auth.authenticate(), async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    if (!userId) {
      res.statusCode = 401;
      res.json({ ok: false, message: "Not authorized, no user id" });
    }

    const { date, _id: foodId } = req.params;

    if (!date) {
      res.statusCode = 400;
      res.json({ ok: false, message: "No date set" });
    }

    const existingRecord = await Calendar.findOne({ createdBy: userId, date });

    if (existingRecord) {
      const indexOfFood = existingRecord.foods.findIndex(
        ({ _id }) => _id === foodId
      );

      existingRecord.foods = [
        ...existingRecord.foods.slice(0, indexOfFood),
        ...existingRecord.foods.slice(indexOfFood + 1),
      ];

      existingRecord.save();

      res.statusCode = 200;
      res.json({ ok: true });
    } else {
      res.statusCode = 200;
      res.json({ ok: false });
    }

    
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ ok: false, message: "Something went wrong" });
  }
});

module.exports = router;
