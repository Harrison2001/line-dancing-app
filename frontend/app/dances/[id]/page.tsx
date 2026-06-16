"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

type Dance = {
  _id: string;
  title?: string;
  danceName?: string;
  slug?: string;
  difficulty?: string;
  style?: string;
  choreographer?: string;
  counts?: number;
  walls?: number;
  songTitle?: string;
  artist?: string;

  demoUrl?: string;
  tutorialUrl?: string;
  bestDemoVideo?: string;
  bestTutorialVideo?: string;

  best_demo_video?: string;
  best_tutorial_video?: string;
  demo_video_url?: string;
  tutorial_video_url?: string;
  videoUrl?: string;
  video_url?: string;
  youtubeUrl?: string;
  youtube_url?: string;

  stepsheetUrl?: string;
  stepSheetUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  sourceLinks?: string[];
  description?: string;
};

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return "";

  if (url.includes("/embed/")) return url;

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);

  const videoId = watchMatch?.[1] || shortMatch?.[1];

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function getDemoVideo(dance: Dance) {
  return (
    getYouTubeEmbedUrl(dance.demoUrl) ||
    getYouTubeEmbedUrl(dance.bestDemoVideo) ||
    getYouTubeEmbedUrl(dance.best_demo_video) ||
    getYouTubeEmbedUrl(dance.demo_video_url) ||
    getYouTubeEmbedUrl(dance.videoUrl) ||
    getYouTubeEmbedUrl(dance.video_url) ||
    getYouTubeEmbedUrl(dance.youtubeUrl) ||
    getYouTubeEmbedUrl(dance.youtube_url)
  );
}

function getTutorialVideo(dance: Dance) {
  return (
    getYouTubeEmbedUrl(dance.tutorialUrl) ||
    getYouTubeEmbedUrl(dance.bestTutorialVideo) ||
    getYouTubeEmbedUrl(dance.best_tutorial_video) ||
    getYouTubeEmbedUrl(dance.tutorial_video_url)
  );
}

export default function DanceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [dance, setDance] = useState<Dance | null>(null);
  const [relatedDances, setRelatedDances] = useState<Dance[]>([]);
  const [activeVideo, setActiveVideo] = useState<"demo" | "tutorial">("demo");

  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [tutorialVideoUrl, setTutorialVideoUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  useEffect(() => {
    async function loadDance() {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_BASE_URL}/api/dances/${id}`);

        if (!response.ok) {
          setDance(null);
          return;
        }

        const data: Dance = await response.json();
        setDance(data);

        const fallbackTitle = data.title || data.danceName || "Untitled Dance";
        const songName = data.songTitle || fallbackTitle;

        const existingDemoVideo = getDemoVideo(data);
        const existingTutorialVideo = getTutorialVideo(data);

        setDemoVideoUrl(existingDemoVideo);
        setTutorialVideoUrl(existingTutorialVideo);

        if (!existingDemoVideo) {
          setIsVideoLoading(true);

          const youtubeResponse = await fetch(
            `${API_BASE_URL}/api/youtube/search?q=${encodeURIComponent(
              `${songName} line dance demo`
            )}`
          );

          if (youtubeResponse.ok) {
            const youtubeData = await youtubeResponse.json();

            if (youtubeData.videoUrl) {
              const fallbackDemo =
                getYouTubeEmbedUrl(youtubeData.videoUrl) || youtubeData.videoUrl;

              setDemoVideoUrl(fallbackDemo);
              setYoutubeTitle(youtubeData.title || "");
            }
          }
        }

        const relatedResponse = await fetch(`${API_BASE_URL}/api/dances`);

        if (relatedResponse.ok) {
          const relatedData: Dance[] = await relatedResponse.json();

          const filtered = relatedData
            .filter((item) => item._id !== data._id)
            .slice(0, 8);

          setRelatedDances(filtered);
        }
      } catch (error) {
        console.error("Failed to load dance:", error);
        setDance(null);
      } finally {
        setIsLoading(false);
        setIsVideoLoading(false);
      }
    }

    if (id) loadDance();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#100905] px-8 py-10 text-white">
        <p className="text-gray-400">Loading dance...</p>
      </main>
    );
  }

  if (!dance) {
    return (
      <main className="min-h-screen bg-[#100905] px-8 py-10 text-white">
        <section className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold">Dance not found</h1>

          <Link
            href="/discover"
            className="mt-6 inline-block text-orange-500 hover:text-orange-400"
          >
            ← Back to Discover
          </Link>
        </section>
      </main>
    );
  }

  const fallbackTitle = dance.title || dance.danceName || "Untitled Dance";
  const songName = dance.songTitle || fallbackTitle;

  const selectedVideo =
    activeVideo === "demo" ? demoVideoUrl : tutorialVideoUrl;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${songName} line dance`
  )}`;

  const sourceLinks = [
    ...(dance.sourceLinks || []),
    dance.stepsheetUrl,
    dance.stepSheetUrl,
    dance.sourceUrl,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#100905] px-4 py-6 pb-24 text-white md:px-8 md:py-10">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/discover"
          className="mb-5 inline-block text-sm text-gray-400 hover:text-orange-500"
        >
          ← Back to Discover
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <section>
            <div className="mb-4 flex gap-3">
              <button
                onClick={() => setActiveVideo("demo")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeVideo === "demo"
                    ? "bg-orange-500 text-black"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                Demo
              </button>

              <button
                onClick={() => setActiveVideo("tutorial")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeVideo === "tutorial"
                    ? "bg-orange-500 text-black"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                Tutorial
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              {selectedVideo ? (
                <div className="aspect-video w-full overflow-hidden bg-black">
                  <iframe
                    src={selectedVideo}
                    title={songName}
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-b from-orange-700/60 via-orange-950/60 to-black">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl">
                      ▶
                    </div>

                    <h2 className="text-2xl font-bold">
                      {isVideoLoading
                        ? "Finding video..."
                        : `${activeVideo === "demo" ? "Demo" : "Tutorial"} not available yet`}
                    </h2>

                    <p className="mt-2 text-gray-400">
                      Search YouTube or view the step sheet below.
                    </p>

                    <a
                      href={youtubeSearchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-block rounded-full bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400"
                    >
                      Search YouTube
                    </a>
                  </div>
                </div>
              )}

              <div className="p-6 md:p-8">
                <h1 className="text-3xl font-bold md:text-4xl">{songName}</h1>

                {youtubeTitle && (
                  <p className="mt-2 text-sm text-gray-400">
                    YouTube match: {youtubeTitle}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500">
                    {dance.difficulty || "Unknown Difficulty"}
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-gray-300">
                    {dance.style || "Line Dance"}
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-gray-300">
                    {dance.sourceName || "Database"}
                  </span>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <button
                    onClick={() => setShowMoreInfo(!showMoreInfo)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="text-xl font-bold">Dance Information</span>
                    <span className="text-sm text-gray-400">
                      {showMoreInfo ? "Hide" : "Expand"}
                    </span>
                  </button>

                  {showMoreInfo && (
                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <InfoCard label="Choreographer" value={dance.choreographer} />
                      <InfoCard label="Song" value={dance.songTitle} />
                      <InfoCard label="Artist" value={dance.artist} />
                      <InfoCard label="Counts" value={dance.counts?.toString()} />
                      <InfoCard label="Walls" value={dance.walls?.toString()} />
                      <InfoCard label="Difficulty" value={dance.difficulty} />
                    </div>
                  )}
                </div>

                {dance.description && (
                  <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                    <h2 className="mb-2 text-xl font-bold">About this dance</h2>
                    <p className="text-gray-400">{dance.description}</p>
                  </div>
                )}

                {sourceLinks.length > 0 && (
                  <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                    <h2 className="mb-4 text-xl font-bold">Source Links</h2>

                    <div className="flex flex-wrap gap-3">
                      {sourceLinks.map((link, index) => (
                        <a
                          key={`${link}-${index}`}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-white/10"
                        >
                          {index === 0 ? "View Step Sheet" : "View Source"}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-xl font-bold">Related Dances</h2>

            <div className="space-y-3">
              {relatedDances.length > 0 ? (
                relatedDances.map((item) => {
                  const itemTitle =
                    item.songTitle || item.title || item.danceName || "Untitled Dance";

                  return (
                    <Link
                      key={item._id}
                      href={`/discover/${item._id}`}
                      className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/10"
                    >
                      <h3 className="line-clamp-1 font-semibold">
                        {itemTitle}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-sm text-gray-400">
                        {item.difficulty || "Unknown"}
                        {item.style ? ` • ${item.style}` : ""}
                      </p>

                      {item.choreographer && (
                        <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                          {item.choreographer}
                        </p>
                      )}
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">
                  No related dances found.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">
        {value || "Unknown"}
      </p>
    </div>
  );
}