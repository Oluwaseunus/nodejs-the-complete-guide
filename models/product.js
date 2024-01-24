const { model, Schema } = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    ref: "User",
    required: true,
    type: Schema.Types.ObjectId,
  },
});

module.exports = model("Product", productSchema);
