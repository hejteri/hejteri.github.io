import type { RosterGroupName } from "@/lib/roster-utils";

export type { RosterGroupName };

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

export const rosterGroups: Record<RosterGroupName, Member[]> = {};

export const rosterOrder: RosterGroupName[] = [];
