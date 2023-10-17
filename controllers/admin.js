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

  // Product.create({})

  // this method exists because Sequelize creates "magic functions"
  // based on the associations defined between our models.
  // Product belongs to User so user can create products.
  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      description,
    })
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

  // Product.findByPk(productId);

  req.user
    .getProducts({
      where: {
        id: productId,
      },
    })
    .then(([product]) => {
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

  Product.findByPk(productId)
    .then((product) => {
      /* return product
        .update({
          title,
          price,
          imageUrl,
          description,
        })
        .then(() => {
          res.redirect("/admin/products");
        }); */

      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;

      return product.save();
    })
    .catch((err) => console.log({ err }));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log({ err }));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log({ err }));
};
