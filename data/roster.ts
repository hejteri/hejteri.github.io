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
  "Clan 1": [
    { displayName: "hejteri_ash", username: "@hejteri_ash", standoffId: "1204581", role: "Admin" },
    { displayName: "hejteri_orbit", username: "@hejteri_orbit", standoffId: "1204582", role: "Booster" },
    { displayName: "hejteri_lyric", username: "@hejteri_lyric", standoffId: "1204583", role: "Streamer" },
    { displayName: "hejteri_nox", username: "@hejteri_nox", standoffId: "1204584", role: "Friends" },
  ],
  "Clan 2": [
    { displayName: "hejteri_echo", username: "@hejteri_echo", standoffId: "2207431", role: "Staff" },
    { displayName: "hejteri_veil", username: "@hejteri_veil", standoffId: "2207432", role: "Designer" },
    { displayName: "hejteri_crest", username: "@hejteri_crest", standoffId: "2207433" },
    { displayName: "hejteri_frost", username: "@hejteri_frost", standoffId: "2207434", role: "Booster" },
  ],
  "Clan 3": [
    { displayName: "hejteri_ion", username: "@hejteri_ion", standoffId: "3311051", role: "Staff Trial" },
    { displayName: "hejteri_wave", username: "@hejteri_wave", standoffId: "3311052" },
    { displayName: "hejteri_ember", username: "@hejteri_ember", standoffId: "3311053", role: "Friends" },
    { displayName: "hejteri_halo", username: "@hejteri_halo", standoffId: "3311054" },
  ],
  "Clan 4": [
    { displayName: "hejteri_zen", username: "@hejteri_zen", standoffId: "4412001" },
    { displayName: "hejteri_kiro", username: "@hejteri_kiro", standoffId: "4412002", role: "Booster" },
    { displayName: "hejteri_sora", username: "@hejteri_sora", standoffId: "4412003" },
    { displayName: "hejteri_blitz", username: "@hejteri_blitz", standoffId: "4412004", role: "Friends" },
  ],
  "Clan 5": [
    { displayName: "hejteri_crow", username: "@hejteri_crow", standoffId: "5513001" },
    { displayName: "hejteri_vex", username: "@hejteri_vex", standoffId: "5513002" },
    { displayName: "hejteri_rune", username: "@hejteri_rune", standoffId: "5513003", role: "Streamer" },
    { displayName: "hejteri_ace", username: "@hejteri_ace", standoffId: "5513004" },
  ],
};

export const rosterOrder = Object.keys(rosterGroups) as RosterGroupName[];
