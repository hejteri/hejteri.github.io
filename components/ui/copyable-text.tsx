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
      className="group inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-left text-xs text-white/78 transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.08]"
      aria-label={`Copy ${label}`}
    >
      <span className="font-medium text-white/92">{value}</span>
    </button>
  );
}
