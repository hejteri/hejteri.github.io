import "server-only";

import { latestClips as fallbackLatestClips } from "@/data/site";
import { getHejteriStorageRow, type HejteriStorageRow } from "@/lib/hejteri-storage";

const clipImages = [
  "/games/standoff-1.svg",
  "/games/standoff-2.svg",
  "/games/standoff-3.svg",
];

type AppwriteVideoPayload = {
  link?: string;
  user?: {
    username?: string;
    tag?: string;
  };
  channel?: {
    id?: string;
    name?: string | null;
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

function parseClipRow(row: HejteriStorageRow): LatestClipItem[] {
  if (!row.videos) {
    return [];
  }

  try {
    const parsed = JSON.parse(row.videos) as AppwriteVideoPayload[] | AppwriteVideoPayload;

    if (Array.isArray(parsed)) {
      return parsed.slice(0, 3).map((entry, index) => parseClipEntry(entry, index, row.$createdAt));
    }

    if (parsed && typeof parsed === "object") {
      return [parseClipEntry(parsed, 0, row.$createdAt)];
    }

    return [];
  } catch {
    return [];
  }
}

export async function getLatestClips(): Promise<LatestClipItem[]> {
  const row = (await getHejteriStorageRow()) as HejteriStorageRow | null;
  if (!row) {
    return fallbackClips();
  }

  const latest = parseClipRow(row);
  return latest.length ? latest : fallbackClips();
}
