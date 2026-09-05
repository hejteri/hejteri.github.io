import { GlassPanel } from "@/components/ui/glass-panel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { timeline } from "@/data/site";

export function TimelineSection() {
  return (
    <section className="container-shell section-space">
      <Reveal>
        <SectionHeading
          eyebrow="Since 2018"
          title="The story of how HEJTERI kept growing."
          description="Each step in the timeline marks a new part of the organization’s expansion across different games and years."
        />
      </Reveal>

      <div className="mt-10 space-y-4">
        {timeline.map((item, index) => (
          <Reveal key={`${item.year}-${item.title}`} delay={index * 60}>
            <GlassPanel className="grid gap-4 p-6 lg:grid-cols-[150px_1fr] lg:items-start">
              <div className="text-sm uppercase tracking-[0.28em] text-sky-100/70">{item.year}</div>
              <div className="border-l border-white/8 pl-5">
                <p className="font-display text-2xl tracking-[-0.04em] text-white">{item.title}</p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58">{item.description}</p>
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
