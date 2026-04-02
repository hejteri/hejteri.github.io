import { GlassPanel } from "@/components/ui/glass-panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clanInfo, timeline } from "@/data/site";

export const metadata = {
  title: "About | HEJTERI Clan",
};

const pillars = [
  "A calm tone across the community",
  "Regular sessions without turning the community into a grind",
  "Competitive intent with room for people to develop over time",
];

export default function AboutPage() {
  return (
    <div className="container-shell section-space space-y-8">
      <Reveal>
        <SectionHeading
          eyebrow="About The Clan"
          title={`Built in ${clanInfo.founded}, still active today, and still centered on people first.`}
          description="HEJTERI is designed to feel established without feeling closed off. The site reflects that with a premium dark aesthetic, restrained motion, and a structure that feels modern without becoming noisy."
        />
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal delay={60}>
          <GlassPanel className="p-7">
            <p className="font-display text-2xl tracking-[-0.04em] text-white">How the clan plays</p>
            <p className="mt-4 text-sm leading-8 text-white/58">
              The community started around {clanInfo.mainGame}, but its staying power came from culture.
              Players are expected to communicate clearly, keep the energy friendly, and understand that
              consistent teamwork matters more than random highlight moments.
            </p>
            <p className="mt-4 text-sm leading-8 text-white/58">
              That balance between welcoming and competitive is what gives HEJTERI its identity. Members can
              jump in casually, but when the clan stacks a room, everyone knows how to tighten things up.
            </p>
          </GlassPanel>
        </Reveal>

        <Reveal delay={120}>
          <GlassPanel className="p-7">
            <p className="font-display text-2xl tracking-[-0.04em] text-white">Core pillars</p>
            <div className="mt-5 space-y-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/68"
                >
                  {pillar}
                </div>
              ))}
            </div>
          </GlassPanel>
        </Reveal>
      </div>

      <div className="space-y-4">
        {timeline.map((item, index) => (
          <Reveal key={item.title} delay={index * 50}>
            <GlassPanel className="grid gap-4 p-6 lg:grid-cols-[120px_1fr]">
              <p className="text-sm uppercase tracking-[0.28em] text-sky-100/70">{item.year}</p>
              <div>
                <p className="font-display text-2xl tracking-[-0.04em] text-white">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/56">{item.description}</p>
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
