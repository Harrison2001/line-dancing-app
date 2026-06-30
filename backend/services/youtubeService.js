require("dotenv").config();

const {
  pickBestLineDanceVideo,
  searchLineDanceVideos,
} = require("./youtubeVideoRanking");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function findDanceVideo(dance, searchType = "demo") {
  const query = [
    dance.title || dance.danceName,
    dance.songTitle,
    dance.artist,
    searchType === "tutorial" ? "line dance tutorial" : "line dance demo",
  ]
    .filter(Boolean)
    .join(" ");

  const videos = await searchLineDanceVideos(query, YOUTUBE_API_KEY, 10);

  return pickBestLineDanceVideo(videos, {
    searchType,
    danceTitle: dance.title || dance.danceName,
    songTitle: dance.songTitle,
  });
}

module.exports = {
  findDanceVideo,
};
