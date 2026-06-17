const mongoose = require("mongoose");

const savedDanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    danceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dance",
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

savedDanceSchema.index(
  { userId: 1, danceId: 1 },
  {
    unique: true,
    partialFilterExpression: { danceId: { $exists: true, $ne: null } },
  }
);

module.exports = mongoose.model("SavedDance", savedDanceSchema);