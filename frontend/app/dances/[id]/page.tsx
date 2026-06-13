"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Dance = {
  _id: string;
  title: string;
  difficulty?: string;
  choreographer?: string;
  counts?: number;
  walls?: number;
  songTitle?: string;
  artist?: string;
  bestDemoVideo?: string;
  bestTutorialVideo?: string;
  sourceLinks?: string[];
};

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return "";

  const watchMatch = url.match(/v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);

  const videoId = watchMatch?.[1] || shortMatch?.[1];

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export default function DanceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [dance, setDance] = useState<Dance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDance() {
      try {
        const response = await fetch(`http://localhost:5000/api/dances/${id}`);
        const data = await response.json();
        setDance(data);
      } catch (error) {
        console.error("Failed to load dance:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) loadDance();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <p>Loading dance...</p>
      </main>
    );
  }

  if (!dance) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <p>Dance not found.</p>
        <Link href="/discover" className="text-blue-400">
          Back to Discover
        </Link>
      </main>
    );
  }

  const videoUrl =
    getYouTubeEmbedUrl(dance.bestDemoVideo) ||
    getYouTubeEmbedUrl(dance.bestTutorialVideo);

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/discover" className="text-sm text-gray-400 hover:text-white">
          ← Back to Discover
        </Link>

        {videoUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900">
            <iframe
              src={videoUrl}
              title={dance.title}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl bg-zinc-900 flex items-center justify-center text-gray-400">
            No video found yet
          </div>
        )}

        <section>
          <h1 className="text-3xl font-bold">{dance.title}</h1>

          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {dance.difficulty && (
              <span className="rounded-full bg-purple-600 px-3 py-1">
                {dance.difficulty}
              </span>
            )}

            {dance.counts && (
              <span className="rounded-full bg-zinc-800 px-3 py-1">
                {dance.counts} counts
              </span>
            )}

            {dance.walls && (
              <span className="rounded-full bg-zinc-800 px-3 py-1">
                {dance.walls} walls
              </span>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-zinc-900 p-5 space-y-3">
          <h2 className="text-xl font-semibold">Dance Info</h2>

          <p>
            <span className="text-gray-400">Choreographer:</span>{" "}
            {dance.choreographer || "Unknown"}
          </p>

          <p>
            <span className="text-gray-400">Song:</span>{" "}
            {dance.songTitle || "Unknown"}
          </p>

          <p>
            <span className="text-gray-400">Artist:</span>{" "}
            {dance.artist || "Unknown"}
          </p>
        </section>

        {dance.sourceLinks && dance.sourceLinks.length > 0 && (
          <section className="rounded-2xl bg-zinc-900 p-5">
            <h2 className="text-xl font-semibold mb-3">Source Links</h2>

            <div className="space-y-2">
              {dance.sourceLinks.map((link) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  className="block text-blue-400 hover:underline"
                >
                  {link}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}