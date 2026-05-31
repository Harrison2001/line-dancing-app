import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#080302] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#2a1a12] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ff6a0030,transparent_45%)]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-[#ff6a00]/30 bg-[#ff6a00]/10 px-4 py-2 text-sm font-medium text-orange-400">
              Built for the line dancing community
            </p>

            <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
              Find dances, events, and dancers near you.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">
              LineDance brings tutorials, local dance nights, venues, and
              community into one place so dancers can learn, connect, and stay
              in the scene.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-[#ff6a00] px-8 py-3 text-center font-bold text-black transition hover:bg-orange-500"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="rounded-full border border-[#3a2418] px-8 py-3 text-center font-bold transition hover:bg-[#160d08]"
              >
                Login
              </Link>
            </div>
          </div>

          {/* App Preview */}
          <div className="rounded-[2rem] border border-[#2a1a12] bg-[#120905] p-5 shadow-2xl">
            <div className="rounded-[1.5rem] border border-[#2a1a12] bg-[#0b0503] p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Tonight Near You</h2>
                <span className="rounded-full bg-[#ff6a00]/15 px-3 py-1 text-sm text-orange-400">
                  Live
                </span>
              </div>

              <div className="space-y-4">
                <PreviewCard
                  title="Country Line Dance Night"
                  subtitle="Dixie Roadhouse • 8:00 PM"
                  tag="Event"
                />
                <PreviewCard
                  title="Copperhead Road Tutorial"
                  subtitle="Beginner • 4 min lesson"
                  tag="Dance"
                />
                <PreviewCard
                  title="The Ranch Fort Myers"
                  subtitle="Popular venue near you"
                  tag="Venue"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Value */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <ValueCard
            icon="🎵"
            title="Find dances faster"
            description="Search dances, tutorials, songs, and difficulty levels without digging through random videos."
          />

          <ValueCard
            icon="📍"
            title="Know where to dance"
            description="Find local events, venues, dance nights, and community activity near your area."
          />

          <ValueCard
            icon="🤠"
            title="Stay connected"
            description="Follow dancers, join groups, make friends, and keep up with what the community is doing."
          />
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[#2a1a12] bg-[#0d0603] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">Everything dancers need</h2>
            <p className="mt-3 text-gray-400">
              Built around discovery, learning, events, and community.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard title="Dance Library" text="Find dances, songs, tutorials, and difficulty levels." />
            <FeatureCard title="Discover" text="See trending, new, and popular dances." />
            <FeatureCard title="Events" text="Find dance nights, concerts, and local events." />
            <FeatureCard title="Friends" text="Connect with dancers and build your community." />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold">How it works</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Step number="1" title="Create your account" text="Sign up and create your dancer profile." />
          <Step number="2" title="Set your location" text="Tell LineDance where you dance so we can show local content." />
          <Step number="3" title="Start discovering" text="Find dances, events, venues, and dancers near you." />
        </div>
      </section>

      {/* Audience */}
      <section className="border-t border-[#2a1a12] bg-[#0d0603] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-4xl font-bold">Made for the whole scene</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <AudienceCard title="Dancers" text="Learn dances, find events, save favorites, and connect with others." />
            <AudienceCard title="Choreographers" text="Share dances, grow your audience, and help people learn your work." />
            <AudienceCard title="Venues" text="Promote dance nights, events, classes, and local community activity." />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-4xl font-extrabold">Ready to join LineDance?</h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-400">
          Start with your profile, set your location, and discover what is
          happening in the line dancing community.
        </p>

        <Link
          href="/signup"
          className="mt-8 inline-block rounded-full bg-[#ff6a00] px-10 py-4 font-bold text-black transition hover:bg-orange-500"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}

function PreviewCard({
  title,
  subtitle,
  tag,
}: {
  title: string;
  subtitle: string;
  tag: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2a1a12] bg-[#160d08] p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-bold">{title}</h3>
        <span className="rounded-full bg-[#ff6a00] px-3 py-1 text-xs font-bold text-black">
          {tag}
        </span>
      </div>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-[#2a1a12] bg-[#120905] p-6">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-3 leading-7 text-gray-400">{description}</p>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#2a1a12] bg-[#120905] p-5">
      <h3 className="text-xl font-bold text-orange-400">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-gray-400">{text}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-[#2a1a12] bg-[#120905] p-6 text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6a00] font-extrabold text-black">
        {number}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-6 text-gray-400">{text}</p>
    </div>
  );
}

function AudienceCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-[#2a1a12] bg-[#120905] p-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-3 leading-7 text-gray-400">{text}</p>
    </div>
  );
}