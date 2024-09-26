const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: false }));

const Fruit = require("./models/fruit.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});
// server.js

// POST /fruitsd
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits/new");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
