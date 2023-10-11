const fs = require("fs");
const path = require("path");

const db = require("../util/database");

const Cart = require("./cart");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) return callback([]);

    callback(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    return db.execute(
      `INSERT INTO products (title, price, imageUrl, description)
      VALUES (?, ?, ?, ?)`,
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const existingProductIndex = products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = products[existingProductIndex];

      if (existingProductIndex === -1) return;

      const productsCopy = structuredClone(products);
      productsCopy.splice(existingProductIndex, 1);

      fs.writeFile(p, JSON.stringify(productsCopy), (err) => {
        if (!err) {
          Cart.deleteProduct(id, existingProduct.price);
        }
      });
    });
  }

  static fetchAll() {
    return db.execute(`SELECT * FROM products`);
  }

  static findById(id) {
    return db.execute(`SELECT * FROM products WHERE id = ?`, [id]);
  }
};
