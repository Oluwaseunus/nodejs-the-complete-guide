const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
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

  Product.findByPk(productId)
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
  req.user
    .getCart()
    .then((cart) => {
      // console.log({ cart });
      return cart.getProducts();
    })
    .then((products) => {
      // console.log({ products });
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  // console.log({ productId });

  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;

      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then((products) => {
      const [product] = products;

      if (product) {
        // cartItem exists on product because of the association we defined in app.js
        newQuantity = product.cartItem.quantity + 1;
        return product;
        //
      } else {
        return Product.findByPk(productId);
      }
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity,
        },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));

  /* Product.findById(productId, (product) => {
    Cart.addToCart(product.id, product.price);
    res.redirect("/cart");
  }); */
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then(([product]) => {
      // since cartItem is the associative entity of products and carts,
      // when fetching one from the other, i.e., getting products from carts
      // or carts from products, the response will include the associative
      // instance (in this case, cartItem) that joins them. (see what I did there?)

      product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log({ err }));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({
      include: "products",
    })
    .then((orders) => {
      // console.log({ orders });

      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => console.log({ err }));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      console.log({ fetchedCart, products });

      fetchedProducts = products;
      return req.user.createOrder();
    })
    .then((order) => {
      return order.addProducts(
        fetchedProducts.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      );
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log({ err }));
};
