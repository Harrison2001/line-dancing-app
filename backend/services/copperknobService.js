const axios = require("axios");
const cheerio = require("cheerio");

function createSlug(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseDanceMeta(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();

  const countMatch = clean.match(/(\d+)\s*Count/i);
  const wallMatch = clean.match(/(\d+)\s*Wall/i);
  const musicMatch = clean.match(/Music:\s*(.+)$/i);

  const levelMatch = clean.match(
    /\d+\s*Count\s+\d+\s*Wall\s+(.+?)\s+Music:/i
  );

  return {
    counts: countMatch ? Number(countMatch[1]) : 0,
    walls: wallMatch ? Number(wallMatch[1]) : 0,
    difficulty: levelMatch ? levelMatch[1].trim() : "",
    songTitle: musicMatch ? musicMatch[1].trim() : "",
  };
}

async function searchCopperKnob(query) {
  const cleanQuery = String(query || "").trim();

  if (!cleanQuery) return null;

  const searchUrl = `https://www.copperknob.co.uk/search/${encodeURIComponent(
    cleanQuery
  )}`;

  const { data } = await axios.get(searchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(data);

  let matchedDance = null;

  $("a").each((_, element) => {
    if (matchedDance) return;

    const href = $(element).attr("href");
    const titleText = $(element).text().replace(/\s+/g, " ").trim();

    if (!href || !titleText) return;

    const lowerHref = href.toLowerCase();

    const looksLikeStepsheet =
      lowerHref.includes("/stepsheets/") ||
      lowerHref.includes("stepsheet") ||
      lowerHref.includes("/linedance/");

    if (!looksLikeStepsheet) return;

    const titleLower = titleText.toLowerCase();
    const queryLower = cleanQuery.toLowerCase();

    if (!titleLower.includes(queryLower) && !queryLower.includes(titleLower)) {
      return;
    }

    const stepsheetUrl = href.startsWith("http")
      ? href
      : `https://www.copperknob.co.uk${href.startsWith("/") ? href : `/${href}`}`;

    const parentText = $(element).parent().text();
    const nearbyText = `${parentText} ${$(element).parent().next().text()}`;
    const meta = parseDanceMeta(nearbyText);

    matchedDance = {
      title: titleText,
      danceName: titleText,
      slug: createSlug(titleText),
      choreographer: "",
      songTitle: meta.songTitle,
      artist: "",
      difficulty: meta.difficulty,
      counts: meta.counts,
      walls: meta.walls,
      style: "Line Dance",
      sourceName: "CopperKnob",
      sourceUrl: searchUrl,
      stepsheetUrl,
      demoUrl: "",
      tutorialUrl: "",
      thumbnailUrl: "",
      description: `Imported from CopperKnob for ${titleText}.`,
      tags: ["imported", "line-dance", "copperknob"],
      views: 0,
      saves: 0,
      isActive: true,
      isVerified: false,
      lastSearchedAt: new Date(),
      scrapedAt: new Date().toISOString(),
    };
  });

  return matchedDance;
}

module.exports = {
  searchCopperKnob,
};