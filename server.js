const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const mongoose = require("mongoose");

const morgan = require("morgan");

const methodOverride = require("method-override");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

const Fruit = require("./models/fruit.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

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
  res.redirect("/fruits");
});

app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
  console.log(allFruits);
  res.render("fruits/index.ejs", { fruits: allFruits });
});

app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  // a different, maybe not as good way
  // const foundFruit = await Fruit.find({ _id: req.params.fruitId });
  res.render("fruits/show.ejs", { fruit: foundFruit });
});

app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});

app.delete("/fruits/:fruitId", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
});

app.put("/fruits/:fruitId", async (req, res) => {
  if(req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  res.redirect(`/fruits/${req.params.fruitId}`);
}); 

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
