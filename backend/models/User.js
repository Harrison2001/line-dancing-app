const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    profileImage: {
      type: String,
      default: "/images/default-profile.jpg",
    },

    bio: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    danceExperience: {
      type: String,
      default: "",
    },

    skillLevel: {
      type: String,
      default: "",
    },

    danceFrequency: {
      type: String,
      default: "",
    },

    interests: {
      type: [String],
      default: [],
    },

    onboardingComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);