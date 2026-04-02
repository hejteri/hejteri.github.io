import Link from "next/link";

import { GlassPanel } from "@/components/ui/glass-panel";
import {
  ArrowUpRightIcon,
  DiscordIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterIcon,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { socials } from "@/data/site";

const iconMap = {
  Discord: DiscordIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  "Twitter (X)": TwitterIcon,
};

export function SocialsSection() {
  return (
    <section className="container-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow="Our Socials"
          title="Stay close to the clan, even when you are off the server."
          description="Discord is the main place to join and stay active. The other socials are there for extra highlights and updates."
        />
      </Reveal>

      <div className="mt-8 grid gap-5 grid-cols-2 xl:grid-cols-4">
        {socials.map((social, index) => {
          const Icon = iconMap[social.title as keyof typeof iconMap];

          return (
            <Reveal key={social.title} delay={index * 80}>
              <Link href={social.href} target="_blank" rel="noreferrer" className="block h-full">
                <GlassPanel className="group h-full p-3 transition duration-500 hover:-translate-y-1 hover:border-white/16 sm:p-5 lg:p-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${social.tone} opacity-70 transition duration-500 group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <span className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white sm:size-11 sm:rounded-xl lg:size-12">
                      <Icon />
                    </span>
                    <div className="mt-4 flex items-start justify-between gap-2 sm:mt-8 sm:gap-3 lg:mt-10 lg:gap-4">
                      <div className="min-w-0">
                        <p className="font-display text-base tracking-[-0.04em] text-white sm:text-xl lg:text-2xl">
                          {social.title}
                        </p>
                        <p className="mt-1 line-clamp-3 max-w-xs text-[11px] leading-4 text-white/56 sm:mt-2 sm:text-sm sm:leading-6 lg:mt-3 lg:leading-7">
                          {social.caption}
                        </p>
                      </div>
                      <ArrowUpRightIcon className="mt-1 hidden shrink-0 text-white/70 sm:block" />
                    </div>
                  </div>
                </GlassPanel>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
