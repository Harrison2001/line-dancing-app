const mongoose = require("mongoose");

const danceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Improver", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    style: {
      type: String,
      default: "Line Dance",
    },

    songTitle: {
      type: String,
      default: "",
    },

    artist: {
      type: String,
      default: "",
    },

    choreographer: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    counts: {
      type: Number,
      default: 0,
    },

    walls: {
      type: Number,
      default: 0,
    },

    tutorialUrl: {
      type: String,
      default: "",
    },

    demoUrl: {
      type: String,
      default: "",
    },

    stepsheetUrl: {
      type: String,
      default: "",
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    sourceName: {
      type: String,
      default: "Manual",
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    views: {
      type: Number,
      default: 0,
    },

    saves: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Dance", danceSchema);