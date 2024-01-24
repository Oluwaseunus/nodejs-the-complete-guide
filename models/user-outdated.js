// const { ObjectId } = require("mongodb");
// const { getDb } = require("../util/database");

// class User {
//   constructor(username, email, cart, id, orders) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//     this.orders = orders;
//   }

//   save() {
//     const db = getDb();

//     return db
//       .collection("users")
//       .insertOne(this)
//       .catch((err) => console.log({ err }));
//   }

//   addProductToCart(product) {
//     let updatedCart = { ...this.cart };

//     const index = updatedCart.items.findIndex(
//       // (cartProduct) => product._id.toString() === cartProduct.productId.toString()
//       (cartProduct) => product._id.equals(cartProduct.productId)
//     );

//     if (index === -1) {
//       updatedCart.items.push({
//         quantity: 1,
//         productId: new ObjectId(product._id),
//       });
//     } else {
//       updatedCart.items[index].quantity += 1;
//     }

//     const db = getDb();

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   removeProductFromCart(productId) {
//     let updatedCart = { ...this.cart };

//     const index = updatedCart.items.findIndex(
//       (cartProduct) => cartProduct.productId.toString() === productId.toString()
//     );

//     if (index === -1) return;

//     const productQuantity = updatedCart.items[index].quantity;

//     if (productQuantity === 1) {
//       updatedCart = {
//         items: [
//           ...updatedCart.items.filter(
//             (filteredItem) =>
//               filteredItem.productId.toString() !== productId.toString()
//           ),
//         ],
//       };
//     } else {
//       updatedCart.items[index].quantity -= 1;
//     }

//     const db = getDb();

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       )
//       .catch((err) => console.log({ err }));
//   }

//   getCart() {
//     const db = getDb();

//     return db
//       .collection("products")
//       .find({
//         _id: {
//           $in: this.cart.items.map((item) => item.productId),
//         },
//       })
//       .toArray()
//       .then((products) => {
//         return this.cart.items.map((item) => ({
//           ...item,
//           ...products.find(
//             (product) => product._id.toString() === item.productId.toString()
//           ),
//         }));
//       })
//       .catch((err) => console.log({ err }));
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         return db.collection("orders").insertOne({
//           products,
//           user: {
//             id: this._id,
//             name: this.name,
//           },
//         });
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => console.log({ err }));
//   }

//   getOrders() {
//     const db = getDb();

//     return db
//       .collection("orders")
//       .find({ "user.id": new ObjectId(this._id) })
//       .toArray()
//       .catch((err) => console.log({ err }));
//   }

//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection("users")
//       .findOne({
//         _id: new ObjectId(userId),
//       })
//       .catch((err) => console.log({ err }));
//   }
// }

// module.exports = User;
