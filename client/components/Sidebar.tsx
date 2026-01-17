"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/cloud-run", label: "Cloud Run Demo" },
    { href: "/cloud-functions", label: "Cloud Functions Demo" },
    { href: "/cloud-storage", label: "Cloud Storage Demo" },
  ];

  // Normalize pathname by removing trailing slash
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">GCP Learning</h2>
        <p className="text-sm text-zinc-400 mt-1">Project Demo</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = normalizedPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "px-4 py-3 rounded-lg transition-colors bg-blue-600 text-white font-medium"
                  : "px-4 py-3 rounded-lg transition-colors text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
