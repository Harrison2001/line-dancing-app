const express = require("express");
const SavedDance = require("../models/SavedDance");

const router = express.Router();

// Check if a dance is saved for a user
router.get("/check", async (req, res) => {
  try {
    const { userId, danceId } = req.query;

    if (!userId || !danceId) {
      return res.status(400).json({
        message: "userId and danceId are required",
      });
    }

    const record = await SavedDance.findOne({
      userId,
      danceId,
    });

    res.json({
      saved: !!record,
      ...(record && { record }),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check saved dance",
    });
  }
});

// Get all saved dances for a user
router.get("/:userId", async (req, res) => {
  try {
    const savedDances = await SavedDance.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(savedDances);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch saved dances",
    });
  }
});

// Save a dance
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      danceId,
      danceTitle,
      song,
      artist,
      choreographer,
      difficulty,
      status,
    } = req.body;

    if (danceId) {
      const savedDance = await SavedDance.findOneAndUpdate(
        { userId, danceId },
        {
          userId,
          danceId,
          danceTitle,
          song: song || "",
          artist: artist || "",
          choreographer: choreographer || "",
          difficulty: difficulty || "",
          status: status || "wantToLearn",
        },
        { new: true, upsert: true, runValidators: true }
      );

      return res.status(201).json(savedDance);
    }

    const savedDance = await SavedDance.create({
      userId,
      danceTitle,
      song: song || "",
      artist: artist || "",
      choreographer: choreographer || "",
      difficulty: difficulty || "",
      status: status || "wantToLearn",
    });

    res.status(201).json(savedDance);
  } catch (error) {
    res.status(400).json({
      message: "Failed to save dance",
    });
  }
});

// Update dance status
router.put("/:id", async (req, res) => {
  try {
    const updatedDance = await SavedDance.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedDance) {
      return res.status(404).json({ message: "Saved dance not found" });
    }

    res.json(updatedDance);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update saved dance",
    });
  }
});

// Remove saved dance
router.delete("/:id", async (req, res) => {
  try {
    const deletedDance = await SavedDance.findByIdAndDelete(req.params.id);

    if (!deletedDance) {
      return res.status(404).json({ message: "Saved dance not found" });
    }

    res.json({ message: "Saved dance removed" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove saved dance",
    });
  }
});

module.exports = router;
