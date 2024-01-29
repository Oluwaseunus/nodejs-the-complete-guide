if (process.env.NODE_ENV === "development") {
  require("util").inspect.defaultOptions.depth = null;
}

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

const MONGO_URI =
  "mongodb+srv://oluwaseunus:MSyxDEeptFf3XcDd@cluster0.bukbrqm.mongodb.net/shop?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store,
    resave: false,
    saveUninitialized: false,
    secret: "my session secret is very secretive",
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log({ err });
    });
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404);

mongoose.connect(MONGO_URI).then((result) => {
  User.findOne().then((user) => {
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
