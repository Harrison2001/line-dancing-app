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
const app = express();
const uploadRoutes = require("./routes/uploads");
const followRoutes = require("./routes/follows");

connectDB();

app.use("/api/follows", followRoutes);
app.use(cors());
app.use(express.json());
app.use("/api/uploads", uploadRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/saved-dances", savedDanceRoutes);
app.use("/api/uploads", require("./routes/uploads"));

app.get("/", (req, res) => {
  res.send("LineDance backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});