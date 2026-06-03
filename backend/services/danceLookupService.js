const axios = require("axios");
const cheerio = require("cheerio");
const Dance = require("../models/Dance");

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function cleanTitleFromPdfUrl(url) {
  const filename = url.split("/").pop() || "";

  return filename
    .replace(".pdf", "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function searchExternalDanceSource(query) {
  const url = "https://linedancin.net/alpha_list.php";

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(data);
  const cleanQuery = query.toLowerCase().trim();

  let matchedDance = null;

  $("a").each((_, element) => {
    if (matchedDance) return;

    const href = $(element).attr("href");
    if (!href) return;

    const isStepsheet = href.toLowerCase().includes("stepsheets");
    const isPdf = href.toLowerCase().includes(".pdf");

    if (!isStepsheet || !isPdf) return;

    const fullUrl = href.startsWith("http")
      ? href
      : `https://linedancin.net/${href.replace("./", "")}`;

    const title = cleanTitleFromPdfUrl(fullUrl);

    if (!title.toLowerCase().includes(cleanQuery)) return;

    matchedDance = {
      title,
      difficulty: "Beginner",
      style: "Line Dance",
      songTitle: "",
      artist: "",
      choreographer: "",
      description: `Imported dance record for ${title}.`,
      counts: 0,
      walls: 0,
      tutorialUrl: "",
      demoUrl: "",
      stepsheetUrl: fullUrl,
      thumbnailUrl: "",
      tags: ["imported", "line-dance"],
      sourceName: "LineDancin.net",
      sourceUrl: url,
      isVerified: false,
      isActive: true,
    };
  });

  return matchedDance;
}

async function lookupDance(query) {
  if (!query || !query.trim()) {
    return {
      source: "none",
      dances: [],
    };
  }

  const cleanQuery = query.trim();

  const existingDances = await Dance.find({
    isActive: true,
    $or: [
      { title: { $regex: cleanQuery, $options: "i" } },
      { songTitle: { $regex: cleanQuery, $options: "i" } },
      { artist: { $regex: cleanQuery, $options: "i" } },
      { choreographer: { $regex: cleanQuery, $options: "i" } },
      { tags: { $regex: cleanQuery, $options: "i" } },
    ],
  }).limit(20);

  if (existingDances.length > 0) {
    return {
      source: "database",
      dances: existingDances,
    };
  }

  const externalDance = await searchExternalDanceSource(cleanQuery);

  if (!externalDance) {
    return {
      source: "external-not-found",
      dances: [],
    };
  }

  const slug = createSlug(externalDance.title);

  const savedDance = await Dance.findOneAndUpdate(
    { slug },
    {
      ...externalDance,
      slug,
    },
    { upsert: true, new: true }
  );

  return {
    source: "external-imported",
    dances: [savedDance],
  };
}

module.exports = {
  lookupDance,
};