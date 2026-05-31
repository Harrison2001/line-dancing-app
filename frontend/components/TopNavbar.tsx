"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Events", href: "/events" },
  { label: "Friends", href: "/friends" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden md:block w-full border-b border-white/10 bg-[#1b120f]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl">
            ✨
          </div>

          <span className="text-3xl font-bold text-white">LineDance</span>
        </Link>

        <nav className="flex items-center gap-10">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

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
      </div>
    </header>
  );
}