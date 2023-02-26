const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    title: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    username: String,
    comicId: {type: Schema.Types.ObjectId, ref: 'Comic'},
    content: String,
    rating: Number,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
