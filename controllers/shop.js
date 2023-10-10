const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    console.log({ product });
    // res.send(product);
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchAll((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];

      for (const product of products) {
        const cartProduct = cart.products.find(
          (prod) => prod.id === product.id
        );

        if (cartProduct) {
          cartProducts.push({
            productData: product,
            quantity: cartProduct.quantity,
          });
        }
      }

      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  // console.log({ productId });

  Product.findById(productId, (product) => {
    Cart.addToCart(product.id, product.price);
    res.redirect("/cart");
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, (product) => {
    // Cart.removeFromCart(product.id, product.price);
    Cart.deleteProduct(product.id, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
