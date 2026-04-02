import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { RosterTabs } from "@/components/ui/roster-tabs";
import { getRosterGroups } from "@/lib/roster-data";

export const metadata = {
  title: "Roster | HEJTERI Clan",
};

export default async function RosterPage() {
  const { groups, availableGroups } = await getRosterGroups();

  return (
    <div className="container-shell section-space">
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">So2 Roster</p>
            <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">
              Browse the roster and see who is part of each clan.
            </p>
          </div>
          <Link
            href="/roster/list"
            className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/68 transition duration-300 hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
          >
            Switch to list
          </Link>
        </div>
      </Reveal>

      <Reveal delay={140} className="mt-10">
        <RosterTabs groups={groups} availableGroups={availableGroups} />
      </Reveal>
    </div>
  );
}
