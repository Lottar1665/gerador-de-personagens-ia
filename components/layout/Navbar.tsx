"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../../lib/theme-context";

const links = [
  { href: "/", label: "Início" },
  { href: "/dashboard", label: "Gerador" },
  { href: "/community", label: "Comunidade" },
  { href: "/user", label: "Minha Área" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-fc-bg2 border-b border-fc h-[60px] flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-7 h-7 bg-fc-green rounded-md flex items-center justify-center text-black text-xs font-black">
          FC
        </div>
        <span className="text-fc-text font-bold text-[17px] hidden sm:block">
          FaceCreate
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${active ? "nav-link-active" : ""}`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          const icons: Record<string, string> = {
            "/": "🏠",
            "/dashboard": "⚽",
            "/community": "👥",
            "/user": "👤",
          };
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link text-base px-2.5 ${active ? "nav-link-active" : ""}`}
              title={label}
            >
              {icons[href]}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full border border-fc2 bg-fc-bg3 flex items-center justify-center text-fc-text hover:border-fc-green hover:text-fc-green transition-all duration-200 cursor-pointer"
          title="Alternar tema"
          aria-label="Alternar entre modo claro e escuro"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {/* Avatar */}
        <Link
          href="/user"
          className="w-9 h-9 rounded-full bg-fc-green-dim border-2 border-fc-green flex items-center justify-center text-xs font-bold text-fc-green hover:opacity-90 transition-opacity"
          title="Minha Área"
        >
          LA
        </Link>
      </div>
    </nav>
  );
}
