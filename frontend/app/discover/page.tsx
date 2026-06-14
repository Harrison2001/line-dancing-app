"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

const danceCategories = [
  "Trending",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Tutorials",
  "Country",
  "Pop",
];

type Dance = {
  _id: string;
  title?: string;
  danceName?: string;
  slug?: string;
  difficulty?: string;
  style?: string;
  choreographer?: string;
  songTitle?: string;
  artist?: string;
  counts?: number;
  walls?: number;
  saves?: number;
  demoUrl?: string;
  tutorialUrl?: string;
  bestDemoVideo?: string;
  bestTutorialVideo?: string;
  sourceName?: string;
  sourceUrl?: string;
};

export default function DiscoverPage() {
  const [dances, setDances] = useState<Dance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultSource, setResultSource] = useState("all");

  async function loadAllDances() {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/dances`);
      const data = await response.json();

      setDances(Array.isArray(data) ? data : []);
      setResultSource("all");
    } catch (error) {
      console.error("Failed to load dances:", error);
      setDances([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!searchTerm.trim()) {
      loadAllDances();
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/dances/search?q=${encodeURIComponent(searchTerm)}`
      );

      const data = await response.json();

      setDances(Array.isArray(data.dances) ? data.dances : []);
      setResultSource(data.source || "search");
    } catch (error) {
      console.error("Search failed:", error);
      setDances([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAllDances();
  }, []);

  return (
    <main className="min-h-screen bg-[#100905] px-8 py-10 pb-24 text-white md:pb-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Discover <span className="text-orange-500">Dances</span>
          </h1>

          <p className="mt-3 text-gray-400">
            Search dances, songs, artists, choreographers, tutorials, and step
            sheets.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dances, songs, choreographers..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white outline-none placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="rounded-2xl bg-orange-500 px-6 py-4 font-semibold text-black transition hover:bg-orange-400"
          >
            Search
          </button>
        </form>

        <p className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300">
          Showing {dances.length} dances from{" "}
          {resultSource === "all" ? "your database" : resultSource}.
        </p>

        <div className="mb-10 flex flex-wrap gap-4">
          {danceCategories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`rounded-full px-5 py-3 transition ${
                index === 0
                  ? "bg-orange-500 font-semibold text-black"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-bold">Loading dances...</h2>
          </div>
        ) : dances.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-bold">No dances found</h2>
            <p className="mt-2 text-gray-400">
              Try another dance name, song, artist, or choreographer.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {dances.map((dance) => {
              const title = dance.title || dance.danceName || "Untitled Dance";

              const hasVideo =
                dance.demoUrl ||
                dance.tutorialUrl ||
                dance.bestDemoVideo ||
                dance.bestTutorialVideo;

              return (
                <Link
                  key={dance._id}
                  href={`/dances/${dance._id}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <div className="relative flex h-72 items-center justify-center bg-gradient-to-b from-orange-600/60 via-orange-900/40 to-black">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur">
                      ▶
                    </div>

                    <span className="absolute left-4 top-4 rounded-full border border-orange-500 bg-black/30 px-3 py-1 text-xs font-semibold text-orange-500">
                      {dance.difficulty || "Unknown"}
                    </span>

                    <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs text-gray-300">
                      {hasVideo ? "Video Ready" : "Info Only"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                        {dance.style || "Line Dance"}
                      </span>

                      <span className="text-sm text-gray-400">
                        {dance.sourceName || "Database"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold">{title}</h2>

                    <p className="mt-2 text-gray-400">
                      {dance.songTitle || "Unknown Song"}
                      {dance.artist ? ` · ${dance.artist}` : ""}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Choreographer: {dance.choreographer || "Unknown"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
                      {dance.counts && (
                        <span className="rounded-full bg-black/30 px-3 py-1">
                          {dance.counts} counts
                        </span>
                      )}

                      {dance.walls && (
                        <span className="rounded-full bg-black/30 px-3 py-1">
                          {dance.walls} walls
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}