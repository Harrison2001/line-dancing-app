export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#100905] pb-24 text-white md:pb-0">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Dance <span className="text-orange-500">Events</span>
          </h1>

          <p className="mt-3 text-gray-400">
            Find local dance nights, workshops, socials, and community meetups.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          {["This Week", "Workshops", "Socials", "Beginner Friendly", "Nearby"].map(
            (filter, index) => (
              <button
                key={filter}
                className={`rounded-full px-5 py-3 ${
                  index === 0
                    ? "bg-orange-500 font-semibold text-black"
                    : "border border-white/10 bg-white/5 text-gray-300"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {[
              {
                title: "Friday Night Line Dance Social",
                location: "The Ranch · Fort Myers, FL",
                date: "Friday",
                time: "8:00 PM",
                type: "Social",
              },
              {
                title: "Beginner Workshop",
                location: "Downtown Dance Studio",
                date: "Saturday",
                time: "2:00 PM",
                type: "Workshop",
              },
              {
                title: "Country Dance Night",
                location: "Dixie Roadhouse",
                date: "Saturday",
                time: "9:00 PM",
                type: "Event",
              },
            ].map((event) => (
              <article
                key={event.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="rounded-full border border-orange-500 px-3 py-1 text-xs text-orange-500">
                      {event.type}
                    </span>

                    <h2 className="mt-4 text-2xl font-bold">{event.title}</h2>

                    <p className="mt-2 text-gray-400">{event.location}</p>
                    <p className="mt-1 text-gray-400">
                      {event.date} · {event.time}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-black">
                      Interested
                    </button>

                    <button className="rounded-full border border-white/10 px-5 py-2 text-gray-300">
                      Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold">Upcoming Highlights</h3>

            <div className="mt-6 space-y-5">
              <div>
                <p className="font-semibold text-orange-500">Most Popular</p>
                <p className="mt-1 text-gray-300">
                  Friday Night Line Dance Social
                </p>
              </div>

              <div>
                <p className="font-semibold text-orange-500">Beginner Pick</p>
                <p className="mt-1 text-gray-300">Beginner Workshop</p>
              </div>

              <div>
                <p className="font-semibold text-orange-500">Community Note</p>
                <p className="mt-1 text-gray-300">
                  Bring dance requests for songs you want played.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}