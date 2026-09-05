import "server-only";

import { fetchHejteriStorageRowFromGitHub } from "@/lib/hejteri-data-source";
import type { HejteriStorageRow } from "@/lib/hejteri-data-source";

export type { HejteriStorageRow };

export async function getHejteriStorageRow(): Promise<HejteriStorageRow | null> {
  return fetchHejteriStorageRowFromGitHub();
}
