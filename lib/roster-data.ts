import "server-only";

import { getHejteriStorageRow } from "@/lib/hejteri-storage";
import { rosterGroups as fallbackRosterGroups, type Member, type RosterGroupName } from "@/data/roster";

type StoredClanMember = {
  username?: string;
  displayName?: string;
  role?: string | null;
  clan?: number;
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

function normalizeRosterKey(username?: string) {
  return (username ?? "").replace(/^@/, "").trim().toLowerCase();
}

const rosterGroupNames: RosterGroupName[] = ["Clan 1", "Clan 2", "Clan 3", "Clan 4", "Clan 5"];

export type RosterGroupsResult = {
  groups: Record<RosterGroupName, Member[]>;
  availableGroups: RosterGroupName[];
};

function emptyRosterGroups(): Record<RosterGroupName, Member[]> {
  return {
    "Clan 1": [],
    "Clan 2": [],
    "Clan 3": [],
    "Clan 4": [],
    "Clan 5": [],
  };
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

function getAvailableGroups(groups: Record<RosterGroupName, Member[]>) {
  return rosterGroupNames.filter((groupName) => groups[groupName].length > 0);
}

function fallbackResult(): RosterGroupsResult {
  return {
    groups: fallbackRosterGroups,
    availableGroups: getAvailableGroups(fallbackRosterGroups),
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

    const groups = emptyRosterGroups();

    for (const entry of parsed) {
      const clan = entry.clan;
      if (!clan || clan < 1 || clan > 5) {
        continue;
      }

      const groupName = `Clan ${clan}` as RosterGroupName;

      groups[groupName].push({
        displayName: normalizeDisplayName(entry.displayName, entry.username),
        username: normalizeUsername(entry.username),
        standoffId: rosterMap[normalizeRosterKey(entry.username)] ?? "-",
        role: entry.role ?? null,
      });
    }

    const availableGroups = getAvailableGroups(groups);
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
