import Link from "next/link";

import { ArrowUpRightIcon, DiscordIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { clanInfo } from "@/data/site";

export function HeroSection() {
  return (
    <section className="container-shell pb-16 pt-10 lg:pb-24 lg:pt-16">
      <Reveal>
        <div id="home" className="max-w-4xl">
          <p className="eyebrow">EU Gaming Community</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.94] tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">
            ACTIVE SINCE 2018. STILL HERE. STILL STRONG.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
            Since 2018, HEJTERI has stayed active by keeping the balance right: competitive
            in-game, welcoming in the community. Standoff 2 is our main focus, with PUBG Mobile
            in the rotation.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="https://discord.gg/3jPu48B3pq"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.12]"
            >
              <DiscordIcon className="size-4" />
              Join Discord
            </Link>
            <Link
              href="/roster"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200/18 bg-sky-100/7 px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/26 hover:bg-sky-100/10"
            >
              View Roster
              <ArrowUpRightIcon />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
