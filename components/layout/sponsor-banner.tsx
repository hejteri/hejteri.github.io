export function SponsorBanner() {
  return (
    <a
      href="https://ggstandoff.skin/hejt"
      target="_blank"
      rel="noreferrer"
      className="group block border-b border-[#e54854]/20 bg-[linear-gradient(105deg,#271821_0%,#4a1f2e_48%,#24151e_100%)]"
      aria-label="Visit GGSTANDOFF and use promo code HEJT"
    >
      <div className="overflow-hidden py-2 sm:py-2.5">
        <div className="sponsor-marquee flex w-max whitespace-nowrap text-xs text-white/80 sm:text-sm">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center gap-12 px-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index}><span className="font-semibold uppercase tracking-[0.2em] text-[#ffb0ae]/70">GGSTANDOFF</span><span className="mx-3 text-[#ff8580]/45">•</span>Use promo code <span className="font-bold tracking-[0.12em] text-white">HEJT</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}
