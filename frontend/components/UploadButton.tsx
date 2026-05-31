"use client";

import { useState } from "react";
import UploadModal from "@/components/UploadModal";


export default function UploadButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-orange-500 px-4 py-2 text-white"
      >
        Upload
      </button>

      {isOpen && (
        <UploadModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}