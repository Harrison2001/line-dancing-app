const express = require("express");
const Dance = require("../models/Dance");
const { lookupDance } = require("../services/danceLookupService");
const { findDanceVideo } = require("../services/youtubeService");

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

// GET same-song dance versions by id
router.get("/:id/same-song-versions", async (req, res) => {
  try {
    const dance = await Dance.findById(req.params.id);

    if (!dance || dance.isActive === false) {
      return res.status(404).json({ message: "Dance not found" });
    }

    if (!dance.normalizedSongKey) {
      return res.json([]);
    }

    const sameSongVersions = await Dance.find({
      _id: { $ne: dance._id },
      normalizedSongKey: dance.normalizedSongKey,
      isActive: { $ne: false },
    })
      .sort({ sameSongVersionCount: -1, title: 1 })
      .limit(12)
      .select(
        "title danceName slug difficulty style choreographer songTitle artist counts walls sourceName bestDemoVideo bestTutorialVideo thumbnailUrl"
      );

    res.json(sameSongVersions);
  } catch (error) {
    console.error("Failed to fetch same-song versions:", error);
    res.status(500).json({ message: "Failed to fetch same-song versions" });
  }
});

// GET related dances by id
router.get("/:id/related", async (req, res) => {
  try {
    const dance = await Dance.findById(req.params.id);

    if (!dance || dance.isActive === false) {
      return res.status(404).json({ message: "Dance not found" });
    }

    const relatedDances = await Dance.find({
      _id: { $ne: dance._id },
      isActive: { $ne: false },
      $or: [
        { difficulty: dance.difficulty },
        { style: dance.style },
        { artist: dance.artist },
        { choreographer: dance.choreographer },
      ],
    })
      .limit(6)
      .select(
        "title difficulty style choreographer songTitle artist counts walls saves bestDemoVideo bestTutorialVideo youtubeThumbnail"
      );

    res.json(relatedDances);
  } catch (error) {
    console.error("Failed to fetch related dances:", error);
    res.status(500).json({ message: "Failed to fetch related dances" });
  }
});

// PATCH enrich one dance with YouTube video
router.patch("/:id/enrich-video", async (req, res) => {
  try {
    const dance = await Dance.findById(req.params.id);

    if (!dance || dance.isActive === false) {
      return res.status(404).json({ message: "Dance not found" });
    }

    const video = await findDanceVideo(dance);

    if (!video) {
      return res.status(404).json({ message: "No video found" });
    }

    dance.bestDemoVideo = video.url;
    dance.youtubeVideoId = video.videoId;
    dance.youtubeTitle = video.title;
    dance.youtubeChannel = video.channelTitle;
    dance.youtubeThumbnail = video.thumbnail;
    dance.videoEnrichedAt = new Date();

    await dance.save();

    res.json({
      message: "Video enriched successfully",
      dance,
      video,
    });
  } catch (error) {
    console.error("Video enrichment failed:", error);
    res.status(500).json({ message: "Video enrichment failed" });
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