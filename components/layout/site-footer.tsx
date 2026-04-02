import Link from "next/link";

import { clanInfo } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/6 py-8">
      <div className="container-shell flex flex-col gap-4 text-sm text-white/46 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display tracking-[0.3em] text-white">HEJTERI</p>
          <p className="mt-1">
            {clanInfo.region}-based gaming clan. Active from {clanInfo.founded} to present.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/#about" className="transition hover:text-white/80">
            About
          </Link>
          <Link href="/roster" className="transition hover:text-white/80">
            Roster
          </Link>
        </div>
      </div>
    </footer>
  );
}
