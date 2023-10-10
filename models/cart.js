const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) return callback({ products: [], totalPrice: 0 });

    callback(JSON.parse(fileContent));
  });
};

module.exports = class Cart {
  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static addToCart(id, price) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      if (existingProduct) {
        const updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };

        cart.products[existingProductIndex] = updatedProduct;
      } else {
        const newProduct = { id, price, quantity: 1 };
        cart.products = [...cart.products, newProduct];
      }

      cart.totalPrice += Number(price);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log({ err });
      });
    });
  }

  static removeFromCart(id, price) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) cart = JSON.parse(fileContent);

      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      if (existingProduct) {
        const newQuantity = existingProduct.quantity - 1;

        if (newQuantity) {
          cart.products[existingProductIndex] = {
            ...existingProduct,
            quantity: newQuantity,
          };
        } else {
          const updatedCart = structuredClone(cart);
          updatedCart.products.splice(existingProductIndex, 1);
          cart = updatedCart;
        }

        cart.totalPrice -= Number(price);

        fs.writeFile(p, JSON.stringify(cart), (err) => {
          console.log({ err });
        });
      }
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;

      const cart = JSON.parse(fileContent);

      const selectedProduct = cart.products.find(
        (product) => product.id === id
      );

      if (!selectedProduct || !selectedProduct.quantity) return;

      const updatedCart = structuredClone(cart);

      updatedCart.totalPrice =
        updatedCart.totalPrice - selectedProduct.quantity * price;

      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log({ err });
      });
    });
  }
};
