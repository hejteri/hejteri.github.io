"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SponsorBanner } from "@/components/layout/sponsor-banner";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isRosterListPage = pathname === "/roster/list";

  if (isRosterListPage) {
    return <main className="min-h-screen bg-[#060b14]">{children}</main>;
  }

  return (
    <>
      <div className="page-backdrop" />
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <SponsorBanner />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
