"use client";

import { useEffect, useState } from "react";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { communityStats } from "@/data/site";
import {
  fetchHejteriStorageRowClient,
  getClanMemberCountFromRow,
  getDiscordMemberCountFromRow,
} from "@/lib/hejteri-live";

export function StatsSection() {
  const [discordMemberCount, setDiscordMemberCount] = useState<number | null>(null);
  const [clanMemberCount, setClanMemberCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetchHejteriStorageRowClient().then((row) => {
      if (cancelled || !row) {
        return;
      }

      setDiscordMemberCount(getDiscordMemberCountFromRow(row));
      setClanMemberCount(getClanMemberCountFromRow(row));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = communityStats.map((stat) => {
    if (stat.label === "Discord members" && discordMemberCount !== null) {
      return {
        ...stat,
        value: discordMemberCount,
      };
    }

    if (stat.label === "Clan members" && clanMemberCount !== null) {
      return {
        ...stat,
        value: clanMemberCount,
      };
    }

    return stat;
  });

  return (
    <section className="container-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow="Community Info"
          title="A clan that stays active without losing its structure."
          description="A simple overview of the clan's community presence and current status."
        />
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 80}>
            <GlassPanel className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-white/16">
              <p className="text-xs uppercase tracking-[0.28em] text-white/35">{stat.label}</p>
              <p className="mt-4 font-display text-4xl tracking-[-0.05em] text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-sm leading-6 text-white/52">{stat.description}</p>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
