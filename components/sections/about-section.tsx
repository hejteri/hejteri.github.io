import { GlassPanel } from "@/components/ui/glass-panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clanInfo } from "@/data/site";

const values = [
  {
    title: "Welcoming from the start",
    description:
      "New members can settle in quickly, join in without friction, and feel part of the community early on.",
  },
  {
    title: "Here to stay",
    description:
      "Active since 2018, HEJTERI has grown by staying consistent, welcoming, and low-drama.",
  },
];

export function AboutSection() {
  return (
    <section className="container-shell section-space" id="about">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionHeading
            eyebrow="About HEJTERI"
            title="A clan that values calm energy, consistent activity, and clean teamwork."
            description={`${clanInfo.name} started in ${clanInfo.founded} and kept growing by staying reliable. We play hard when it matters, but the community stays welcoming, low-drama, and easy to return to every week.`}
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 90}>
              <GlassPanel className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-white/16">
                <p className="font-display text-xl tracking-[-0.03em] text-white">{value.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/56">{value.description}</p>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
