const path = require("path");
const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

/* router.get("/add-product", (req, res, next) => {
  res.send(`
    <form action="/admin/add-product" method="POST">
      <input name="product" />
      <button type="submit">Add Product</button>
    </form>
  `);
}); */

router.get("/add-product", (req, res) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, res, next) => {
  console.log({ body: req.body });
  res.redirect("/");
});

module.exports = router;
