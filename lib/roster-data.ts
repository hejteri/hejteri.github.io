import "server-only";

import { getHejteriStorageRow } from "@/lib/hejteri-storage";
import type { Member, RosterGroupName } from "@/data/roster";
import {
  clanGroupName,
  createEmptyGroups,
  getAvailableGroups,
  normalizeClanNumbers,
  readCompactRosterMembers,
  sortRosterGroupNames,
  readRosterIndex,
  resolveRosterStandoffId,
} from "@/lib/roster-utils";

type StoredClanMember = {
  username?: string;
  displayName?: string;
  role?: string | null;
  clan?: number;
  clans?: number[];
};

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

function getMemberClans(entry: StoredClanMember) {
  return normalizeClanNumbers(entry.clans ?? entry.clan);
}

export type RosterGroupsResult = {
  groups: Record<RosterGroupName, Member[]>;
  availableGroups: RosterGroupName[];
};

function fallbackResult(): RosterGroupsResult {
  return {
    groups: {},
    availableGroups: [],
  };
}

export async function getRosterGroups(): Promise<RosterGroupsResult> {
  const row = await getHejteriStorageRow();
  if (!row) {
    return fallbackResult();
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

  if (!row.data) {
    return fallbackResult();
  }

  try {
    const parsed = JSON.parse(row.data) as StoredClanMember[];
    const rosterIndex = readRosterIndex(row.roster);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallbackResult();
    }

    const groups = createEmptyGroups<Member>([]);

    for (const entry of parsed) {
      const clans = getMemberClans(entry);
      if (!clans.length) {
        continue;
      }

      for (const clan of clans) {
        const member = {
          displayName: normalizeDisplayName(entry.displayName, entry.username),
          username: normalizeUsername(entry.username),
          standoffId: resolveRosterStandoffId(rosterIndex, entry.username, [clan]),
          role: entry.role ?? null,
        };

        const groupName = clanGroupName(clan);
        if (!groups[groupName]) {
          groups[groupName] = [];
        }

        groups[groupName].push(member);
      }
    }

    const availableGroups = sortRosterGroupNames(getAvailableGroups(groups));
    if (!availableGroups.length) {
      return fallbackResult();
    }

    return {
      groups,
      availableGroups,
    };
  } catch {
    return fallbackResult();
  }
}
