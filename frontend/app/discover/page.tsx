"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

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

function getTitle(dance: Dance) {
  return dance.title || dance.danceName || "Untitled Dance";
}

function hasVideo(dance: Dance) {
  return (
    dance.demoUrl ||
    dance.tutorialUrl ||
    dance.bestDemoVideo ||
    dance.bestTutorialVideo
  );
}

function DanceCard({ dance }: { dance: Dance }) {
  const title = getTitle(dance);

  return (
    <Link
      href={`/dances/${dance._id}`}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
    >
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-b from-orange-600/60 via-orange-900/40 to-black">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur">
          ▶
        </div>

        <span className="absolute left-3 top-3 rounded-full border border-orange-500 bg-black/40 px-3 py-1 text-xs font-semibold text-orange-400">
          {dance.difficulty || "Unknown"}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs text-gray-300">
          {hasVideo(dance) ? "Video" : "Info"}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
            {dance.style || "Line Dance"}
          </span>

          <span className="truncate text-xs text-gray-500">
            {dance.sourceName || "Database"}
          </span>
        </div>

        <h2 className="line-clamp-2 text-xl font-bold">{title}</h2>

        <p className="mt-2 line-clamp-1 text-sm text-gray-400">
          {dance.songTitle || "Unknown Song"}
          {dance.artist ? ` · ${dance.artist}` : ""}
        </p>

        <p className="mt-2 line-clamp-1 text-xs text-gray-500">
          Choreographer: {dance.choreographer || "Unknown"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
          {dance.counts ? (
            <span className="rounded-full bg-black/30 px-3 py-1">
              {dance.counts} counts
            </span>
          ) : null}

          {dance.walls ? (
            <span className="rounded-full bg-black/30 px-3 py-1">
              {dance.walls} walls
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function DiscoverPage() {
  const [dances, setDances] = useState<Dance[]>([]);
  const [searchResults, setSearchResults] = useState<Dance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultSource, setResultSource] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  async function loadAllDances() {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/dances`);
      const data = await response.json();

      setDances(Array.isArray(data) ? data : []);
      setResultSource("all");
      setIsSearching(false);
      setSearchResults([]);
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
      setIsSearching(true);

      const response = await fetch(
        `${API_BASE_URL}/api/dances/search?q=${encodeURIComponent(searchTerm)}`
      );

      const data = await response.json();

      setSearchResults(Array.isArray(data.dances) ? data.dances : []);
      setResultSource(data.source || "search");
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAllDances();
  }, []);

  const recommended = useMemo(() => {
    const videoReady = dances.filter(hasVideo);

    if (videoReady.length > 0) {
      return videoReady.slice(0, 12);
    }

    return dances.slice(0, 12);
  }, [dances]);

  return (
    <main className="min-h-screen bg-[#100905] px-6 py-10 pb-24 text-white md:px-8 md:pb-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Discover <span className="text-orange-500">Dances</span>
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Search dances, songs, artists, choreographers, tutorials, and step
            sheets.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
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

        {isSearching && (
          <button
            type="button"
            onClick={loadAllDances}
            className="mb-8 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/10"
          >
            Clear search
          </button>
        )}

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-bold">Loading dances...</h2>
          </div>
        ) : isSearching ? (
          <section>
            <p className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300">
              Showing {searchResults.length} search results from {resultSource}.
            </p>

            {searchResults.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                <h2 className="text-2xl font-bold">No dances found</h2>
                <p className="mt-2 text-gray-400">
                  Try another dance name, song, artist, or choreographer.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {searchResults.map((dance) => (
                  <DanceCard key={dance._id} dance={dance} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <p className="mb-8 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300">
              Showing {recommended.length} recommended dances from{" "}
              {dances.length} dances in your database.
            </p>

            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold">Recommended For You</h2>

              <p className="mb-6 text-gray-400">
                Popular dances and tutorials to get started.
              </p>

              {recommended.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                  <h2 className="text-2xl font-bold">No dances loaded yet</h2>
                  <p className="mt-2 text-gray-400">
                    Check your backend or database connection.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {recommended.map((dance) => (
                    <DanceCard key={dance._id} dance={dance} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}