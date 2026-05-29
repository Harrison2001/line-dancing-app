const express = require("express");
const Comment = require("../models/Comment");

const router = express.Router();

// Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
    })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
});

// Create comment
router.post("/", async (req, res) => {
  try {
    const newComment = await Comment.create({
      postId: req.body.postId,
      userId: req.body.userId,
      text: req.body.text,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create comment",
    });
  }
});

module.exports = router;