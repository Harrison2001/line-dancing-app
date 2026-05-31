"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Discover", href: "/discover", icon: "🔎" },
  { label: "Events", href: "/events", icon: "📅" },
  { label: "Friends", href: "/friends", icon: "👥" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="bottom-mobile-nav fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#130c08] shadow-2xl">
      <div className="mx-auto flex h-20 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2 text-[11px] font-semibold transition-all ${
                isActive
                  ? "bg-orange-500 text-black"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              <span className="text-xl">{item.icon}</span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}