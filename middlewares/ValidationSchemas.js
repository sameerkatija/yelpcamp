const Joi = require("joi");
const ExpressError = require("../utils/ExpressError");

module.exports.validateCampground = (req, res, next) => {
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().min(0).required(),
      // image: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
    }).required(),
    deleteImage: Joi.array(),
  });
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(" ,");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required();
  const { review } = req.body;
  const { error } = reviewSchema.validate(review);
  if (error) {
    const msg = error.details.map((e) => e.message).join(" ,");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
