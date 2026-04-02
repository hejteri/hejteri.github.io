import "server-only";

import { getHejteriStorageRow } from "@/lib/hejteri-storage";

type ClanMemberEntry = {
  username: string;
  displayName: string;
  role: string | null;
  clan: number;
};

export async function getClanMemberCount() {
  const row = await getHejteriStorageRow();
  if (!row?.data) {
    return null;
  }

  try {
    const parsed = JSON.parse(row.data) as ClanMemberEntry[];
    return Array.isArray(parsed) ? parsed.length : null;
  } catch {
    return null;
  }
}

export async function getDiscordMemberCount() {
  const row = await getHejteriStorageRow();
  if (typeof row?.members !== "number") {
    return null;
  }

  return row.members;
}
