require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");

const strategy = require("./strategy");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  //Check for user in DB
  // If no user , store the user from the user object
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
//req.user..... always created by passport.serializeUser or deserializeUser
app.get(
  "/login",
  passport.authenticate("auth0", {
    //http://localhost:3000/complete_setup - This should be how its redirected
    successRedirect: "/me",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.get("/me", (req, res, next) => {
  // Ternary statement but may be not use it, not a good practice
  // !req.user ? res.redirect('/login') : res.status(200).send(req.user);

  if (!req.user) {
    res.redirect("/login");
  } else {
    res.status(200).send(req.user);
  }
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
