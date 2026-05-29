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

function parseStatsValue(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function fetchHejteriStorageRowFromGitHub(): Promise<HejteriStorageRow | null> {
  const [data, roster, videos, stats] = await Promise.all([
    fetchGitHubTextFile("clan-members.json"),
    fetchGitHubTextFile("roster.json"),
    fetchGitHubTextFile("videos.json"),
    fetchGitHubTextFile("stats.json"),
  ]);

  const members = parseStatsValue(stats);
  const hasPayload = Boolean(data || roster || videos || typeof members === "number");

  if (!hasPayload) {
    return null;
  }

  return {
    $createdAt: new Date().toISOString(),
    data: data || undefined,
    roster: roster || undefined,
    videos: videos || undefined,
    members,
  };
}
