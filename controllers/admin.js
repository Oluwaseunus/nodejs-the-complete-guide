const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    editing: false,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  const newProduct = new Product(
    title,
    price,
    imageUrl,
    description,
    null,
    req.user._id
  );

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

  const product = new Product(title, price, imageUrl, description, productId);

  // product
  //   .update(productId)

  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log({ err }));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.deleteById(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log({ err }));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log({ err }));
};
