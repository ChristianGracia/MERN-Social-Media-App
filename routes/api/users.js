const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// load user model
const User = require("../../models/User");

// user route test
// @access: private
router.get("/test", (req, res) => res.json({ msg: "User.js working" }));

// register user
// @access: public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "email name in use" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        imgUrl: req.body.imgUrl
      });

      // password encryption

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
