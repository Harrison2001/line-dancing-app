"use client";

import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/services/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#100905] pb-24 text-white md:pb-0">
      <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-bold">
          Welcome <span className="text-orange-500">Back</span>
        </h1>

        <p className="mt-2 text-gray-400">
          Log in to continue your dance journey.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-gray-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none placeholder:text-gray-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-orange-500 py-4 font-semibold text-black hover:bg-orange-400"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-500">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}