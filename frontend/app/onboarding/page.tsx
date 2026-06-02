"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const interestOptions = [
  "Learning new dances",
  "Finding local events",
  "Finding venues",
  "Meeting other dancers",
  "Following choreographers",
  "Dance tutorials",
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [danceExperience, setDanceExperience] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [danceFrequency, setDanceFrequency] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const totalSteps = 6;

  function nextStep() {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  }

  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function toggleInterest(interest: string) {
    if (interests.includes(interest)) {
      setInterests(interests.filter((item) => item !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  }

  async function handleFinish() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.id) {
    console.error("No user ID found");
    return;
  }

  const res = await fetch(`http://localhost:5000/api/onboarding/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      city,
      state,
      danceExperience,
      skillLevel,
      danceFrequency,
      interests,
      bio,
      profileImage,
    }),
  });

  if (!res.ok) {
    console.error("Failed to save onboarding");
    return;
  }

  const data = await res.json();

  localStorage.setItem("user", JSON.stringify(data.user));

  router.push("/home");
}

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="text-sm text-gray-400">
            Step {step} of {totalSteps}
          </p>

          <div className="mt-3 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-white transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
          {step === 1 && (
            <section>
              <h1 className="text-3xl font-bold">Welcome to LineDance</h1>
              <p className="mt-4 text-gray-300">
                Let&apos;s set up your profile so you can discover dances,
                events, venues, and dancers near you.
              </p>
            </section>
          )}

          {step === 2 && (
            <section>
              <h1 className="text-3xl font-bold">Where do you dance?</h1>
              <p className="mt-3 text-gray-300">
                Your location helps us show nearby venues and events.
              </p>

              <div className="mt-6 space-y-4">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white"
                />

                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white"
                />
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h1 className="text-3xl font-bold">Your dance experience</h1>
              <p className="mt-3 text-gray-300">
                This helps us recommend dances, tutorials, events, and venues
                that fit you.
              </p>

              <div className="mt-6 space-y-6">
                <QuestionGroup
                  title="How long have you been line dancing?"
                  options={[
                    "Just getting started",
                    "Less than 6 months",
                    "6 months - 1 year",
                    "1-3 years",
                    "3+ years",
                  ]}
                  selected={danceExperience}
                  onSelect={setDanceExperience}
                />

                <QuestionGroup
                  title="What is your skill level?"
                  options={["Beginner", "Intermediate", "Advanced"]}
                  selected={skillLevel}
                  onSelect={setSkillLevel}
                />

                <QuestionGroup
                  title="How often do you line dance?"
                  options={[
                    "Rarely",
                    "Monthly",
                    "A few times a month",
                    "Weekly",
                    "Multiple times per week",
                  ]}
                  selected={danceFrequency}
                  onSelect={setDanceFrequency}
                />

                <div>
                  <h2 className="mb-3 font-semibold">
                    What are you most interested in?
                  </h2>

                  <div className="grid gap-3">
                    {interestOptions.map((interest) => {
                      const selected = interests.includes(interest);

                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                            selected
                              ? "border-white bg-white text-black"
                              : "border-white/10 bg-black text-white hover:bg-white/10"
                          }`}
                        >
                          {selected ? "✓ " : ""}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <h1 className="text-3xl font-bold">Create your profile</h1>
              <p className="mt-3 text-gray-300">
                Add a short bio so other dancers know a little about you.
              </p>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Example: I love country line dancing and learning new dances."
                rows={5}
                className="mt-6 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white"
              />

              <input
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="Profile image URL optional"
                className="mt-4 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white"
              />
            </section>
          )}

          {step === 5 && (
            <section>
              <h1 className="text-3xl font-bold">What you can do here</h1>

              <div className="mt-6 space-y-4">
                <TutorialCard
                  title="Discover dances"
                  description="Search dances, watch tutorials, and find dances you want to learn."
                />

                <TutorialCard
                  title="Find events and venues"
                  description="See where line dancing is happening near your area."
                />

                <TutorialCard
                  title="Connect with dancers"
                  description="Follow dancers, join groups, and become part of the community."
                />
              </div>
            </section>
          )}

          {step === 6 && (
            <section className="text-center">
              <h1 className="text-3xl font-bold">You&apos;re all set</h1>
              <p className="mt-4 text-gray-300">
                Your LineDance profile is ready. Start discovering dances,
                events, and venues.
              </p>
            </section>
          )}

          <div className="mt-8 flex justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-full border border-white/20 px-6 py-3 hover:bg-white/10"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
              >
                Enter App
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function QuestionGroup({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-3 font-semibold">{title}</h2>

      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
              selected === option
                ? "border-white bg-white text-black"
                : "border-white/10 bg-black text-white hover:bg-white/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function TutorialCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-4">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}