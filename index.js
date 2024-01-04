const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

// Routes
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

// Connecting mongodb
mongoose.connect("mongodb://localhost:27017/yelpcamp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected!");
});

//sessions config

const sessionConfig = {
  secret: "I will change this later",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 27 * 7,
    maxAge: 1000 * 60 * 60 * 27 * 7,
  },
};
app.use(session(sessionConfig));
// config flash
app.use(flash());
// apps middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Setting Flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.send("I am Working");
});

app.use("/campgrounds", campgrounds);

app.use("/campgrounds/:id/reviews", reviews);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("app is listening on http://127.0.0.1:3000");
});
