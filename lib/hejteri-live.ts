import type { Member, RosterGroupName } from "@/data/roster";
import {
  fetchHejteriStorageRowFromGitHub,
  fetchRosterTextFromGitHub,
  type HejteriStorageRow,
} from "@/lib/hejteri-data-source";
import {
  clanGroupName,
  createEmptyGroups,
  getAvailableGroups,
  readCompactRosterMembers,
  sortRosterGroupNames,
} from "@/lib/roster-utils";

export type RosterGroupsResult = {
  groups: Record<RosterGroupName, Member[]>;
  availableGroups: RosterGroupName[];
};

export type LatestClipItem = {
  title: string;
  username: string;
  image: string;
  date: string;
  link?: string;
};

export function getLatestClipsFromRow(_row?: HejteriStorageRow | null): LatestClipItem[] {
  return [];
}

function normalizeUsername(username?: string) {
  if (!username) {
    return "@hejteri";
  }

  return username.startsWith("@") ? username : `@${username}`;
}

function normalizeDisplayName(displayName?: string, username?: string) {
  if (displayName?.trim()) {
    return displayName.trim();
  }

  const normalizedUsername = normalizeUsername(username);
  return normalizedUsername.startsWith("@") ? normalizedUsername.slice(1) : normalizedUsername;
}

function fallbackRosterResult(): RosterGroupsResult {
  return {
    groups: {},
    availableGroups: [],
  };
}

export function getRosterGroupsFromRow(row?: HejteriStorageRow | null): RosterGroupsResult {
  if (!row) {
    return fallbackRosterResult();
  }

  const compactMembers = readCompactRosterMembers(row.roster);
  if (compactMembers.length > 0) {
    const groups = createEmptyGroups<Member>([]);

    for (const entry of compactMembers) {
      for (const membership of entry.clans) {
        const groupName = clanGroupName(membership.clan);
        if (!groups[groupName]) {
          groups[groupName] = [];
        }

        groups[groupName].push({
          displayName: entry.displayName,
          username: normalizeUsername(entry.username),
          standoffId: membership.standoffId,
          role: entry.role,
        });
      }
    }

    const availableGroups = sortRosterGroupNames(getAvailableGroups(groups));
    if (availableGroups.length > 0) {
      return { groups, availableGroups };
    }
  }

  return fallbackRosterResult();
}

export function getDiscordMemberCountFromRow(row?: HejteriStorageRow | null) {
  return typeof row?.members === "number" ? row.members : null;
}

export function getClanMemberCountFromRow(row?: HejteriStorageRow | null) {
  if (!row?.roster) {
    return null;
  }

  const members = readCompactRosterMembers(row.roster);
  return members.length > 0 ? members.length : null;
}

export async function fetchHejteriStorageRowClient(): Promise<HejteriStorageRow | null> {
  return fetchHejteriStorageRowFromGitHub();
}

export async function fetchRosterGroupsClient(): Promise<RosterGroupsResult> {
  const roster = await fetchRosterTextFromGitHub();
  return getRosterGroupsFromRow({
    $createdAt: new Date().toISOString(),
    roster: roster ?? undefined,
  });
}
