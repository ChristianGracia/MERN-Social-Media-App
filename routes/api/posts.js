const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");

// POST api/posts
// create post
// @access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      imgUrl: req.body.name,
      user: req.user.id
    });

    newPost.save().then(posts => res.json(posts));
  }
);

module.exports = router;
