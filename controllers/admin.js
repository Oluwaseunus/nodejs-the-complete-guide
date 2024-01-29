const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    editing: false,
    productCSS: true,
    activeAddProduct: true,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  const newProduct = new Product({
    title,
    price,
    imageUrl,
    description,
    // mongoose will pick the user id here because we defined user as a reference.
    userId: req.user,
  });

  console.log({ newProduct });

  newProduct
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log({ err }));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    res.redirect("/");
  }

  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log({ err });
      return res.redirect("/");
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.body;

  const { price, title, imageUrl, description } = req.body;

  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;

      product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log({ err }));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log({ err }));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select("title price -_id") https://mongoosejs.com/docs/api/query.html#Query.prototype.select()
    // .populate("userId", "name") https://mongoosejs.com/docs/api/query.html#Query.prototype.populate()
    .then((products) =>
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      })
    )
    .catch((err) => console.log({ err }));
};
