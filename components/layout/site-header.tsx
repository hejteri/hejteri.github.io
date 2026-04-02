"use client";

import Link from "next/link";
import { useState } from "react";

import { CloseIcon, DiscordIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Roster", href: "/roster" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-slate-950/55 backdrop-blur-2xl">
      <div className="container-shell flex min-h-18 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-11 w-[3px] rounded-full bg-white/70"
          >
          </span>
          <div>
            <p className="font-display text-sm tracking-[0.20em] text-white">HEJTERI</p>
            <p className="text-xs uppercase tracking-[0.26em] text-white/40">EU Clan Since 2018</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-white/60 transition duration-300 hover:bg-white/[0.04] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="https://discord.com/invite/example"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.1]"
          >
            <DiscordIcon className="size-4" />
            Join Discord
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/6 transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container-shell flex flex-col gap-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/78"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="https://discord.com/invite/example"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white"
          >
            <DiscordIcon className="size-4" />
            Join Discord
          </Link>
        </div>
      </div>
    </header>
  );
}
