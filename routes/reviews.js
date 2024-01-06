const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
// Controllers
const reviews = require("../controllers/reviews");

// Validation Schema
const { validateReview } = require("../middlewares/ValidationSchemas");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { isReviewAuthor } = require("../middlewares/authoriztion");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete(
  "/:reviewID",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
