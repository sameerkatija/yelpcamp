const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campgroundID = req.params.id;
  const campground = await Campground.findById(campgroundID);
  const reviewBody = req.body.review;
  const review = await new Review(reviewBody);
  review.author = req.user._id;
  await review.save();
  campground.reviews.push(review);
  await campground.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campgroundID}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewID } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewID },
  });
  await Review.findByIdAndDelete(reviewID);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/campgrounds/${id}`);
};
