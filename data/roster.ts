export type RosterGroupName = "Clan 1" | "Clan 2" | "Clan 3" | "Clan 4" | "Clan 5";

export type Member = {
  displayName: string;
  username: string;
  standoffId: string;
  role?: string | null;
};

export const memberRoleColors: Record<string, string> = {
  Admin: "#3498db",
  Booster: "#f1c40f",
  Staff: "#3498db",
  "Staff Trial": "#3498db",
  Designer: "#ffbe0b",
  Streamer: "#ff5a5f",
  Friends: "#ffffff",
};

export const rosterGroups: Record<RosterGroupName, Member[]> = {
  "Clan 1": [],
  "Clan 2": [],
  "Clan 3": [],
  "Clan 4": [],
  "Clan 5": [],
};

export const rosterOrder = Object.keys(rosterGroups) as RosterGroupName[];
