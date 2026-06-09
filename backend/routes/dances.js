const express = require("express");
const Dance = require("../models/Dance");
const { lookupDance } = require("../services/danceLookupService");

const router = express.Router();

// GET all dances that are not explicitly inactive
router.get("/", async (req, res) => {
  try {
    const dances = await Dance.find({
      isActive: { $ne: false },
    }).sort({
      createdAt: -1,
    });

    res.json(dances);
  } catch (error) {
    console.error("Failed to fetch dances:", error);
    res.status(500).json({ message: "Failed to fetch dances" });
  }
});

// GET search dances
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const result = await lookupDance(query.trim());

    res.json(result);
  } catch (error) {
    console.error("Dance search failed:", error);
    res.status(500).json({ message: "Dance search failed" });
  }
});

// GET one dance by id
router.get("/:id", async (req, res) => {
  try {
    const dance = await Dance.findById(req.params.id);

    if (!dance || dance.isActive === false) {
      return res.status(404).json({ message: "Dance not found" });
    }

    res.json(dance);
  } catch (error) {
    console.error("Failed to fetch dance:", error);
    res.status(500).json({ message: "Failed to fetch dance" });
  }
});

module.exports = router;