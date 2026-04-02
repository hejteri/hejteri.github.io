"use client";

import { useDeferredValue, useEffect, useState } from "react";

import { CopyableText } from "@/components/ui/copyable-text";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { Member, RosterGroupName } from "@/data/roster";
import { memberRoleColors } from "@/data/roster";
import { cn } from "@/lib/utils";

type RosterTabsProps = {
  groups: Record<RosterGroupName, Member[]>;
  availableGroups: RosterGroupName[];
};

type ActiveRosterGroup = "All" | RosterGroupName;

function getMobileDisplayName(displayName: string) {
  return displayName.replace(/^(?:\[[^\]]+\]\s*)+/, "").trim() || displayName;
}

function getDisplayRole(member: Member): { label: string; color: string } | null {
  if (!member.role) {
    return null;
  }

  return {
    label: member.role,
    color: memberRoleColors[member.role] ?? "#94a3b8",
  };
}

export function RosterTabs({ groups, availableGroups }: RosterTabsProps) {
  const [activeGroup, setActiveGroup] = useState<ActiveRosterGroup>(availableGroups[0] ?? "All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [revealedUsernames, setRevealedUsernames] = useState<Record<string, boolean>>({});
  const deferredSearch = useDeferredValue(search);
  const pageSize = 30;
  const tabOrder: ActiveRosterGroup[] = ["All", ...availableGroups];
  const activeMembers =
    activeGroup === "All"
      ? availableGroups.flatMap((group) =>
          groups[group].map((member) => ({
            member,
            group,
          })),
        )
      : groups[activeGroup].map((member) => ({
          member,
          group: activeGroup,
        }));
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredMembers = activeMembers.filter(({ member }) => {
    if (!normalizedSearch) {
      return true;
    }

    return (
      member.displayName.toLowerCase().includes(normalizedSearch) ||
      member.username.toLowerCase().includes(normalizedSearch) ||
      member.standoffId.toLowerCase().includes(normalizedSearch)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [activeGroup, deferredSearch]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {tabOrder.map((group) => {
          const active = group === activeGroup;

          return (
            <button
              key={group}
              type="button"
              onClick={() => setActiveGroup(group)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition duration-300 sm:px-4 sm:py-2 sm:text-sm",
                active
                  ? "border-sky-200/30 bg-sky-200/12 text-white"
                  : "border-white/10 bg-white/[0.04] text-white/58 hover:border-white/18 hover:bg-white/[0.07] hover:text-white/88",
              )}
            >
              {group}
            </button>
          );
        })}
      </div>

      <div className="max-w-md">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search username or So2 ID"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/18 focus:bg-white/[0.06] sm:px-4 sm:py-3 sm:text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/46 sm:text-sm">
        <p>
          Showing {paginatedMembers.length ? (currentPage - 1) * pageSize + 1 : 0}-
          {Math.min(currentPage * pageSize, filteredMembers.length)} of {filteredMembers.length}
        </p>
        {filteredMembers.length > pageSize ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 transition duration-300 hover:border-white/18 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-35 sm:px-3 sm:py-2"
            >
              Prev
            </button>
            <span className="px-2 text-white/52">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 transition duration-300 hover:border-white/18 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-35 sm:px-3 sm:py-2"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      <GlassPanel className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(19,27,49,0.74),rgba(8,12,22,0.9))]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.03] text-left">
                <th className="px-2 py-3 text-[10px] uppercase tracking-[0.16em] text-white/36 sm:px-5 sm:py-4 sm:text-xs sm:tracking-[0.24em]">#</th>
                <th className="px-2 py-3 text-[10px] uppercase tracking-[0.16em] text-white/36 sm:px-5 sm:py-4 sm:text-xs sm:tracking-[0.24em]">Discord</th>
                <th className="px-2 py-3 text-[10px] uppercase tracking-[0.16em] text-white/36 sm:px-5 sm:py-4 sm:text-xs sm:tracking-[0.24em]">So2 ID</th>
                <th className="px-2 py-3 text-[10px] uppercase tracking-[0.16em] text-white/36 sm:px-5 sm:py-4 sm:text-xs sm:tracking-[0.24em]">Role</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map(({ member, group }, index) => (
                <tr
                  key={`${group}-${member.username}`}
                  className="border-b border-white/6 transition duration-300 hover:bg-white/[0.03]"
                >
                  <td className="px-2 py-3 text-xs text-white/40 sm:px-5 sm:py-4 sm:text-sm">
                    {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="px-2 py-3 sm:px-5 sm:py-4">
                    {(() => {
                      const rowKey = `${group}-${member.username}`;
                      const isRevealed = revealedUsernames[rowKey];

                      return (
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedUsernames((current) => ({
                              ...current,
                              [rowKey]: !current[rowKey],
                            }))
                          }
                          className="group inline-flex max-w-[120px] items-center rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-left text-[11px] text-white/78 transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.08] sm:max-w-none sm:px-3 sm:text-xs"
                          aria-label={isRevealed ? "Show display name" : "Reveal Discord username"}
                        >
                          <span className="truncate font-medium text-white/92">
                            {isRevealed ? (
                              member.username
                            ) : (
                              <>
                                <span className="sm:hidden">{getMobileDisplayName(member.displayName)}</span>
                                <span className="hidden sm:inline">{member.displayName}</span>
                              </>
                            )}
                          </span>
                        </button>
                      );
                    })()}
                  </td>
                  <td className="px-2 py-3 sm:px-5 sm:py-4">
                    <CopyableText label="So2 ID" value={member.standoffId} />
                  </td>
                  <td className="px-2 py-3 sm:px-5 sm:py-4">
                    {(() => {
                      const displayRole = getDisplayRole(member);

                      if (!displayRole) {
                        return <span className="text-xs text-white/22 sm:text-sm">-</span>;
                      }

                      return (
                        <span
                          className="inline-flex max-w-[94px] truncate rounded-full border px-2 py-1 text-[11px] sm:max-w-none sm:px-3 sm:text-xs"
                          style={{
                            color: displayRole.color,
                            backgroundColor: `${displayRole.color}1a`,
                            borderColor: `${displayRole.color}4d`,
                          }}
                        >
                          {displayRole.label}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              ))}
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-white/46 sm:px-5 sm:text-sm">
                    No roster members match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
