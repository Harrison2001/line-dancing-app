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
  stepsheetUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  sourceLinks?: string[];
  description?: string;
};

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return "";

  if (url.includes("/embed/")) return url;

  const watchMatch = url.match(/v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);

  const videoId = watchMatch?.[1] || shortMatch?.[1];

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export default function DanceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [dance, setDance] = useState<Dance | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    async function loadDance() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dances/${id}`);

        if (!response.ok) {
          setDance(null);
          return;
        }

        const data = await response.json();
        setDance(data);

        const fallbackTitle = data.title || data.danceName || "Untitled Dance";
        const songName = data.songTitle || fallbackTitle;

        const existingVideoUrl =
          getYouTubeEmbedUrl(data.demoUrl) ||
          getYouTubeEmbedUrl(data.tutorialUrl) ||
          getYouTubeEmbedUrl(data.bestDemoVideo) ||
          getYouTubeEmbedUrl(data.bestTutorialVideo);

        if (existingVideoUrl) {
          setVideoUrl(existingVideoUrl);
          return;
        }

        setIsVideoLoading(true);

        const youtubeResponse = await fetch(
          `${API_BASE_URL}/api/youtube/search?q=${encodeURIComponent(
            `${songName} line dance`
          )}`
        );

        if (!youtubeResponse.ok) return;

        const youtubeData = await youtubeResponse.json();

        if (youtubeData.videoUrl) {
          setVideoUrl(youtubeData.videoUrl);
          setYoutubeTitle(youtubeData.title || "");
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

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${songName} line dance`
  )}`;

  const sourceLinks = [
    ...(dance.sourceLinks || []),
    dance.stepsheetUrl,
    dance.sourceUrl,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#100905] px-4 py-6 pb-24 text-white md:px-8 md:py-10">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/discover"
          className="mb-6 inline-block text-sm text-gray-400 hover:text-orange-500"
        >
          ← Back to Discover
        </Link>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="p-6 md:p-8">
            <h1 className="text-4xl font-bold md:text-5xl">{songName}</h1>

            {youtubeTitle && (
              <p className="mt-2 text-sm text-gray-400">
                YouTube match: {youtubeTitle}
              </p>
            )}
          </div>

          {videoUrl ? (
            <div className="aspect-video w-full overflow-hidden bg-black">
              <iframe
                src={videoUrl}
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
                  {isVideoLoading ? "Finding video..." : "Video not available yet"}
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
            <div className="mb-8 flex flex-wrap gap-3">
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

            <div className="grid gap-5 md:grid-cols-2">
              <InfoCard label="Choreographer" value={dance.choreographer} />
              <InfoCard label="Counts" value={dance.counts?.toString()} />
              <InfoCard label="Walls" value={dance.walls?.toString()} />
              <InfoCard label="Difficulty" value={dance.difficulty} />
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