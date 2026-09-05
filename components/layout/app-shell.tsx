"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

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
      <div className="relative min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
