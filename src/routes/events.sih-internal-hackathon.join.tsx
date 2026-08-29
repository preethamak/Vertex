import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Users } from "lucide-react";
import { toast } from "sonner";
import { Atmosphere } from "@/components/Atmosphere";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { joinHackathonTeam, previewJoinCode } from "@/lib/hackathon.functions";
import { loadPass, mergePass, setMemberKey, type ParticipantPass } from "@/lib/participant";
import {
  SIH_2026_CONTACT_NAME,
  SIH_2026_CONTACT_PHONE,
  SIH_2026_FORM_URL,
  SIH_2026_REGISTRATION_DEADLINE,
  SIH_REGISTRATION_MODE,
} from "@/data/sih-2026";

export const Route = createFileRoute("/events/sih-internal-hackathon/join")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code.slice(0, 20) : "",
  }),
  head: () => ({
    meta: [
      { title: "Join a team — SIH Internal Hackathon" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: JoinPage,
});

type Gender = "female" | "male" | "prefer_not_to_say";
type Preview = Awaited<ReturnType<typeof previewJoinCode>>;

function JoinPage() {
  const invite = Route.useSearch();
  const join = useServerFn(joinHackathonTeam);
  const preview = useServerFn(previewJoinCode);
  const [code, setCode] = useState(invite.code);
  const [teamPreview, setTeamPreview] = useState<Preview>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ teamName: string; memberCount: number } | null>(null);
  const [pass, setPass] = useState<ParticipantPass | null>(null);

  useEffect(() => setPass(loadPass()), []);

  useEffect(() => {
    if (code.trim().length < 4) {
      setTeamPreview(null);
      return;
    }
    const handle = setTimeout(() => {
      preview({ data: { code: code.trim() } })
        .then(setTeamPreview)
        .catch(() => setTeamPreview(null));
    }, 350);
    return () => clearTimeout(handle);
  }, [code, preview]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      gender: String(form.get("gender")) as Gender,
      phone: String(form.get("phone")),
      srn: String(form.get("srn")),
      branch: String(form.get("branch")),
      year: String(form.get("year")),
    };
    setBusy(true);
    try {
      const result = await join({ data: { code: code.trim(), ...values } });
      setMemberKey(result.memberToken);
      setPass(mergePass(values));
      setDone(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not join. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const full = teamPreview && teamPreview.memberCount >= 6;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />
      <main className="relative">
        <section className="relative overflow-hidden border-b border-hairline">
          <Atmosphere />
          <div className="relative mx-auto max-w-2xl px-6 py-20">
            {done ? (
              <div className="glass-strong rounded-2xl p-8 text-center">
                <Check className="mx-auto h-9 w-9 rounded-full bg-emerald-300 p-2 text-black" />
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-silver">
                  You're on the roster
                </p>
                <h1 className="mt-3 font-display text-4xl">{done.teamName}</h1>
                <p className="mt-4 text-sm text-muted-foreground">
                  {done.memberCount} of 6 members confirmed. Update your details or leave anytime
                  from the team console — this browser remembers you.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/events/sih-internal-hackathon/team"
                    className="btn-primary rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
                  >
                    Open team console <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/events/sih-internal-hackathon"
                    className="btn-ghost rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
                  >
                    SIH workspace
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {SIH_REGISTRATION_MODE === "external" && (
                  <div className="mb-6 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-amber-200">
                      SIH 2026 — join via official Form
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      For this SIH edition, team formation is via the official Microsoft Form
                      (deadline {SIH_2026_REGISTRATION_DEADLINE}). This invite page is kept for other
                      hackathons.
                    </p>
                    <a
                      href={SIH_2026_FORM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary mt-3 inline-flex rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
                    >
                      Open Microsoft Form
                    </a>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {SIH_2026_CONTACT_NAME} · {SIH_2026_CONTACT_PHONE}
                    </p>
                  </div>
                )}
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                  Team invite
                </p>
                <h1 className="mt-3 font-display text-5xl tracking-tight">Join your team.</h1>

                <div className="glass-panel mt-8 rounded-2xl p-6">
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Join code
                    </span>
                    <input
                      value={code}
                      onChange={(event) => setCode(event.target.value.toUpperCase())}
                      required
                      maxLength={20}
                      placeholder="XXXX-XXXX"
                      className="field-input rounded-lg px-3 py-2.5 font-mono text-sm tracking-widest"
                    />
                  </label>

                  {teamPreview && (
                    <div className="mt-4 rounded-xl border border-hairline bg-surface-2 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-display text-lg">{teamPreview.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-silver">
                          {teamPreview.memberCount}/6 confirmed
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {teamPreview.roster
                          .map((m) => `${m.name}${m.isLead ? " (lead)" : ""}`)
                          .join(" · ")}
                      </p>
                      {teamPreview.locked ? (
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                          This team already submitted — roster locked.
                        </p>
                      ) : full ? (
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                          Team is full.
                        </p>
                      ) : teamPreview.needsFemale ? (
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-silver">
                          SIH rule: this team must include at least one female member to lock.
                        </p>
                      ) : null}
                    </div>
                  )}

                  {pass && !full && !teamPreview?.locked && (
                    <p className="mt-4 rounded-lg border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Your details are saved in this browser — just confirm below.
                    </p>
                  )}

                  <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                    <JoinField name="name" label="Full name" required defaultValue={pass?.name} />
                    <JoinField
                      name="email"
                      label="Email"
                      type="email"
                      required
                      defaultValue={pass?.email}
                    />
                    <label className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Gender (SIH eligibility)
                      </span>
                      <select
                        name="gender"
                        defaultValue={pass?.gender ?? "prefer_not_to_say"}
                        className="field-input rounded-lg px-3 py-2.5 text-sm"
                      >
                        <option value="prefer_not_to_say">Prefer not to say</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </label>
                    <JoinField name="srn" label="SRN" defaultValue={pass?.srn} />
                    <JoinField name="branch" label="Branch" defaultValue={pass?.branch} />
                    <JoinField name="year" label="Year" defaultValue={pass?.year} />
                    <JoinField name="phone" label="Phone" defaultValue={pass?.phone} />

                    <button
                      disabled={busy || full || teamPreview?.locked}
                      className="btn-primary mt-2 w-full rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest disabled:opacity-50 sm:col-span-2 sm:w-auto"
                    >
                      <Users size={14} />{" "}
                      {busy ? "Joining…" : pass ? "Confirm my spot" : "Join the team"}
                    </button>
                  </form>
                </div>
                <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  No account needed · your details go only to this team's roster
                </p>
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function JoinField({
  name,
  label,
  type = "text",
  required = false,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="field-input rounded-lg px-3 py-2.5 text-sm"
      />
    </label>
  );
}
