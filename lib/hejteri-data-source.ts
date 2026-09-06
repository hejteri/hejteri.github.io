const githubOwner = "hejteri";
const githubRepo = "hejteri.dat";
const githubBranch = "main";
const githubBaseUrl =
  `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/refs/heads/${githubBranch}`;

export type HejteriStorageRow = {
  $createdAt: string;
  videos?: string;
  data?: string;
  members?: number;
  roster?: string;
};

async function fetchGitHubTextFile(path: string): Promise<string | null> {
  try {
    const response = await fetch(`${githubBaseUrl}/${path}?v=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    return text.trim();
  } catch {
    return null;
  }
}

export async function fetchRosterTextFromGitHub(): Promise<string | null> {
  return fetchGitHubTextFile("data/roster.json");
}

function parseStatsValue(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function fetchHejteriStorageRowFromGitHub(): Promise<HejteriStorageRow | null> {
  const [roster, stats] = await Promise.all([
    fetchGitHubTextFile("data/roster.json"),
    fetchGitHubTextFile("stats.json"),
  ]);

  const members = parseStatsValue(stats);
  const hasPayload = Boolean(roster || typeof members === "number");

  if (!hasPayload) {
    return null;
  }

  return {
    $createdAt: new Date().toISOString(),
    roster: roster || undefined,
    members,
  };
}
