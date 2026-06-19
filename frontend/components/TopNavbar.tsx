"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Discover", href: "/discover" },
  { label: "Events", href: "/events" },
  { label: "Friends", href: "/friends" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="hidden w-full border-b border-white/10 bg-[#1b120f] md:block">
      <div className="flex h-20 items-center justify-between px-12">
        <Link href="/home" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl">
            ✨
          </div>

          <span className="text-3xl font-bold text-white">LineDance</span>
        </Link>

        <div className="mr-10 flex items-center">
          <nav className="flex items-center gap-12">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-semibold transition ${
                    isActive
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div ref={menuRef} className="relative ml-16">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition ${
                pathname.startsWith("/profile")
                  ? "bg-orange-400 text-black"
                  : "bg-orange-500 text-black hover:bg-orange-400"
              }`}
            >
              H
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 z-[9999] mt-4 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#241713] shadow-2xl">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="font-semibold text-white">Harrison</p>
                  <p className="text-sm text-gray-400">View your account</p>
                </div>

                <div className="py-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white"
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/profile?tab=library"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white"
                  >
                    Saved Dances
                  </Link>

                  <Link
                    href="/notifications"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white"
                  >
                    Notifications
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white"
                  >
                    Settings
                  </Link>
                </div>

                <div className="border-t border-white/10 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      console.log("Logout clicked");
                    }}
                    className="block w-full px-5 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}