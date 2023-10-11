const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
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

  Product.findById(productId)
    .then(([products]) => {
      const [product] = products;
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log({ err }));
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
  Product.fetchAll()
    .then(([results, info]) => {
      console.log({ results, info });
      res.render("shop/index", {
        prods: results,
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
