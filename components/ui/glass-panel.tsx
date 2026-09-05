import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GlassPanelProps = HTMLAttributes<HTMLDivElement>;

export function GlassPanel({ className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
