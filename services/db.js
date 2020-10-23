require("dotenv").config();
const mongoose = require("mongoose");

const { DB_USER = "", DB_PASS = "", DB_HOST, DB_PORT, DB_NAME } = process.env;

mongoose.connect(
  `mongodb://${DB_USER ? `${DB_USER}@${DB_PASS}` : ''}${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    useNewUrlParser: true,
  }
);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log(`connected to database ${DB_NAME}`));
