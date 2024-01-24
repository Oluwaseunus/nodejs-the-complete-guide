const { model, Schema } = require("mongoose");

const orderSchema = new Schema({
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  products: [
    {
      quantity: {
        type: Number,
        required: true,
      },
      product: {
        required: true,
        ref: "Product",
        type: Object,
      },
    },
  ],
});

module.exports = model("Order", orderSchema);
