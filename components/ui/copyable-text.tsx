"use client";

import { useState } from "react";

import { copyToClipboard } from "@/lib/utils";

type CopyableTextProps = {
  value: string;
  label: string;
};

export function CopyableText({ value, label }: CopyableTextProps) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      await copyToClipboard(value);
    } catch {
    } finally {
      window.setTimeout(() => setIsCopying(false), 350);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group inline-flex max-w-full min-w-0 items-center rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-left text-[11px] text-white/78 transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.08] sm:px-3 sm:text-xs"
      aria-label={`Copy ${label}`}
    >
      <span className="truncate font-medium text-white/92">{value}</span>
    </button>
  );
}
