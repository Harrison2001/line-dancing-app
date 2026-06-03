require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const Dance = require("../models/Dance");

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function importDances() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const url = "https://linedancin.net/alpha_list.php";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    const dances = [];

    $("a").each((_, element) => {
      const title = $(element).text().trim();
      const href = $(element).attr("href");

      if (!title || !href) return;

      const looksLikeDance =
        href.includes("dance") ||
        href.includes("stepsheet") ||
        href.includes("script");

      if (!looksLikeDance) return;

      dances.push({
        title,
        slug: createSlug(title),
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
        stepsheetUrl: href.startsWith("http")
          ? href
          : `https://linedancin.net/${href}`,
        thumbnailUrl: "",
        tags: ["imported", "line-dance"],
        sourceName: "LineDancin.net",
        sourceUrl: url,
        isVerified: false,
        isActive: true,
      });
    });

    const uniqueDances = Array.from(
      new Map(dances.map((dance) => [dance.slug, dance])).values()
    );

    console.log(`Found ${uniqueDances.length} possible dances`);

    for (const dance of uniqueDances) {
      await Dance.findOneAndUpdate(
        { slug: dance.slug },
        dance,
        { upsert: true, new: true }
      );
    }

    console.log(`Imported ${uniqueDances.length} dances`);
    process.exit(0);
  } catch (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  }
}

importDances();