import Link from "next/link";

import { GlassPanel } from "@/components/ui/glass-panel";
import { DiscordIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { joinRequirements } from "@/data/site";

export function JoinSection() {
  return (
    <section className="container-shell section-space" id="join">
      <Reveal>
        <SectionHeading
          eyebrow="Join HEJTERI"
          title="Competitive enough to improve. Welcoming enough to stay."
          description="Players who fit best here are active, respectful, and comfortable working inside a team structure. If that sounds like your lane, the Discord door is open."
        />
      </Reveal>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <GlassPanel className="p-7">
            <div className="grid gap-4 sm:grid-cols-3">
              {joinRequirements.map((requirement) => (
                <div
                  key={requirement.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                >
                  <p className="font-display text-xl tracking-[-0.04em] text-white">
                    {requirement.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/56">{requirement.description}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </Reveal>

        <Reveal delay={100}>
          <GlassPanel className="overflow-hidden p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(186,230,253,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0))]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Ready to queue up?</p>
              <p className="mt-4 font-display text-3xl tracking-[-0.05em] text-white">
                Meet the clan first, then find your place in the lineup.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/56">
                We use placeholder links for now, but the call-to-action and join flow are fully set up
                in the UI.
              </p>
              <Link
                href="https://discord.com/invite/example"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-5 py-3 text-sm text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.12]"
              >
                <DiscordIcon className="size-4" />
                Join Discord
              </Link>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
