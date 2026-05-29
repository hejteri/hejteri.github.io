import "server-only";

import { getHejteriStorageRow } from "@/lib/hejteri-storage";
import type { Member, RosterGroupName } from "@/data/roster";
import {
  clanGroupName,
  createEmptyGroups,
  getAvailableGroups,
  normalizeClanNumbers,
  normalizeRosterKey,
  sortRosterGroupNames,
} from "@/lib/roster-utils";

type StoredClanMember = {
  username?: string;
  displayName?: string;
  role?: string | null;
  clan?: number;
  clans?: number[];
};

type StoredRosterEntry = {
  username?: string;
  standoffId?: string;
};

function readRosterMap(value?: string) {
  if (!value) {
    return {} as Record<string, string>;
  }

  try {
    const parsed = JSON.parse(value) as Record<string, string | StoredRosterEntry>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const rosterMap: Record<string, string> = {};

    for (const [key, candidate] of Object.entries(parsed)) {
      if (typeof candidate === "string" && candidate.trim()) {
        rosterMap[normalizeRosterKey(key)] = candidate.trim();
        continue;
      }

      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
        continue;
      }

      if (typeof candidate.standoffId !== "string" || !candidate.standoffId.trim()) {
        continue;
      }

      const usernameKey = normalizeRosterKey(candidate.username || key);
      if (!usernameKey) {
        continue;
      }

      rosterMap[usernameKey] = candidate.standoffId.trim();
    }

    return rosterMap;
  } catch {
    return {};
  }
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
  if (!row?.data) {
    return fallbackResult();
  }

  try {
    const parsed = JSON.parse(row.data) as StoredClanMember[];
    const rosterMap = readRosterMap(row.roster);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallbackResult();
    }

    const groups = createEmptyGroups<Member>([]);

    for (const entry of parsed) {
      const clans = getMemberClans(entry);
      if (!clans.length) {
        continue;
      }

      const member = {
        displayName: normalizeDisplayName(entry.displayName, entry.username),
        username: normalizeUsername(entry.username),
        standoffId: rosterMap[normalizeRosterKey(entry.username)] ?? "-",
        role: entry.role ?? null,
      };

      for (const clan of clans) {
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
