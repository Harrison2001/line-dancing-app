const express = require("express");
const Dance = require("../models/Dance");
const { lookupDance } = require("../services/danceLookupService");

const router = express.Router();

// GET all dances
router.get("/", async (req, res) => {
  try {
    const dances = await Dance.find({ isActive: true }).sort({
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

    const result = await lookupDance(query);

    res.json(result);
  } catch (error) {
    console.error("Dance search failed:", error);
    res.status(500).json({ message: "Dance search failed" });
  }
});

module.exports = router;