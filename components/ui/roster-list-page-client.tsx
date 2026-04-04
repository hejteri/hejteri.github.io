"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { RosterListTable } from "@/components/ui/roster-list-table";
import { fetchHejteriStorageRowClient, getRosterGroupsFromRow, type RosterGroupsResult } from "@/lib/hejteri-live";

const fallbackRoster = getRosterGroupsFromRow(null);

export function RosterListPageClient() {
  const [roster, setRoster] = useState<RosterGroupsResult>(fallbackRoster);

  useEffect(() => {
    let cancelled = false;

    void fetchHejteriStorageRowClient().then((row) => {
      if (cancelled || !row) {
        return;
      }

      setRoster(getRosterGroupsFromRow(row));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/roster"
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/68 transition duration-300 hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
        >
          Return
        </Link>
      </div>

      <RosterListTable groups={roster.groups} availableGroups={roster.availableGroups} />
    </div>
  );
}
