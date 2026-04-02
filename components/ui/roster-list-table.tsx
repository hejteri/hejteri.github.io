"use client";

import { useDeferredValue, useState } from "react";

import type { Member, RosterGroupName } from "@/data/roster";

type RosterListTableProps = {
  groups: Record<RosterGroupName, Member[]>;
  availableGroups: RosterGroupName[];
};

export function RosterListTable({ groups, availableGroups }: RosterListTableProps) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const query = deferredSearch.trim().toLowerCase();

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search user or So2 ID"
          className="w-full rounded-xl border border-white/10 bg-[#0a101b] px-4 py-3 text-sm text-white outline-none placeholder:text-white/32"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a101b]">
        <table className="min-w-full border-collapse text-sm text-white/86">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-left">
              <th className="px-4 py-3 font-medium text-white/54">Clan</th>
              <th className="px-4 py-3 font-medium text-white/54">User</th>
              <th className="px-4 py-3 font-medium text-white/54">So2 ID</th>
            </tr>
          </thead>
          <tbody>
            {availableGroups.map((group) =>
              groups[group]
                .filter((member) => {
                  if (!query) {
                    return true;
                  }

                  return (
                    member.displayName.toLowerCase().includes(query) ||
                    member.username.toLowerCase().includes(query) ||
                    member.standoffId.toLowerCase().includes(query)
                  );
                })
                .map((member, index) => (
                  <tr
                    key={`${group}-${member.username}`}
                    className="border-b border-white/8 last:border-b-0"
                  >
                    <td className="px-4 py-3 text-white/92">{index === 0 ? group : ""}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span>{member.displayName}</span>
                        <span className="text-xs text-white/38">{member.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/76">{member.standoffId}</td>
                  </tr>
                )),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
