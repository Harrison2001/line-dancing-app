const express = require("express");
const Follow = require("../models/Follow");

const router = express.Router();

// TOGGLE follow / unfollow
router.post("/", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      return res.status(400).json({
        message: "followerId and followingId are required",
      });
    }

    if (followerId === followingId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const existingFollow = await Follow.findOne({
      followerId,
      followingId,
    });

    if (existingFollow) {
      await Follow.findByIdAndDelete(existingFollow._id);

      return res.json({
        following: false,
      });
    }

    await Follow.create({
      followerId,
      followingId,
    });

    res.json({
      following: true,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to update follow",
    });
  }
});

// GET following count for user
router.get("/:userId/following-count", async (req, res) => {
  try {
    const count = await Follow.countDocuments({
      followerId: req.params.userId,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch following count",
    });
  }
});

// GET follower count for user
router.get("/:userId/follower-count", async (req, res) => {
  try {
    const count = await Follow.countDocuments({
      followingId: req.params.userId,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch follower count",
    });
  }
});

module.exports = router;