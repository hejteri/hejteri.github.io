import { latestClips as fallbackLatestClips } from "@/data/site";
import type { Member, RosterGroupName } from "@/data/roster";
import {
  fetchHejteriStorageRowFromGitHub,
  type HejteriStorageRow,
} from "@/lib/hejteri-data-source";
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

type VideoPayload = {
  link?: string;
  user?: {
    username?: string;
    tag?: string;
  };
  message?: {
    content?: string;
    createdAt?: string;
  };
};

export type LatestClipItem = {
  title: string;
  username: string;
  image: string;
  date: string;
  link?: string;
};

export type RosterGroupsResult = {
  groups: Record<RosterGroupName, Member[]>;
  availableGroups: RosterGroupName[];
};

const clipImages = [
  "/games/standoff-1.svg",
  "/games/standoff-2.svg",
  "/games/standoff-3.svg",
];

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

function fallbackClips(): LatestClipItem[] {
  return fallbackLatestClips.map((clip) => ({
    title: clip.title,
    username: clip.username,
    image: clip.image,
    date: clip.date,
  }));
}

function formatClipDate(value?: string) {
  if (!value) {
    return "Recent";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recent";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function deriveClipTitle(payload: VideoPayload) {
  const rawContent = payload.message?.content?.trim();
  const looksLikeOnlyLink = rawContent ? /^https?:\/\/\S+$/i.test(rawContent) : false;

  if (rawContent && !looksLikeOnlyLink) {
    return rawContent;
  }

  return "-";
}

function parseClipEntry(payload: VideoPayload, index: number, fallbackDate?: string): LatestClipItem {
  return {
    title: deriveClipTitle(payload),
    username: payload.user?.username ? `@${payload.user.username}` : "@hejteri",
    image: clipImages[index % clipImages.length],
    date: formatClipDate(payload.message?.createdAt ?? fallbackDate),
    link: payload.link,
  };
}

function fallbackRosterResult(): RosterGroupsResult {
  return {
    groups: {},
    availableGroups: [],
  };
}

export function getLatestClipsFromRow(row?: HejteriStorageRow | null): LatestClipItem[] {
  if (!row?.videos) {
    return fallbackClips();
  }

  try {
    const parsed = JSON.parse(row.videos) as VideoPayload[] | VideoPayload;

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 3).map((entry, index) => parseClipEntry(entry, index, row.$createdAt));
    }

    if (parsed && !Array.isArray(parsed) && typeof parsed === "object") {
      return [parseClipEntry(parsed, 0, row.$createdAt)];
    }
  } catch {
    return fallbackClips();
  }

  return fallbackClips();
}

export function getRosterGroupsFromRow(row?: HejteriStorageRow | null): RosterGroupsResult {
  if (!row?.data) {
    return fallbackRosterResult();
  }

  try {
    const parsed = JSON.parse(row.data) as StoredClanMember[];
    const rosterMap = readRosterMap(row.roster);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallbackRosterResult();
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
      return fallbackRosterResult();
    }

    return {
      groups,
      availableGroups,
    };
  } catch {
    return fallbackRosterResult();
  }
}

export function getDiscordMemberCountFromRow(row?: HejteriStorageRow | null) {
  return typeof row?.members === "number" ? row.members : null;
}

export function getClanMemberCountFromRow(row?: HejteriStorageRow | null) {
  if (!row?.data) {
    return null;
  }

  try {
    const parsed = JSON.parse(row.data) as StoredClanMember[];
    return Array.isArray(parsed) ? parsed.length : null;
  } catch {
    return null;
  }
}

export async function fetchHejteriStorageRowClient(): Promise<HejteriStorageRow | null> {
  return fetchHejteriStorageRowFromGitHub();
}
