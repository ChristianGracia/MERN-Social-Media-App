const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

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

// log in user, return JWT token
// @access public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find user with email
  User.findOne({ email }).then(user => {
    // Validate user
    if (!user) {
      return res.status(404).json({ email: "User email not found" });
    }

    // validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // create payload
        const payload = { id: user.id, name: user.name, imgUrl: user.imgUrl };

        // sign token
        jwt.sign(payload, keys.secretKey, { expiresIn: 1800 }, (err, token) => {
          res.json({ sucess: true, token: "Bearer " + token });
        });
      } else {
        return res.status(400).json({ password: "Incorrect Password" });
      }
    });
  });
});

// @route Get api/users/current
// @desc return current user
// @access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "sucess" });
  }
);

module.exports = router;
