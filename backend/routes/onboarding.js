const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      city,
      state,
      danceExperience,
      skillLevel,
      danceFrequency,
      interests,
      bio,
      profileImage,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        city,
        state,
        danceExperience,
        skillLevel,
        danceFrequency,
        interests,
        bio,
        profileImage,
        onboardingComplete: true,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Onboarding completed successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        city: updatedUser.city,
        state: updatedUser.state,
        danceExperience: updatedUser.danceExperience,
        skillLevel: updatedUser.skillLevel,
        danceFrequency: updatedUser.danceFrequency,
        interests: updatedUser.interests,
        onboardingComplete: updatedUser.onboardingComplete,
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);

    res.status(500).json({
      message: "Server error while completing onboarding",
    });
  }
});

module.exports = router;