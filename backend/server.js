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

app.get("/api/youtube/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        message: "YouTube API key is missing from backend .env",
      });
    }

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
      query
    )}&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await fetch(youtubeUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error("YouTube API error:", data);
      return res.status(response.status).json({
        message: "YouTube API request failed",
        details: data,
      });
    }

    if (!data.items || data.items.length === 0) {
      return res.json({ videoUrl: "" });
    }

    const videoId = data.items[0].id.videoId;

    return res.json({
      videoUrl: `https://www.youtube.com/embed/${videoId}`,
      title: data.items[0].snippet.title,
      channelTitle: data.items[0].snippet.channelTitle,
      thumbnail: data.items[0].snippet.thumbnails?.high?.url || "",
    });
  } catch (error) {
    console.error("YouTube search failed:", error);
    return res.status(500).json({ message: "YouTube search failed" });
  }
});

app.get("/", (req, res) => {
  res.send("LineDance backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});