const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findOne(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    res.render("shop/cart", {
      pageTitle: "Your Cart",
      path: "/cart",
      products,
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  console.log({ productId });

  Product.findById(productId)
    .then((product) => {
      return req.user.addProductToCart(product);
    })
    .then((result) => {
      console.log({ result });
      res.redirect("/cart");
    })
    .catch((err) => console.log({ err }));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .removeProductFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log({ err }));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log({ orders });

      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart, fetchedProducts;

  req.user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log({ err }));
};
