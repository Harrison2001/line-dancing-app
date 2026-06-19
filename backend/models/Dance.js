const mongoose = require("mongoose");

const danceSchema = new mongoose.Schema(
  {
    title: String,
    danceName: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      index: true,
    },
    normalizedTitle: String,
    choreographer: String,
    songTitle: String,
    artist: String,
    difficulty: String,
    level: String,
    counts: Number,
    walls: Number,
    count: Number,
    wall: Number,
    style: String,
    music: String,
    description: String,
    source: String,
    sourceName: String,
    sourceUrl: String,
    sourceLinks: [String],
    stepsheetUrl: String,
    demoUrl: String,
    tutorialUrl: String,
    bestDemoVideo: String,
    bestTutorialVideo: String,
    best_demo_video: String,
    best_tutorial_video: String,
    thumbnailUrl: String,
    youtubeThumbnail: String,
    youtubeVideoId: String,
    youtubeTitle: String,
    youtubeChannel: String,
    videoEnrichedAt: Date,
    tags: [String],
    views: Number,
    saves: Number,
    qualityScore: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    scrapedAt: String,
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("Dance", danceSchema);
