const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          required: true,
          ref: "Product",
          type: Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addProductToCart = function (product) {
  let updatedCart = { ...this.cart };

  const index = updatedCart.items.findIndex(
    // (cartProduct) => product._id.toString() === cartProduct.productId.toString()
    (cartProduct) => product._id.equals(cartProduct.productId)
  );

  if (index === -1) {
    updatedCart.items.push({
      quantity: 1,
      productId: product._id,
    });
  } else {
    updatedCart.items[index].quantity += 1;
  }

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeProductFromCart = function (productId) {
  let updatedCart = { ...this.cart };

  const index = updatedCart.items.findIndex(
    (cartProduct) => cartProduct.productId.toString() === productId.toString()
  );

  if (index === -1) return;

  const productQuantity = updatedCart.items[index].quantity;

  if (productQuantity === 1) {
    updatedCart = {
      items: [
        ...updatedCart.items.filter(
          (filteredItem) =>
            filteredItem.productId.toString() !== productId.toString()
        ),
      ],
    };
  } else {
    updatedCart.items[index].quantity -= 1;
  }

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", userSchema);
