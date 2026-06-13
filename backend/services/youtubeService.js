require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function findDanceVideo(dance) {
  const query = [
    dance.title,
    dance.songTitle,
    dance.artist,
    "line dance",
  ]
    .filter(Boolean)
    .join(" ");

  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet` +
    `&type=video` +
    `&maxResults=5` +
    `&q=${encodeURIComponent(query)}` +
    `&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items?.length) {
    return null;
  }

  const video = data.items[0];

  return {
    videoId: video.id.videoId,
    title: video.snippet.title,
    channelTitle: video.snippet.channelTitle,
    thumbnail: video.snippet.thumbnails.high?.url,
    url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
  };
}

module.exports = {
  findDanceVideo,
};