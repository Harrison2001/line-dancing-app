"use client";

import { useState } from "react";

type UploadModalProps = {
  onClose: () => void;
};

export default function UploadModal({ onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please choose a file.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    console.log({
      file,
      title,
      caption,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#130c08] p-6 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-white/70 hover:text-white"
        >
          ×
        </button>

        <h2 className="mb-4 text-2xl font-bold">Upload Dance Video</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-white/20 bg-black/30 p-3 text-sm"
          />

          {previewUrl && (
            <video
              src={previewUrl}
              controls
              className="h-64 w-full rounded-xl object-cover"
            />
          )}

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-black/30 p-3 outline-none"
          />

          <textarea
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="h-28 w-full rounded-lg border border-white/20 bg-black/30 p-3 outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
          >
            Post Upload
          </button>
        </form>
      </div>
    </div>
  );
}