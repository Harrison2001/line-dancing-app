"use client";

import { useEffect, useState } from "react";
import FeedCard from "@/components/FeedCard";
import PostComposer from "@/components/PostComposer";
import FilterTabs from "@/components/FilterTabs";
import { createPost, getPosts } from "@/services/api";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }

  async function addPost(text: string) {
    try {
      const newPost = await createPost(text);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  return (
    <main className="min-h-screen bg-[#100905] text-white">
      <section className="mx-auto flex max-w-6xl justify-center px-4 py-6 md:px-8 md:py-10">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold md:text-4xl">
              Your <span className="text-orange-500">Feed</span>
            </h2>

            <p className="mt-2 text-gray-400">
              What the line dance community is dancing today.
            </p>
          </div>

          <FilterTabs />

          <PostComposer onAddPost={addPost} />

          <div className="space-y-8">
            {posts.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">
                No posts yet. Be the first to share something.
              </div>
            ) : (
              posts.map((post) => (
                <FeedCard key={post._id} {...post} />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}