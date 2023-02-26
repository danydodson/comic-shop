const { Schema, model } = require("mongoose")

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },

    itemsIds: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
  }
)

const Cart = model("Cart", cartSchema)

module.exports = Cart