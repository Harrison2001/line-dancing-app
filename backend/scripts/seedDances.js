require("dotenv").config();
const mongoose = require("mongoose");
const Dance = require("../models/Dance");
const seedDances = require("../data/seedDances");

async function seedDancesToDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const dance of seedDances) {
      await Dance.findOneAndUpdate(
        { slug: dance.slug },
        dance,
        { upsert: true, new: true }
      );
    }

    console.log(`${seedDances.length} dances seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed dances:", error.message);
    process.exit(1);
  }
}

seedDancesToDatabase();