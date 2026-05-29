const mongoose = require("mongoose");

const savedDanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    danceTitle: {
      type: String,
      required: true,
      trim: true,
    },

    song: {
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

    difficulty: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["known", "learning", "wantToLearn"],
      default: "wantToLearn",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SavedDance", savedDanceSchema);