const LINE_DANCE_SIGNALS = [
  { pattern: "line dance", score: 6 },
  { pattern: "linedance", score: 6 },
  { pattern: "line dancing", score: 6 },
  { pattern: "country dance", score: 5 },
  { pattern: "country linedance", score: 5 },
  { pattern: "step sheet", score: 5 },
  { pattern: "stepsheet", score: 5 },
  { pattern: "step by step", score: 5 },
  { pattern: "walkthrough", score: 4 },
  { pattern: "tutorial", score: 4 },
  { pattern: "teach", score: 3 },
  { pattern: "lesson", score: 3 },
  { pattern: "instruction", score: 3 },
  { pattern: "breakdown", score: 3 },
  { pattern: "demo", score: 3 },
  { pattern: "demonstration", score: 3 },
  { pattern: "dance along", score: 3 },
  { pattern: "choreography", score: 2 },
  { pattern: "copperknob", score: 4 },
  { pattern: "bootscootin", score: 3 },
  { pattern: "boot scootin", score: 3 },
  { pattern: "linedancemagazine", score: 4 },
];

const MUSIC_VIDEO_SIGNALS = [
  { pattern: "official music video", score: -10 },
  { pattern: "official video", score: -8 },
  { pattern: "music video", score: -8 },
  { pattern: "official audio", score: -8 },
  { pattern: "lyric video", score: -8 },
  { pattern: "lyrics video", score: -8 },
  { pattern: " with lyrics", score: -6 },
  { pattern: " lyrics", score: -4 },
  { pattern: "vevo", score: -9 },
  { pattern: " - topic", score: -7 },
  { pattern: "audio only", score: -6 },
  { pattern: "full album", score: -5 },
  { pattern: "record label", score: -4 },
  { pattern: "premiere", score: -3 },
  { pattern: "remastered", score: -2 },
  { pattern: "official hd", score: -5 },
  { pattern: "official 4k", score: -5 },
];

const MUSIC_VIDEO_CHANNELS = [
  "vevo",
  "official",
  "records",
  "topic",
  "music",
];

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function scoreLineDanceVideo(video, options = {}) {
  const searchType = options.searchType || "demo";
  const danceTitle = normalizeText(options.danceTitle);
  const songTitle = normalizeText(options.songTitle);

  const title = normalizeText(video.title);
  const channel = normalizeText(video.channelTitle || video.channel);
  const combined = `${title} ${channel}`;

  let score = 0;

  for (const signal of LINE_DANCE_SIGNALS) {
    if (combined.includes(signal.pattern)) {
      score += signal.score;
    }
  }

  for (const signal of MUSIC_VIDEO_SIGNALS) {
    if (combined.includes(signal.pattern)) {
      score += signal.score;
    }
  }

  if (searchType === "tutorial") {
    if (
      ["tutorial", "teach", "lesson", "walkthrough", "step by step", "breakdown"].some(
        (keyword) => combined.includes(keyword)
      )
    ) {
      score += 4;
    }
  } else if (["demo", "demonstration", "dance along", "performance"].some(
    (keyword) => combined.includes(keyword)
  )) {
    score += 3;
  }

  if (danceTitle && danceTitle.length >= 3 && title.includes(danceTitle)) {
    score += 4;
  }

  if (songTitle && songTitle.length >= 3 && title.includes(songTitle)) {
    score += 2;
  }

  if (MUSIC_VIDEO_CHANNELS.some((label) => channel.includes(label)) && score < 4) {
    score -= 4;
  }

  return score;
}

function mapSearchItem(item) {
  const videoId = item?.id?.videoId;
  const snippet = item?.snippet || {};

  if (!videoId) {
    return null;
  }

  return {
    videoId,
    title: snippet.title || "",
    channelTitle: snippet.channelTitle || "",
    channel: snippet.channelTitle || "",
    thumbnail:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      "",
    url: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
  };
}

function pickBestLineDanceVideo(videos, options = {}) {
  if (!videos?.length) {
    return null;
  }

  const ranked = videos
    .map((video) => ({
      video,
      score: scoreLineDanceVideo(video, options),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];

  if (!best || best.score < -2) {
    return null;
  }

  return {
    ...best.video,
    matchScore: best.score,
  };
}

async function searchLineDanceVideos(query, apiKey, maxResults = 10) {
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet` +
    `&type=video` +
    `&maxResults=${maxResults}` +
    `&q=${encodeURIComponent(query)}` +
    `&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error("YouTube API request failed");
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return (data.items || [])
    .map(mapSearchItem)
    .filter(Boolean);
}

module.exports = {
  LINE_DANCE_SIGNALS,
  MUSIC_VIDEO_SIGNALS,
  scoreLineDanceVideo,
  pickBestLineDanceVideo,
  searchLineDanceVideos,
  mapSearchItem,
};
