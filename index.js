const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

// Connecting mongodb
mongoose.connect("mongodb://localhost:27017/yelpcamp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected!");
});

// apps middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.send("I am Working");
});

app.listen(3000, () => {
  console.log("app is listening on http://127.0.0.1:3000");
});
