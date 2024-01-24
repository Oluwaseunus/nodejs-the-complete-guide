// const { ObjectId } = require("mongodb");
// const { getDb } = require("../util/database");

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.userId = userId;

//     if (id) {
//       this._id = new ObjectId(id);
//     }
//   }

//   save() {
//     const db = getDb();

//     let operation;

//     if (this._id) {
//       operation = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       console.log({ e: this });
//       operation = db.collection("products").insertOne(this);
//     }

//     return operation
//       .then((result) => {
//         console.log({ result });
//       })
//       .catch((err) => console.log({ err }));
//   }

//   static fetchAll() {
//     const db = getDb();

//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log({ products });
//         return products;
//       })
//       .catch((err) => console.log({ err }));
//   }

//   static findById(id) {
//     const db = getDb();

//     /* return db
//       .collection("products")
//       .findOne({
//         _id: new ObjectId(id),
//       }) */

//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(id) })
//       .next()
//       .then((product) => {
//         console.log({ product });
//         return product;
//       })
//       .catch((err) => console.log({ err }));
//   }

//   // alternative update method.
//   /* update(id) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .updateOne(
//         {
//           _id: new ObjectId(id),
//         },
//         { $set: this }
//       )
//       .catch((err) => console.log({ err }));
//   } */

//   static deleteById(id) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .deleteOne({
//         _id: new ObjectId(id),
//       })
//       .catch((err) => console.log({ err }));
//   }
// }

// module.exports = Product;
