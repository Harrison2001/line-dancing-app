const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();

// GET all profiles - testing route
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

// GET one profile by userId
router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate(
      "userId",
      "username email"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// CREATE profile
router.post("/", async (req, res) => {
  try {
    const newProfile = await Profile.create({
      userId: req.body.userId,
      displayName: req.body.displayName,
      bio: req.body.bio,
      location: req.body.location,
      profileImage: req.body.profileImage,
      favoriteStyles: req.body.favoriteStyles,
      dancesKnown: req.body.dancesKnown,
      dancesLearning: req.body.dancesLearning,
      dancesWantToLearn: req.body.dancesWantToLearn,
    });

    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: "Failed to create profile" });
  }
});

// UPDATE profile
router.put("/:userId", async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: "Failed to update profile" });
  }
});

module.exports = router;