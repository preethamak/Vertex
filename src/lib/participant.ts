// Participant Pass — a browser-local profile so nobody types their details twice.
// Nothing is stored server-side until the person actually joins or registers a team.

export type ParticipantPass = {
  name: string;
  email: string;
  gender: "female" | "male" | "prefer_not_to_say";
  phone: string;
  srn: string;
  branch: string;
  year: string;
};

const PASS_KEY = "vertex-pass";
const TEAM_KEY = "vertex-sih-team-key";
const MEMBER_KEY = "vertex-sih-member-key";

const isBrowser = typeof window !== "undefined";

export function loadPass(): ParticipantPass | null {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(PASS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ParticipantPass;
    return typeof parsed?.email === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function savePass(pass: ParticipantPass) {
  if (!isBrowser) return;
  window.localStorage.setItem(PASS_KEY, JSON.stringify(pass));
}

/** Merge form values into the stored pass, keeping the strongest data. */
export function mergePass(values: Partial<ParticipantPass>) {
  const current = loadPass() ?? {
    name: "",
    email: "",
    gender: "prefer_not_to_say" as const,
    phone: "",
    srn: "",
    branch: "",
    year: "",
  };
  const merged: ParticipantPass = { ...current };
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string" && value.trim()) {
      (merged as Record<string, string>)[key] = value.trim();
    } else if (key === "gender" && typeof value === "string" && value) {
      merged.gender = value as ParticipantPass["gender"];
    }
  }
  savePass(merged);
  return merged;
}

export function clearPass() {
  if (!isBrowser) return;
  window.localStorage.removeItem(PASS_KEY);
}

// Keys migrated from sessionStorage so they survive browser restarts.
function migrateKey(sessionName: string, localName: string) {
  if (!isBrowser) return;
  const local = window.localStorage.getItem(localName);
  if (local) return;
  const session = window.sessionStorage.getItem(sessionName);
  if (session) {
    window.localStorage.setItem(localName, session);
    window.sessionStorage.removeItem(sessionName);
  }
}

export function getTeamKey() {
  if (!isBrowser) return "";
  migrateKey(TEAM_KEY, TEAM_KEY);
  return window.localStorage.getItem(TEAM_KEY) ?? "";
}

export function setTeamKey(key: string) {
  if (!isBrowser) return;
  window.localStorage.setItem(TEAM_KEY, key);
}

export function getMemberKey() {
  if (!isBrowser) return "";
  migrateKey(MEMBER_KEY, MEMBER_KEY);
  return window.localStorage.getItem(MEMBER_KEY) ?? "";
}

export function setMemberKey(key: string) {
  if (!isBrowser) return;
  window.localStorage.setItem(MEMBER_KEY, key);
}

export function clearMemberKey() {
  if (!isBrowser) return;
  window.localStorage.removeItem(MEMBER_KEY);
}
