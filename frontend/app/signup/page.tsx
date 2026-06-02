"use client";

import { useState } from "react";
import Link from "next/link";
import { signupUser } from "@/services/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await signupUser(username, email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/onboarding");
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#100905] pb-24 text-white md:pb-0">
      <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-bold">
          Join <span className="text-orange-500">LineDance</span>
        </h1>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl bg-black/30 p-4"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl bg-black/30 p-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl bg-black/30 p-4"
          />

          <button className="w-full rounded-full bg-orange-500 py-4 font-semibold text-black">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}