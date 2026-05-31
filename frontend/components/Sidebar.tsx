export default function RightSidebar() {
  return (
    <div className="space-y-8">

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-bold">
          🔥 Your dance streak
        </h2>

        <div className="mt-6 text-6xl font-bold text-orange-500">
          12
          <span className="ml-2 text-3xl text-gray-300">
            days
          </span>
        </div>

        <p className="mt-4 text-gray-400">
          Practice today to keep it alive 🔥
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-bold">
          🏆 Active challenges
        </h2>

        <div className="mt-6">
          <p>30-Day Streak</p>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div className="h-2 w-[60%] rounded-full bg-orange-500"></div>
          </div>
        </div>

        <div className="mt-6">
          <p>Learn 5 New Dances</p>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div className="h-2 w-[40%] rounded-full bg-orange-500"></div>
          </div>
        </div>
      </div>

    </div>
  );
}