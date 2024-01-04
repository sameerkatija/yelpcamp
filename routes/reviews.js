const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
// models
const Campground = require("../models/campground");
const Review = require("../models/review");

// Validation Schema
const { validateReview } = require("../middlewares/ValidationSchemas");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campgroundID = req.params.id;
    const campground = await Campground.findById(campgroundID);
    const reviewBody = req.body.review;
    const review = await new Review(reviewBody);
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campgroundID}`);
  })
);

router.delete(
  "/:reviewID",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewID },
    });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
