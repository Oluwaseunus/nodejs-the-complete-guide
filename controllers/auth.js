const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("shop/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("65ae6fa47ee2a8447c16eb5a")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;

      // adding the save method to ensure that the session is saved on the server
      // and in the db before redirecting.
      res.session.save((err) => {
        if (err) {
          console.log({ err });
        }
      });
    })
    .catch((err) => console.log({ err }));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log({ err });
    res.redirect("/");
  });
};
