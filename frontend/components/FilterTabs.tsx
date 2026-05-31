export default function FilterTabs() {
  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <button className="rounded-full bg-orange-500 px-8 py-3 font-semibold text-black">
        ✨ For You
      </button>

      <button className="rounded-full border border-white/10 px-8 py-3">
        Trending
      </button>

      <button className="rounded-full border border-white/10 px-8 py-3">
        Tutorials
      </button>

      <button className="rounded-full border border-white/10 px-8 py-3">
        Events
      </button>
    </div>
  );
}