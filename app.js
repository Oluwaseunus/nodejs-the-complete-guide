const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");

const errorController = require("./controllers/error");

const sequelize = require("./util/database");

const Cart = require("./models/cart");
const User = require("./models/user");
const Order = require("./models/order");
const Product = require("./models/product");
const CartItem = require("./models/cartItem");
const OrderItem = require("./models/orderItem");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log({ err }));
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

let fetchedUser;

sequelize
  // .sync({ force: true })
  .sync()
  .then((results) => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Seun",
        email: "test@test.com",
      });
    }

    // return Promise.resolve(user);
    // return type should be the same in both cases
    // Promise.resolve is not necessary but is good to know/use
    return user;
  })
  .then((user) => {
    // console.log({ user });
    fetchedUser = user;
    return user.getCart();
  })
  .then((cart) => {
    if (!cart) {
      return fetchedUser.createCart();
    }

    return cart;
  })
  .then((cart) => {
    console.log({ cart });
    app.listen(3000);
  })
  .catch((err) => console.log({ err }));
