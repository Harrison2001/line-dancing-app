"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const difficultyTabs = [
  "Recommended",
  "Beginner",
  "Improver",
  "Intermediate",
  "Advanced",
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

const DANCES_PER_SUBLEVEL = 4;

const TAB_SUBLEVELS: Record<string, string[]> = {
  Beginner: ["absolute beginner", "beginner", "high beginner"],
  Improver: ["easy improver", "improver", "high improver"],
  Intermediate: ["easy intermediate", "intermediate", "high intermediate"],
  Advanced: ["easy advanced", "advanced"],
};

const DIFFICULTY_RANK: Record<string, number> = {
  "absolute beginner": 0,
  beginner: 10,
  "high beginner": 20,
  "easy improver": 30,
  improver: 40,
  "high improver": 50,
  "easy intermediate": 60,
  intermediate: 70,
  "high intermediate": 80,
  "easy advanced": 90,
  advanced: 100,
};

type DanceSection = {
  label: string;
  dances: Dance[];
};

function formatDifficultyLabel(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeDifficultyLabel(difficulty?: string) {
  const normalized = (difficulty || "").toLowerCase().trim();
  if (!normalized) return null;

  if (normalized in DIFFICULTY_RANK) {
    return normalized;
  }

  const matchedKey = Object.keys(DIFFICULTY_RANK)
    .sort((a, b) => b.length - a.length)
    .find((key) => normalized === key || normalized.includes(key));

  return matchedKey || null;
}

function sortByEasiestFirst(danceList: Dance[]) {
  return [...danceList].sort(
    (a, b) =>
      getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty)
  );
}

function getDancesForSubLevel(dances: Dance[], subLevel: string) {
  return sortByEasiestFirst(
    dances.filter(
      (dance) => normalizeDifficultyLabel(dance.difficulty) === subLevel
    )
  ).slice(0, DANCES_PER_SUBLEVEL);
}

function getSectionsForTab(dances: Dance[], tab: string): DanceSection[] {
  if (tab === "Recommended") {
    const videoReady = dances.filter(hasVideo);
    const pool = videoReady.length > 0 ? videoReady : dances;
    const recommended = sortByEasiestFirst(pool).slice(0, 12);

    return recommended.length
      ? [{ label: "Recommended For You", dances: recommended }]
      : [];
  }

  const subLevels = TAB_SUBLEVELS[tab] || [];

  return subLevels
    .map((subLevel) => ({
      label: formatDifficultyLabel(subLevel),
      dances: getDancesForSubLevel(dances, subLevel),
    }))
    .filter((section) => section.dances.length > 0);
}

function getDifficultyRank(difficulty?: string) {
  const normalized = normalizeDifficultyLabel(difficulty);
  return normalized ? DIFFICULTY_RANK[normalized] : 999;
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
  const [activeTab, setActiveTab] = useState("Recommended");
  const [loadError, setLoadError] = useState("");

  async function loadAllDances() {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await fetch(`${API_BASE_URL}/api/dances`);

      if (!response.ok) {
        throw new Error("Failed to load dances");
      }

      const data = await response.json();

      setDances(Array.isArray(data) ? data : []);
      setResultSource("all");
      setIsSearching(false);
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to load dances:", error);
      setDances([]);
      setLoadError(
        "Could not load dances. Make sure the backend is running on port 5000."
      );
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

  const danceSections = useMemo(
    () => getSectionsForTab(dances, activeTab),
    [dances, activeTab]
  );

  const hasVisibleDances = danceSections.some(
    (section) => section.dances.length > 0
  );

  const sortedSearchResults = useMemo(
    () => sortByEasiestFirst(searchResults),
    [searchResults]
  );

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

        {!isSearching && (
          <div className="mb-8 flex flex-wrap gap-3">
            {difficultyTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 font-medium transition ${
                  activeTab === tab
                    ? "bg-orange-500 text-black"
                    : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

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
              Showing {sortedSearchResults.length} search results from {resultSource}.
            </p>

            {sortedSearchResults.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                <h2 className="text-2xl font-bold">No dances found</h2>
                <p className="mt-2 text-gray-400">
                  Try another dance name, song, artist, or choreographer.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {sortedSearchResults.map((dance) => (
                  <DanceCard key={dance._id} dance={dance} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            {loadError && (
              <p className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-300">
                {loadError}
              </p>
            )}

            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold">
                {activeTab === "Recommended"
                  ? "Recommended For You"
                  : activeTab}
              </h2>

              <p className="mb-6 text-gray-400">
                {activeTab === "Recommended"
                  ? "Popular dances and tutorials to get started."
                  : `Up to ${DANCES_PER_SUBLEVEL} dances in each ${activeTab.toLowerCase()} level.`}
              </p>

              {!hasVisibleDances ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                  <h2 className="text-2xl font-bold">No dances found</h2>
                  <p className="mt-2 text-gray-400">
                    No dances match this tab yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  {danceSections.map((section, index) => (
                    <div key={`${section.label}-${index}`}>
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {section.dances.map((dance) => (
                          <DanceCard key={dance._id} dance={dance} />
                        ))}
                      </div>
                    </div>
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