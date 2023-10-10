const fs = require("fs");
const path = require("path");

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
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );

        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log({ err });
        });
      } else {
        this.id = Math.random().toString();

        products.push(this);

        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log({ err });
        });
      }
    });
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

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      callback(product);
    });
  }
};
