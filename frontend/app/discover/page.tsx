const danceCategories = [
  "Trending",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Tutorials",
  "Country",
  "Pop",
];

const discoverDances = [
  {
    title: "Wagon Wheel Rock",
    song: "Wagon Wheel",
    artist: "Darius Rucker",
    difficulty: "Improver",
    saves: "2.8k",
  },
  {
    title: "Texas Hold Em",
    song: "Texas Hold Em",
    artist: "Beyoncé",
    difficulty: "Beginner",
    saves: "1.9k",
  },
  {
    title: "Copperhead Road",
    song: "Copperhead Road",
    artist: "Steve Earle",
    difficulty: "Classic",
    saves: "4.7k",
  },
  {
    title: "Boot Scootin Boogie",
    song: "Boot Scootin Boogie",
    artist: "Brooks & Dunn",
    difficulty: "Beginner",
    saves: "3.2k",
  },
  {
    title: "Cold Heart",
    song: "Cold Heart",
    artist: "Elton John & Dua Lipa",
    difficulty: "Intermediate",
    saves: "987",
  },
  {
    title: "Good Time",
    song: "Good Time",
    artist: "Alan Jackson",
    difficulty: "Improver",
    saves: "1.5k",
  },
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#100905] px-8 py-10 pb-24 text-white md:pb-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Discover <span className="text-orange-500">Dances</span>
          </h1>

          <p className="mt-3 text-gray-400">
            Search trending dances, tutorials, songs, and choreography from the community.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search dances, songs, choreographers..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white outline-none placeholder:text-gray-500"
          />
        </div>

        <div className="mb-10 flex flex-wrap gap-4">
          {danceCategories.map((category, index) => (
            <button
              key={category}
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

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {discoverDances.map((dance) => (
            <article
              key={dance.title}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="relative flex h-72 items-center justify-center bg-gradient-to-b from-orange-600/60 via-orange-900/40 to-black">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur">
                  ▶
                </button>

                <span className="absolute left-4 top-4 rounded-full border border-orange-500 bg-black/30 px-3 py-1 text-xs font-semibold text-orange-500">
                  {dance.difficulty}
                </span>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                    Trending
                  </span>

                  <span className="text-sm text-gray-400">
                    {dance.saves} saves
                  </span>
                </div>

                <h2 className="text-2xl font-bold">{dance.title}</h2>

                <p className="mt-2 text-gray-400">
                  {dance.song} · {dance.artist}
                </p>

                <div className="mt-5 flex gap-3">
                  <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10">
                    ✓ Know
                  </button>

                  <button className="rounded-full border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-500 hover:text-black">
                    📖 Learning
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}