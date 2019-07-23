const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// load user model
const User = require("../../models/User");

// user route test
// @access: private
router.get("/test", (req, res) => res.json({ msg: "User.js working" }));

// register user
// @access: public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already in use";
      return res.status(400).json(errors);
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
  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find user with email
  User.findOne({ email }).then(user => {
    // Validate user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
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
        errors.password = "Incorrect password";
        return res.status(400).json(errors);
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
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
