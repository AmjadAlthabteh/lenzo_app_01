"use client";

import { useState } from "react";
import Link from "next/link";
import AuroraToggle from "./AuroraToggle";
import SearchButton from "./SearchButton";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="sm:hidden">
      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`h-0.5 w-5 bg-zinc-400 transition-transform ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-5 bg-zinc-400 transition-opacity ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-5 bg-zinc-400 transition-transform ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <nav className="fixed right-0 top-0 z-40 h-full w-64 border-l border-white/10 bg-black/95 backdrop-blur pt-20 px-6">
            <div className="flex flex-col gap-6">
              <Link
                href="#features"
                onClick={closeMenu}
                className="link-glow text-base text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#integrations"
                onClick={closeMenu}
                className="link-glow text-base text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Integrations
              </Link>
              <Link
                href="#cli"
                onClick={closeMenu}
                className="link-glow text-base text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Developer CLI
              </Link>
              <Link
                href="#ai"
                onClick={closeMenu}
                className="link-glow text-base text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                AI Tasks
              </Link>
              <Link
                href="#request"
                onClick={closeMenu}
                className="btn-neo rounded-full bg-white px-4 py-2.5 text-center text-sm font-medium text-black transition-colors hover:bg-white/90 luxin-glow"
              >
                Request Access
              </Link>

              {/* Mobile search and aurora toggle */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <SearchButton />
                <AuroraToggle />
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
