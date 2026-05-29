const express = require("express");
const Like = require("../models/Like");

const router = express.Router();


// GET number of likes for a post
router.get("/:postId", async (req, res) => {
  try {
    const count = await Like.countDocuments({
      postId: req.params.postId,
    });

    res.json({
      count,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch likes",
    });
  }
});


// TOGGLE like / unlike
router.post("/", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
      return res.status(400).json({
        message: "postId and userId required",
      });
    }

    const existingLike = await Like.findOne({
      postId,
      userId,
    });

    // unlike
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      const count = await Like.countDocuments({
        postId,
      });

      return res.json({
        liked: false,
        count,
      });
    }

    // create like
    await Like.create({
      postId,
      userId,
    });

    const count = await Like.countDocuments({
      postId,
    });

    res.json({
      liked: true,
      count,
    });

  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to update like",
    });
  }
});

module.exports = router;