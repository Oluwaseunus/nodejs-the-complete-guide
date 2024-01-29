const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getCart = (req, res, next) => {
  User.findOne(req.user._id)
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
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
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log({ orders });

      res.render("shop/orders", {
        orders,
        path: "/orders",
        pageTitle: "Your Orders",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const order = new Order({
        user: {
          name: user.name,
          userId: user._id,
        },
        products: user.cart.items.map(({ quantity, productId }) => ({
          quantity,
          product: { ...productId._doc },
        })),
      });

      return order.save();
    })
    .then(() => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log({ err }));
};
