const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");

const errorController = require("./controllers/error");

const { mongoConnect } = require("./util/database");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("65380a76f806283d672dcf96")
    .then((user) => {
      req.user = new User(
        user.name,
        user.email,
        user.cart,
        user._id,
        user.orders
      );
      next();
    })
    .catch((err) => console.log({ err }));
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
