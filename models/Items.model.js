const { Schema, model } = require("mongoose");
const Cart = require("./ShoppingCart.model");

const itemSchema = new Schema(
  {
    comicId: {
        type: Schema.Types.ObjectId, 
        ref: 'Comic'
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    quantity: {
        type: Number}
  }
);

const Item = model("Item", itemSchema);
module.exports = Item;
