import "server-only";

import { Client, TablesDB } from "node-appwrite";

export type HejteriStorageRow = {
  $createdAt: string;
  videos?: string;
  data?: string;
  members?: number;
  roster?: string;
};

const hejteriRowId = "69caf74100066b2d85df";

function createAppwriteClient() {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    return null;
  }

  return new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
}

export async function getHejteriStorageRow(): Promise<HejteriStorageRow | null> {
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const tableId = process.env.APPWRITE_TABLE_ID;
  const client = createAppwriteClient();

  if (!client || !databaseId || !tableId) {
    return null;
  }

  try {
    const tablesDB = new TablesDB(client);
    return (await tablesDB.getRow({
      databaseId,
      tableId,
      rowId: hejteriRowId,
    })) as HejteriStorageRow;
  } catch {
    return null;
  }
}
