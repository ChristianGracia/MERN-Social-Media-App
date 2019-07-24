const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// import profile model
const Profile = require("../../models/Profile");

// import user profile
const User = require("../../models/User");

// @access: public
router.get("/test", (req, res) => res.json({ msg: "Profile.js working" }));

// Get current user profile
// @access: private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id });
  }
);
module.exports = router;
