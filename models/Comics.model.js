const { Schema, model } = require("mongoose");

const comicSchema = new Schema(
  {
    title: String,
    img: String,
    author: String,
    comicSeries: String,
    year: Number,
    condition: String,
    synopsis: String,
    price: Number,
    reviewIds: [{ type: Schema.Types.ObjectId, ref: 'Review'}],
    ratingsArray: Array,
    quantity: Number
  }
);

const Comic = model("Comic", comicSchema);

module.exports = Comic;
