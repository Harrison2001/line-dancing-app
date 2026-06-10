async function getDance(id: string) {
  const res = await fetch(`http://localhost:5000/api/dances/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load dance");
  }

  return res.json();
}

export default async function DanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dance = await getDance(id);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video flex items-center justify-center">
          {dance.demoUrl ? (
            <iframe
              src={dance.demoUrl}
              className="h-full w-full"
              allowFullScreen
            />
          ) : (
            <div className="text-center">
              <p className="text-zinc-400 text-lg">No video available yet</p>
              <p className="text-zinc-600 text-sm mt-2">
                Tutorial videos coming soon
              </p>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-2">{dance.title}</h1>

        <p className="text-zinc-400">
          {dance.difficulty || "Unknown level"} • {dance.counts || 0} counts •{" "}
          {dance.walls || 0} walls
        </p>

        <div className="flex gap-3 mt-5 mb-6">
          <button className="rounded-xl bg-white text-black px-5 py-2 font-semibold hover:bg-zinc-200">
            Save Dance
          </button>

          {dance.stepsheetUrl && (
            <a
              href={dance.stepsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-zinc-800 px-5 py-2 font-semibold hover:bg-zinc-700"
            >
              View Stepsheet
            </a>
          )}
        </div>

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Dance Details</h2>

          <p>
            <span className="font-semibold text-zinc-300">Choreographer:</span>{" "}
            {dance.choreographer || "Unknown"}
          </p>

          <p>
            <span className="font-semibold text-zinc-300">Song:</span>{" "}
            {dance.songTitle || "Unknown"}
          </p>

          <p>
            <span className="font-semibold text-zinc-300">Source:</span>{" "}
            {dance.sourceName || "Unknown"}
          </p>

          {dance.description && (
            <p className="text-zinc-400 pt-2">{dance.description}</p>
          )}
        </div>
      </div>
    </main>
  );
}