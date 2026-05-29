export type RosterGroupName = string;

export function clanGroupName(clan: number) {
  return `Clan ${clan}`;
}

export function normalizeRosterKey(username?: string) {
  return (username ?? "").replace(/^@/, "").trim().toLowerCase();
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
