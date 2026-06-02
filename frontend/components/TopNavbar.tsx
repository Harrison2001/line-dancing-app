"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Discover", href: "/discover" },
  { label: "Events", href: "/events" },
  { label: "Friends", href: "/friends" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden w-full border-b border-white/10 bg-[#1b120f] md:block">
      <div className="flex h-20 items-center justify-between px-12">
        <Link href="/home" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl">
            ✨
          </div>

          <span className="text-3xl font-bold text-white">
            LineDance
          </span>
        </Link>

        <div className="flex items-center mr-10">
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

          <Link
            href="/profile"
            className={`ml-16 flex h-10 w-10 items-center justify-center rounded-full font-bold transition ${
              pathname.startsWith("/profile")
                ? "bg-orange-400 text-black"
                : "bg-orange-500 text-black hover:bg-orange-400"
            }`}
          >
            H
          </Link>
        </div>
      </div>
    </header>
  );
}