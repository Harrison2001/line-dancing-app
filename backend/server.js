const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profiles");
const commentRoutes = require("./routes/comments");
const likeRoutes = require("./routes/likes");
const savedDanceRoutes = require("./routes/savedDances");
const uploadRoutes = require("./routes/uploads");
const followRoutes = require("./routes/follows");
const onboardingRoutes = require("./routes/onboarding");
const dancesRoutes = require("./routes/dances");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/uploads", uploadRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/saved-dances", savedDanceRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/dances", dancesRoutes);

const {
  pickBestLineDanceVideo,
  searchLineDanceVideos,
} = require("./services/youtubeVideoRanking");

app.get("/api/youtube/search", async (req, res) => {
  try {
    const query = req.query.q;
    const searchType = req.query.type === "tutorial" ? "tutorial" : "demo";
    const danceTitle = req.query.danceTitle || "";
    const songTitle = req.query.songTitle || "";

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        message: "YouTube API key is missing from backend .env",
      });
    }

    const videos = await searchLineDanceVideos(
      query,
      process.env.YOUTUBE_API_KEY,
      10
    );

    const bestMatch = pickBestLineDanceVideo(videos, {
      searchType,
      danceTitle,
      songTitle,
    });

    if (!bestMatch) {
      return res.json({ videoUrl: "" });
    }

    return res.json({
      videoUrl: bestMatch.embedUrl,
      title: bestMatch.title,
      channelTitle: bestMatch.channelTitle,
      thumbnail: bestMatch.thumbnail,
      matchScore: bestMatch.matchScore,
    });
  } catch (error) {
    console.error("YouTube search failed:", error);
    return res.status(error.status || 500).json({
      message: "YouTube search failed",
      details: error.details,
    });
  }
});

app.get("/", (req, res) => {
  res.send("LineDance backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});