"use client";

import { useState } from "react";

interface PostComposerProps {
  onAddPost: (text: string) => void;
}

export default function PostComposer({
  onAddPost,
}: PostComposerProps) {
  const [text, setText] = useState("");

  function handleSubmit() {
    if (!text.trim()) return;

    onAddPost(text);
    setText("");
  }

  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex gap-4">
        <div className="h-14 w-14 rounded-full bg-orange-300" />

        <input
          type="text"
          placeholder="Share a dance, a tip, or what you're working on..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-full bg-black/20 px-6 py-4 outline-none"
        />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
        <div className="flex gap-6 text-gray-300">
          <span>🎥 Video</span>
          <span>🖼 Photo</span>
          <span>📅 Event</span>
          <span>😊 Mood</span>
        </div>

        <button
          onClick={handleSubmit}
          className="rounded-full bg-orange-500 px-8 py-3 font-semibold text-black"
        >
          Post
        </button>
      </div>
    </div>
  );
}