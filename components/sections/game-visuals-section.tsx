"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { GlassPanel } from "@/components/ui/glass-panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { latestClips as fallbackLatestClips } from "@/data/site";
import { fetchHejteriStorageRowClient, getLatestClipsFromRow, type LatestClipItem } from "@/lib/hejteri-live";

const initialClips: LatestClipItem[] = fallbackLatestClips.map((clip) => ({
  title: clip.title,
  username: clip.username,
  image: clip.image,
  date: clip.date,
}));

export function GameVisualsSection() {
  const [latestClips, setLatestClips] = useState<LatestClipItem[]>(initialClips);

  useEffect(() => {
    let cancelled = false;

    void fetchHejteriStorageRowClient().then((row) => {
      if (cancelled || !row) {
        return;
      }

      setLatestClips(getLatestClipsFromRow(row));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow="Latest Clips"
          title="Recent highlights shared in the Discord."
          description="Recent moments from the clan, showing clips shared by members and the kind of highlights the community keeps posting."
        />
      </Reveal>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {latestClips.map((clip, index) => (
          <Reveal key={`${clip.username}-${clip.title}`} delay={index * 90}>
            <GlassPanel className="group h-full overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                {clip.link ? (
                  <video
                    src={clip.link}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={clip.image}
                    alt={clip.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 to-transparent" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.26em] text-white/38">{clip.username}</p>
                <p className="mt-3 truncate font-display text-2xl tracking-[-0.04em] text-white">
                  {clip.title}
                </p>
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
