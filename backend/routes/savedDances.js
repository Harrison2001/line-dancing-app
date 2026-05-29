const express = require("express");
const SavedDance = require("../models/SavedDance");

const router = express.Router();

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
    const savedDance = await SavedDance.create({
      userId: req.body.userId,
      danceTitle: req.body.danceTitle,
      song: req.body.song,
      artist: req.body.artist,
      choreographer: req.body.choreographer,
      difficulty: req.body.difficulty,
      status: req.body.status || "wantToLearn",
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