const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "/images/default-profile.jpg",
    },

    favoriteStyles: {
      type: [String],
      default: [],
    },

    dancesKnown: {
      type: [String],
      default: [],
    },

    dancesLearning: {
      type: [String],
      default: [],
    },

    dancesWantToLearn: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);