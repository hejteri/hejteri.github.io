"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Account, Client, OAuthProvider } from "appwrite";

import { GlassPanel } from "@/components/ui/glass-panel";
import { Reveal } from "@/components/ui/reveal";

const example = {
  id: "",
  nickname: "Unknown",
  clan: "???",
  hours: "???",
  registered: "???",
  lastLogin: "???",
};

const modes = [
  { mode: "1v1", rank: "Unranked", slug: "unranked", mmr: "0", kills: "0", deaths: "0" },
  { mode: "2v2", rank: "Unranked", slug: "unranked", mmr: "0", kills: "0", deaths: "0" },
  { mode: "5v5", rank: "Unranked", slug: "unranked", mmr: "0", kills: "0", deaths: "0" },
];

const rankThresholds = [[2100, "The Legend"], [1800, "Elite"], [1700, "Master"], [1600, "Champion"], [1500, "Ranger"], [1400, "Phoenix"], [1300, "Gold IV"], [1200, "Gold III"], [1100, "Gold II"], [1000, "Gold I"], [900, "Silver IV"], [800, "Silver III"], [700, "Silver II"], [600, "Silver I"], [500, "Bronze IV"], [400, "Bronze III"], [300, "Bronze II"], [200, "Bronze I"]] as const;
function rankForMmr(mmr: string) { const value = Number(mmr.replace(/\s/g, "")); const threshold = rankThresholds.find(([minimum]) => value >= minimum); return threshold ? { rank: threshold[1], imageMmr: threshold[0] } : { rank: "Unranked", imageMmr: 0 }; }
function relativeTime(timestamp?: string) { if (!timestamp) return "???"; const diff = Date.now() - Number(timestamp); if (!Number.isFinite(diff) || diff < 0) return "just now"; const units: [number, string][] = [[31536000000, "year"], [2592000000, "month"], [604800000, "week"], [86400000, "day"], [3600000, "hour"], [60000, "minute"]]; const unit = units.find(([ms]) => diff >= ms); if (!unit) return "just now"; const count = Math.floor(diff / unit[0]); return `${count} ${unit[1]}${count === 1 ? "" : "s"} ago`; }

const appwriteClient = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6a9d5be30036a20be894");
const account = new Account(appwriteClient);
const refreshCredits = async () => {
  const response = await fetch(`https://fra.cloud.appwrite.io/v1/account?refresh=${Date.now()}`, { credentials: "include", cache: "no-store", headers: { "X-Appwrite-Project": "6a9d5be30036a20be894" } });
  if (!response.ok) throw new Error("account_refresh_failed");
  const user = await response.json();
  const creditsValue = user.prefs?.credits;
  const freeValue = user.prefs?.free_credits;
  return creditsValue === "-1" ? "-1" : String(Number(creditsValue ?? 0) + Number(freeValue ?? 0));
};
type ApiProfile = Record<string, string | number | null> & { profile_img?: string; nickname?: string; clan?: string; hours?: number; registered?: string; login_at?: string };

export default function CheckerPage() {
  const [id, setId] = useState("");
  const [checkedId, setCheckedId] = useState(example.id);
  const [requiresDiscord, setRequiresDiscord] = useState(false);
  const [authState, setAuthState] = useState<"loading" | "signed-in" | "signed-out">("loading");
  const [credits, setCredits] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ApiProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [appwriteUserId, setAppwriteUserId] = useState<string | null>(null);
  const [showBest, setShowBest] = useState(false);
  const profile = profileData ? { ...example, ...profileData, clan: profileData.clan ?? "???", hours: profileData.hours == null ? "???" : String(profileData.hours), registered: relativeTime(profileData.registered), lastLogin: relativeTime(profileData.login_at) } : example;
  const profileModes = ["5v5", "2v2", "1v1"].map((mode) => { const mmrKey = showBest ? `${mode}_best_mmr` : `${mode}_mmr`; const mmr = profileData?.[mmrKey] == null ? "0" : String(profileData[mmrKey]); const kills = profileData?.[`${mode}_kills`] == null ? "0" : String(profileData[`${mode}_kills`]); const deaths = profileData?.[`${mode}_deaths`] == null ? "0" : String(profileData[`${mode}_deaths`]); return { mode, mmr, kills, deaths, ...rankForMmr(mmr) }; });

  useEffect(() => {
    const cacheKey = "hejteri:checker-auth";
    const cached = window.sessionStorage.getItem(cacheKey);
    if (cached === "signed-in") setAuthState("signed-in");
    if (cached === "signed-out") setAuthState("signed-out");

    account.get()
      .then((user) => {
        setAppwriteUserId(user.$id);
        const creditsValue = user.prefs?.credits;
        const freeValue = user.prefs?.free_credits;
        const total = Number(creditsValue ?? 0) + Number(freeValue ?? 0);
        setCredits(creditsValue === "-1" ? "-1" : String(total));
        window.sessionStorage.setItem(cacheKey, "signed-in");
        setAuthState("signed-in");
      })
      .catch(() => {
        setCredits(null);
        window.sessionStorage.removeItem(cacheKey);
        setAuthState("signed-out");
      });
  }, []);
  const signIn = () => {
    const redirectUrl = `${window.location.origin}/checker/`;
    account.createOAuth2Session(OAuthProvider.Discord, redirectUrl, redirectUrl);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (/^\d{3,16}$/.test(id)) {
      setError(null); setLoading(true);
      try {
        const userId = appwriteUserId ?? (await account.get()).$id;
        const identities = await account.listIdentities();
        const discord = identities.identities.find((identity) => identity.provider === "discord")?.providerUid;
        const payload = { id: String(id), discord_id: String(discord ?? "") };
        const response = await fetch("https://api.hejteri.site/profile", { method: "POST", headers: { "Content-Type": "application/json", "x-appwrite-user-id": userId }, body: JSON.stringify(payload) });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "profile_failed");
        setCheckedId(id); setProfileData(body); setRequiresDiscord(false);
      } catch (err) { const code = err instanceof Error ? err.message : "profile_failed"; const networkError = code === "Failed to fetch" || code.toLowerCase().includes("network") || code.toLowerCase().includes("certificate"); setRequiresDiscord(code === "discord_server"); setError(networkError ? "Unable to connect to the profile service. Try disabling ad-blocking DNS or switching networks." : code === "discord_server" ? "This action requires you to be a member of the Discord server." : code === "credit_none" ? "You have no credits remaining." : code === "player_not_found" ? "Profile not found." : "Unable to load this profile."); } finally { refreshCredits().then(setCredits).catch(() => undefined); setLoading(false); }
    }
  };

  return (
    <div className="container-shell section-space space-y-8">
      <Reveal delay={70}>
        {authState === "loading" ? null : authState !== "signed-in" ? <GlassPanel className="relative isolate mx-auto max-w-lg overflow-hidden border-white/10 bg-[linear-gradient(135deg,rgba(12,27,50,0.98),rgba(5,11,23,0.99))] p-8 text-center"><div className="pointer-events-none absolute -right-16 -top-20 -z-10 size-48 rounded-full bg-sky-300/5 blur-3xl" /><div className="pointer-events-none absolute -bottom-24 -left-16 -z-10 size-48 rounded-full bg-indigo-400/5 blur-3xl" /><p className="text-sm text-white/65">Sign in with Discord to search player profiles.</p><button type="button" onClick={signIn} className="mt-5 rounded-xl border border-sky-100/25 bg-sky-200/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-50 transition hover:border-sky-100/40 hover:bg-sky-200/15">Continue with Discord</button></GlassPanel> : (
        <>
        <form onSubmit={submit} className="relative z-20 mx-auto -mb-px flex w-full max-w-lg flex-row items-center gap-0 rounded-t-2xl border border-b-0 border-white/10 bg-[linear-gradient(120deg,rgba(19,32,57,0.9),rgba(9,16,30,0.92))] p-1.5 sm:justify-center sm:rounded-t-3xl sm:p-2">
          {(requiresDiscord || error) && <p className="pointer-events-auto absolute -top-5 left-2 text-[10px] tracking-[0.04em] text-red-300/85">{error || "This action requires you to be a member of the Discord server."}</p>}
          <span className="pointer-events-none absolute -top-5 right-2 text-[10px] tracking-[0.08em] text-white/35"><span className="text-sky-100/70">{credits === "-1" ? "∞" : credits ?? "—"} credits</span> · Resets daily</span>
            <div className="flex min-w-0 flex-1 items-center">
              <div className="min-w-0 flex-1">
              <label className="relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-100/45">ID</span>
                <input
                value={id}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "").slice(0, 16);
                  setId(value);
                  setRequiresDiscord(value === "125");
                }}
                inputMode="numeric"
                pattern="[0-9]{3,16}"
                maxLength={16}
                placeholder="Enter a Standoff 2 ID"
                aria-label="Standoff 2 ID"
                onKeyDown={(event) => {
                  if ((event.ctrlKey || event.metaKey) && ["a", "c", "v", "x"].includes(event.key.toLowerCase())) return;
                  if (!/[0-9]/.test(event.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(event.key)) event.preventDefault();
                }}
                className="h-8 w-full rounded-l-2xl border border-r-0 border-white/10 bg-[#080f1d]/80 py-0 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-white/10"
                />
              </label>
              </div>
            </div>
            <button type="submit" aria-label="Search profile" disabled={loading || id.length < 3 || id.length > 16 || !/^\d+$/.test(id) || credits === null || credits === "0"} className="inline-flex size-8 shrink-0 items-center justify-center rounded-r-2xl border border-l-0 border-white/10 bg-[#080f1d]/80 p-0 text-sky-50 transition hover:bg-sky-100/10 disabled:cursor-not-allowed disabled:opacity-35">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </>
        )}
      </Reveal>

      {authState === "signed-in" && <>
      <Reveal delay={120} className="-mt-8">
        <GlassPanel className="overflow-hidden rounded-t-3xl border-white/12 bg-[linear-gradient(135deg,rgba(22,34,59,0.92),rgba(7,12,24,0.96))] max-[35.625rem]:rounded-t-none">
          <div className="relative isolate flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-sky-200/35 to-transparent" />
            <div className="relative z-10 size-16 shrink-0 self-center overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-[0_12px_35px_rgba(0,0,0,0.35)] sm:size-20 sm:self-auto">
              {profileData?.profile_img ? <img src={`data:image/png;base64,${profileData.profile_img}`} alt="Player profile" className="size-full object-cover" /> : <Image src="/profile.png" alt="Unknown profile" fill className="object-contain" sizes="96px" />}
            </div>
            <div className="relative z-10 min-w-0 flex-1 text-center sm:text-left">
              <h2 className="mt-1 truncate font-display text-3xl tracking-[-0.05em] text-white sm:text-4xl">{profile.nickname}</h2>
              <p className="mt-1 text-xs text-white/45">ID <span className="font-medium tabular-nums text-white/80">{checkedId}</span></p>
            </div>
            <div className="relative z-10 flex flex-wrap items-start justify-center gap-x-4 gap-y-3 pt-1 text-center sm:min-w-0 sm:flex-none sm:justify-end sm:pl-5 sm:pt-0 sm:text-right sm:self-start">
              <div><p className="text-[10px] uppercase tracking-[0.12em] text-white/35">Clan</p><p className="mt-1 text-xs font-medium text-sky-100/85">{profile.clan.replace(/^\[|\]$/g, "")}</p></div>
              <div><p className="text-[10px] uppercase tracking-[0.12em] text-white/35">Registered</p><p className="mt-1 text-xs text-white/85">{profile.registered}</p></div>
              <div><p className="text-[10px] uppercase tracking-[0.12em] text-white/35">Last login</p><p className="mt-1 text-xs text-white/85">{profile.lastLogin}</p></div>
              <div><p className="text-[10px] uppercase tracking-[0.12em] text-white/35">Play time</p><p className="mt-1 text-xs text-white/85">{profile.hours}</p></div>
            </div>
            <div className="relative z-10 flex justify-center sm:absolute sm:bottom-3 sm:right-5">
              <div className="inline-flex rounded-full border border-white/10 bg-black/15 p-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <button type="button" onClick={() => setShowBest(false)} className={`rounded-full px-3 py-1 transition ${!showBest ? "bg-white/12 text-white" : "text-white/40 hover:text-white/70"}`}>Current</button>
                <button type="button" onClick={() => setShowBest(true)} className={`rounded-full px-3 py-1 transition ${showBest ? "bg-white/12 text-white" : "text-white/40 hover:text-white/70"}`}>Best</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-white/8">
            {profileModes.map((item) => (
              <div key={item.mode} className="relative isolate min-w-0 overflow-hidden bg-[#0b1424]/90 p-2 text-center sm:p-7">
                <Image src={`/ranks/${item.mode}_bg.png`} alt="" fill aria-hidden className="pointer-events-none -z-10 object-cover opacity-[0.11]" sizes="(min-width: 640px) 33vw, 100vw" />
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0b1424]/45 via-[#0b1424]/75 to-[#0b1424]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60 sm:text-sm sm:tracking-[0.3em]">{item.mode}</p>
                <div className="mt-4 flex flex-col items-center">
                  <div className="relative size-14 sm:size-28">
                    <Image src={`/ranks/${item.mode}_${item.imageMmr}.png`} alt={`${item.rank} rank`} fill className="object-contain" sizes="112px" />
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/35">MMR</p>
                  <p className="mt-1 font-display text-lg tabular-nums text-white sm:text-3xl">{item.mmr}</p>
                  <p className="mt-1 text-[10px] font-medium text-sky-100/80 sm:text-sm">{item.rank}</p>
                </div>
                <div className="mx-auto mt-3 flex max-w-[180px] justify-center gap-2 border-t border-white/8 pt-3 text-center text-[10px] sm:mt-5 sm:gap-8 sm:pt-4 sm:text-xs">
                  <div><p className="text-white/35">Kills</p><p className="mt-1 text-sm tabular-nums text-white/90">{item.kills}</p></div>
                  <div><p className="text-white/35">Deaths</p><p className="mt-1 text-sm tabular-nums text-white/90">{item.deaths}</p></div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </Reveal></>}
    </div>
  );
}
