if (process.env.NODE_ENV === "development") {
  require("util").inspect.defaultOptions.depth = null;
}

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("65ae6fa47ee2a8447c16eb5a")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log({ err }));
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://oluwaseunus:MSyxDEeptFf3XcDd@cluster0.bukbrqm.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    const existingUser = User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Seun",
          email: "seun@test.com",
          cart: {
            items: [],
          },
        });

        newUser.save();
      }
    });

    app.listen(3000);
  });
