const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
});

// GET uploads for one user
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.params.userId,
      mediaUrl: { $ne: "" },
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user uploads",
    });
  }
});

// CREATE text post
router.post("/", async (req, res) => {
  try {
    const newPost = await Post.create({
      type: req.body.type || "text",
      creator: req.body.creator || "Harrison Wier",
      handle: req.body.handle || "harrison",
      choreographer: req.body.choreographer || "Community Post",
      difficulty: req.body.difficulty || "Shared",
      danceTitle: req.body.danceTitle,
      song: req.body.song || "Community Update",
      artist: req.body.artist || "LineDance",
      bpm: req.body.bpm || 0,
      counts: req.body.counts || 0,
      walls: req.body.walls || 0,
      likes: 0,
      comments: 0,
      saves: 0,
      image: req.body.image || "/images/wagonwheel.jpg",
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to create post",
    });
  }
});

// CREATE media post
router.post("/media", async (req, res) => {
  try {
    const { userId, text, mediaUrl, publicId, resourceType } = req.body;

    const newPost = await Post.create({
      userId,
      type: "media",
      creator: req.body.creator || "Community User",
      handle: req.body.handle || "user",
      danceTitle: text || "Dance upload",
      text,
      mediaUrl,
      publicId,
      resourceType,
      likes: 0,
      comments: 0,
      saves: 0,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create media post",
    });
  }
});

// LIKE post
router.patch("/:postId/like", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $inc: {
          likes: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to like post",
    });
  }
});

module.exports = router;