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

// GET api/posts/:id
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
    console.log(req.body.imgUrl);
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      imgUrl: req.body.imgUrl,

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

// POST api/posts/like/:id
// like posts
// @access private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          // add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// POST api/posts/unlike/:id
// unlike posts
// @access private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }

          // get index on item to remove from like array
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // remove from array
          post.likes.splice(removeIndex, 1);

          // save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// POST api/posts/comment/:id
// add comment to post
// @access private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check validation
    const { errors, isValid } = ValidatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          imgUrl: req.body.imgUrl,
          user: req.user.id
        };

        // add to comments array
        post.comments.unshift(newComment);

        // save comment
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// DELETE api/posts/comment/:id/:/comment_id
// delete comment to post
// @access private

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // get remove index

        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // remove comment
        post.comments.splice(removeIndex, 1);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
