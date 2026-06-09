const mongoose = require("mongoose");

const danceSchema = new mongoose.Schema(
  {
    source: String,
    danceName: {
      type: String,
      required: true,
      index: true,
    },
    choreographer: String,
    count: Number,
    wall: Number,
    level: String,
    music: String,
    stepsheetUrl: String,
    scrapedAt: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dance", danceSchema);