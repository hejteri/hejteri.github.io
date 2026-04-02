import { AboutSection } from "@/components/sections/about-section";
import { GameVisualsSection } from "@/components/sections/game-visuals-section";
import { HeroSection } from "@/components/sections/hero-section";
import { SocialsSection } from "@/components/sections/socials-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TimelineSection } from "@/components/sections/timeline-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <GameVisualsSection />
      <AboutSection />
      <SocialsSection />
      <TimelineSection />
    </>
  );
}
