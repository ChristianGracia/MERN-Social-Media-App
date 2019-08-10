const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// get Post model
const Post = require("../../models/Post");

// get Profile model
const Profile = require("../../models/Profile");

// Validation
const ValidatePostInput = require("../../validation/post");

// GET api/posts
// get posts
// @access public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
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

// DELETE api/posts/:id
// delete a posts
// @access private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
          // delete
          post.remove().then(() => {
            res.json({ success: true });
          });
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

module.exports = router;
