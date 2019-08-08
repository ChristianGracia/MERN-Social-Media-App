const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// get Post model
const Post = require("../../models/post");

// Validation
const ValidatePostInput = require("../../validation/post");

// GET api/posts
// get posts
// @access public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404));
});

// GET api/pposts/:id
// get posts by id
// @access public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// POST api/posts
// create post
// @access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
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
