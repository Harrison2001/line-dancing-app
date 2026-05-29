const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "tutorial", "video", "event"],
      default: "text",
    },

    creator: {
      type: String,
      default: "Harrison Wier",
    },

    handle: {
      type: String,
      default: "harrison",
    },

    choreographer: {
      type: String,
      default: "Community Post",
    },

    difficulty: {
      type: String,
      default: "Shared",
    },

    danceTitle: {
      type: String,
      required: true,
    },

    song: {
      type: String,
      default: "Community Update",
    },

    artist: {
      type: String,
      default: "LineDance",
    },

    bpm: {
      type: Number,
      default: 0,
    },

    counts: {
      type: Number,
      default: 0,
    },

    walls: {
      type: Number,
      default: 0,
    },

    likes: {
      type: String,
      default: "0",
    },

    comments: {
      type: String,
      default: "0",
    },

    saves: {
      type: String,
      default: "0",
    },

    image: {
      type: String,
      default: "/images/wagonwheel.jpg",
    },
    mediaUrl: {
  type: String,
  default: "",
},

    publicId: {
  type: String,
  default: "",
},

    resourceType: {
  type: String,
  enum: ["image", "video", "raw", ""],
  default: "",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);