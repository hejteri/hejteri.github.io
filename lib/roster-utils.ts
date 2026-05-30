export type RosterGroupName = string;

export type StoredRosterClanIds = Record<number, string>;

export type StoredRosterEntry = {
  username?: string;
  standoffId?: string;
  clanIds?: Record<string, string>;
};

export type NormalizedRosterEntry = {
  username?: string;
  global?: string;
  clanIds: StoredRosterClanIds;
};

export function clanGroupName(clan: number) {
  return `Clan ${clan}`;
}

export function normalizeRosterKey(username?: string) {
  return (username ?? "").replace(/^@/, "").trim().toLowerCase();
}

function parseClanIdKey(key: string) {
  const clanNumber = Number.parseInt(key, 10);
  return Number.isInteger(clanNumber) && clanNumber > 0
    ? clanNumber
    : null;
}

function normalizeRosterEntry(candidate: string | StoredRosterEntry): NormalizedRosterEntry | null {
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    return trimmed
      ? {
          clanIds: {},
          global: trimmed,
        }
      : null;
  }

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return null;
  }

  const global = typeof candidate.standoffId === "string" && candidate.standoffId.trim()
    ? candidate.standoffId.trim()
    : undefined;

  const clanIds: StoredRosterClanIds = {};
  const rawClanIds = candidate.clanIds;

  if (rawClanIds && typeof rawClanIds === "object" && !Array.isArray(rawClanIds)) {
    for (const [key, value] of Object.entries(rawClanIds)) {
      if (typeof value !== "string") {
        continue;
      }

      const clanNumber = parseClanIdKey(key);
      const trimmed = value.trim();

      if (!clanNumber || !trimmed) {
        continue;
      }

      clanIds[clanNumber] = trimmed;
    }
  }

  return {
    username: typeof candidate.username === "string" && candidate.username.trim()
      ? candidate.username.trim()
      : undefined,
    global,
    clanIds,
  };
}

export function readRosterIndex(value?: string) {
  if (!value) {
    return {} as Record<string, NormalizedRosterEntry>;
  }

  try {
    const parsed = JSON.parse(value) as Record<string, string | StoredRosterEntry>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const rosterIndex: Record<string, NormalizedRosterEntry> = {};

    for (const [key, candidate] of Object.entries(parsed)) {
      const entry = normalizeRosterEntry(candidate);
      if (!entry) {
        continue;
      }

      const normalizedKey = normalizeRosterKey(entry.username || key);
      if (!normalizedKey) {
        continue;
      }

      rosterIndex[normalizedKey] = entry;
    }

    return rosterIndex;
  } catch {
    return {};
  }
}

export function resolveRosterStandoffId(
  rosterIndex: Record<string, NormalizedRosterEntry>,
  username?: string,
  clans: number[] = []
) {
  const entry = rosterIndex[normalizeRosterKey(username)];
  if (!entry) {
    return "-";
  }

  for (const clan of clans) {
    const clanSpecificId = entry.clanIds[clan];
    if (clanSpecificId) {
      return clanSpecificId;
    }
  }

  return entry.global ?? "-";
}

export function normalizeClanNumbers(value?: number | number[]) {
  const candidates = Array.isArray(value)
    ? value
    : typeof value === "number"
      ? [value]
      : [];

  return [...new Set(
    candidates.filter((clan) => Number.isInteger(clan) && clan > 0)
  )].sort((a, b) => a - b);
}

function parseClanGroupNumber(groupName: string) {
  const match = /^Clan\s+(\d+)$/i.exec(groupName);
  return match ? Number(match[1]) : null;
}

export function sortRosterGroupNames(groupNames: string[]) {
  return [...new Set(groupNames)].sort((left, right) => {
    const leftNumber = parseClanGroupNumber(left);
    const rightNumber = parseClanGroupNumber(right);

    if (leftNumber !== null && rightNumber !== null) {
      return leftNumber - rightNumber;
    }

    if (leftNumber !== null) {
      return -1;
    }

    if (rightNumber !== null) {
      return 1;
    }

    return left.localeCompare(right);
  });
}

export function createEmptyGroups<T>(groupNames: string[]) {
  const groups: Record<string, T[]> = {};

  for (const groupName of groupNames) {
    groups[groupName] = [];
  }

  return groups;
}

export function getAvailableGroups<T>(groups: Record<string, T[]>) {
  return sortRosterGroupNames(
    Object.keys(groups).filter((groupName) => groups[groupName].length > 0),
  );
}
