import { latestClips as fallbackLatestClips } from "@/data/site";
import {
  rosterGroups as fallbackRosterGroups,
  rosterOrder,
  type Member,
  type RosterGroupName,
} from "@/data/roster";

export type HejteriStorageRow = {
  $createdAt?: string;
  videos?: string;
  data?: string;
  members?: number;
  roster?: string;
};

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

type AppwriteVideoPayload = {
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

const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectId = "69715289000d21d6e815";
const databaseId = "6974983c002379eba07f";
const tableId = "hejteri";
const rowId = "69caf74100066b2d85df";

const clipImages = [
  "/games/standoff-1.svg",
  "/games/standoff-2.svg",
  "/games/standoff-3.svg",
];

function normalizeRosterKey(username?: string) {
  return (username ?? "").replace(/^@/, "").trim().toLowerCase();
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

function emptyRosterGroups(): Record<RosterGroupName, Member[]> {
  return {
    "Clan 1": [],
    "Clan 2": [],
    "Clan 3": [],
    "Clan 4": [],
    "Clan 5": [],
  };
}

function getAvailableGroups(groups: Record<RosterGroupName, Member[]>) {
  return rosterOrder.filter((groupName) => groups[groupName].length > 0);
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

function deriveClipTitle(payload: AppwriteVideoPayload) {
  const rawContent = payload.message?.content?.trim();
  const looksLikeOnlyLink = rawContent ? /^https?:\/\/\S+$/i.test(rawContent) : false;

  if (rawContent && !looksLikeOnlyLink) {
    return rawContent;
  }

  return "-";
}

function parseClipEntry(payload: AppwriteVideoPayload, index: number, fallbackDate?: string): LatestClipItem {
  return {
    title: deriveClipTitle(payload),
    username: payload.user?.username ? `@${payload.user.username}` : "@hejteri",
    image: clipImages[index % clipImages.length],
    date: formatClipDate(payload.message?.createdAt ?? fallbackDate),
    link: payload.link,
  };
}

export function getLatestClipsFromRow(row?: HejteriStorageRow | null): LatestClipItem[] {
  if (!row?.videos) {
    return fallbackClips();
  }

  try {
    const parsed = JSON.parse(row.videos) as AppwriteVideoPayload[] | AppwriteVideoPayload;

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
    return {
      groups: fallbackRosterGroups,
      availableGroups: getAvailableGroups(fallbackRosterGroups),
    };
  }

  try {
    const parsed = JSON.parse(row.data) as StoredClanMember[];
    const rosterMap = readRosterMap(row.roster);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return {
        groups: fallbackRosterGroups,
        availableGroups: getAvailableGroups(fallbackRosterGroups),
      };
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
      return {
        groups: fallbackRosterGroups,
        availableGroups: getAvailableGroups(fallbackRosterGroups),
      };
    }

    return {
      groups,
      availableGroups,
    };
  } catch {
    return {
      groups: fallbackRosterGroups,
      availableGroups: getAvailableGroups(fallbackRosterGroups),
    };
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
  try {
    const response = await fetch(
      `${endpoint}/tablesdb/${databaseId}/tables/${tableId}/rows/${rowId}`,
      {
        headers: {
          "X-Appwrite-Project": projectId,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as HejteriStorageRow;
  } catch {
    return null;
  }
}
