import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, Check, Copy, FileText, Users } from "lucide-react";
import { toast } from "sonner";
import { Atmosphere } from "@/components/Atmosphere";
import { Reveal } from "@/components/Reveal";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getHackathon, registerHackathonTeam } from "@/lib/hackathon.functions";
import {
  SIH_2026_GUIDELINES_URL,
  SIH_2026_RULES,
  SIH_2026_SOURCE_URL,
  SIH_2026_THEME_NAMES,
} from "@/data/sih-2026";

export const Route = createFileRoute("/events/sih-internal-hackathon")({  loader: () => getHackathon(),
  head: () => ({
    meta: [
      { title: "SIH Internal Hackathon — Vertex" },
      {
        name: "description",
        content:
          "The official Vertex workspace for SIH Internal Hackathon teams, submissions, milestones, and updates.",
      },
    ],
  }),
  component: HackathonPage,
});

function HackathonPage() {
  const data = Route.useLoaderData();
  const [registering, setRegistering] = useState(false);

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-6 py-32 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Workspace unavailable
          </p>
          <h1 className="mt-4 font-display text-5xl">SIH is being prepared.</h1>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { event, workspace, milestones, announcements, statements, roster } = data;
  const registrationOpen = Boolean(workspace?.registration_open);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-hairline">
          <Atmosphere />
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
            <div className="chip rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
              <span
                className={`h-1.5 w-1.5 rounded-full ${registrationOpen ? "bg-emerald-300 shadow-[0_0_12px_rgb(110,231,183)]" : "bg-amber-300"}`}
              />
              {registrationOpen ? "Registration open" : "Registration status pending"}
            </div>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Vertex presents
                </p>
                <h1 className="text-silver-gradient mt-4 font-display text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-7xl">
                  SIH Internal
                  <br />
                  Hackathon.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Form your team, choose an official problem statement, build the idea, and submit
                  it through one controlled workspace.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {registrationOpen ? (
                    <button
                      onClick={() => setRegistering(true)}
                      className="btn-primary rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
                    >
                      Register your team <ArrowRight size={15} />
                    </button>
                  ) : (
                    <span className="btn-ghost rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Registration will open here
                    </span>
                  )}
                  <a
                    href="#statements"
                    className="btn-ghost rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
                  >
                    Browse statements
                  </a>
                </div>
              </div>
              <div className="glass-panel edge-highlight rounded-2xl p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Event desk
                </div>
                <dl className="mt-5 grid gap-4 text-sm">
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="text-right">{event.location}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Team size</dt>
                    <dd>
                      {workspace
                        ? workspace.min_team_size === workspace.max_team_size
                          ? `Exactly ${workspace.min_team_size} members`
                          : `${workspace.min_team_size}–${workspace.max_team_size} members`
                        : "To be confirmed"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Problem statements</dt>
                    <dd>{statements.length || "Being verified"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {registering && workspace && (
          <Registration onClose={() => setRegistering(false)} />
        )}

        <section className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <Eyebrow number="01" label="Live desk" title="Every update, in one place." />
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_.9fr]">
            <div className="surface-card rounded-2xl p-6">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver">
                <FileText size={14} /> Rules
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {SIH_2026_RULES.map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-silver" />
                    {rule}
                  </li>
                ))}
              </ul>
              <a
                href={SIH_2026_GUIDELINES_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost mt-5 rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-widest"
              >
                Read official SIH guidelines
              </a>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver">
                <Users size={14} /> Team access
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Already registered? Open the private team console with the team key you saved at
                registration.
              </p>
              <Link
                to="/events/sih-internal-hackathon/team"
                className="btn-ghost mt-5 rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
              >
                Open team console <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          {(announcements.length > 0 || milestones.length > 0) && (
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-2xl">Announcements</h2>
                <div className="mt-4 grid gap-3">
                  {announcements.map((item) => (
                    <article key={item.id} className="surface-card rounded-xl p-5">
                      <h3 className="font-display text-lg">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl">Timeline</h2>
                <ol className="mt-4 border-l border-hairline pl-5">
                  {milestones.map((item) => (
                    <li
                      key={item.id}
                      className="relative pb-6 before:absolute before:-left-[1.4rem] before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-silver"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-widest text-silver">
                        {item.starts_at
                          ? new Date(item.starts_at).toLocaleDateString()
                          : "Date to be announced"}
                      </div>
                      <h3 className="mt-1 font-display text-lg">{item.title}</h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </section>

        <section id="statements" className="border-y border-hairline bg-surface-2">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <Eyebrow
                number="02"
                label="Problem statements"
                title="Choose the right problem, not a random one."
              />
            </Reveal>
            {statements.length ? (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {statements.map((item) => (
                  <article key={item.id} className="surface-card rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="chip rounded-md px-2 py-1 font-mono text-[10px] text-silver">
                        {item.statement_code}
                      </span>
                      {item.category && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-5 font-display text-xl leading-tight">{item.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {[item.organization, item.theme].filter(Boolean).join(" · ")}
                    </p>
                    {item.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="glass-panel mt-10 rounded-2xl p-8">
                <p className="font-display text-2xl">Official statements are being verified.</p>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                  Only statements approved by the Vertex SIH desk will appear here. This prevents
                  students from starting on an outdated or unofficial prompt.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <Eyebrow
              number="03"
              label="Official SIH themes"
              title="Find the right lane for your idea."
            />
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {SIH_2026_THEME_NAMES.map((theme) => (
              <a
                key={theme}
                href={SIH_2026_SOURCE_URL}
                target="_blank"
                rel="noreferrer"
                className="chip rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {theme}
              </a>
            ))}
          </div>
        </section>

        {roster.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-20">
            <Eyebrow number="04" label="Teams" title="The builders in the room." />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roster.map((team) => (
                <article key={team.id} className="surface-card rounded-2xl p-5">
                  <div className="flex justify-between gap-3">
                    <h3 className="font-display text-xl">{team.name}</h3>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-silver">
                      {team.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {team.members.map((member) => member.name).join(" · ")}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Registration({ onClose }: { onClose: () => void }) {
  const register = useServerFn(registerHackathonTeam);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    teamName: string;
    token: string;
    joinCode: string;
    checkinCode: string;
  } | null>(null);

  const joinLink = success
    ? `${window.location.origin}/events/sih-internal-hackathon/join?code=${success.joinCode}`
    : "";

  if (success)
    return (
      <section className="relative border-y border-hairline bg-surface-2">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="glass-strong rounded-2xl p-7 text-center">
            <Check className="mx-auto h-9 w-9 rounded-full bg-emerald-300 p-2 text-black" />
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-silver">
              Team registered
            </p>
            <h2 className="mt-3 font-display text-4xl">{success.teamName}</h2>

            <div className="mt-7 grid gap-4 text-left sm:grid-cols-2">
              <div className="surface-card rounded-xl p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  1 · Invite your team
                </p>
                <p className="mt-2 font-mono text-lg tracking-widest">{success.joinCode}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Share this code or the invite link. Teammates open it and enter their own
                  details until the roster reaches 6.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard
                        .writeText(joinLink)
                        .then(() => toast.success("Invite link copied."))
                    }
                    className="btn-primary rounded-lg px-3 py-2 font-mono text-[9px] uppercase tracking-widest"
                  >
                    <Copy size={12} /> Copy invite link
                  </button>
                  <button
                    onClick={() =>
                      navigator.clipboard
                        .writeText(success.joinCode)
                        .then(() => toast.success("Join code copied."))
                    }
                    className="btn-ghost rounded-lg px-3 py-2 font-mono text-[9px] uppercase tracking-widest"
                  >
                    Copy code
                  </button>
                </div>
              </div>
              <div className="surface-card rounded-xl p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  2 · Keep your team key
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  This private key opens your team console — roster, submissions, updates. It is
                  shown once; store it somewhere safe.
                </p>
                <button
                  onClick={() =>
                    navigator.clipboard
                      .writeText(success.token)
                      .then(() => toast.success("Team key copied."))
                  }
                  className="btn-primary mt-3 rounded-lg px-3 py-2 font-mono text-[9px] uppercase tracking-widest"
                >
                  <Copy size={12} /> Copy team key
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="rounded-xl bg-white p-4">
                <QRCodeSVG
                  value={success.checkinCode}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              </div>
              <p className="max-w-md text-xs leading-5 text-muted-foreground">
                Event-day check-in QR — save it or screenshot it. It cannot edit your team.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/events/sih-internal-hackathon/team"
                className="btn-primary rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
              >
                Open team console <ArrowRight size={14} />
              </Link>
              <button
                onClick={onClose}
                className="btn-ghost rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <section id="register" className="border-y border-hairline bg-surface-2">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Step one · 30 seconds
            </p>
            <h2 className="mt-2 font-display text-4xl">Register as team lead.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Only your own details are needed now. You will get an invite link to share — your
              teammates fill in their own information and the roster locks at 6.
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
        <form
          className="glass-panel mt-8 rounded-2xl p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            setSubmitting(true);
            try {
              const result = await register({
                data: {
                  name: String(form.get("teamName")),
                  leadName: String(form.get("leadName")),
                  leadEmail: String(form.get("leadEmail")),
                  leadGender: String(form.get("leadGender")) as
                    | "female"
                    | "male"
                    | "prefer_not_to_say",
                  leadPhone: String(form.get("leadPhone")),
                  leadSrn: String(form.get("leadSrn")),
                  leadBranch: String(form.get("leadBranch")),
                  leadYear: String(form.get("leadYear")),
                },
              });
              sessionStorage.setItem("vertex-sih-team-key", result.token);
              setSuccess(result);
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Registration failed. Please try again.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field name="teamName" label="Team name" required />
            <Field name="leadName" label="Your full name" required />
            <Field name="leadEmail" label="Your email" type="email" required />
            <GenderField name="leadGender" label="Gender (SIH eligibility)" />
            <Field name="leadSrn" label="SRN" />
            <Field name="leadPhone" label="Phone" />
            <Field name="leadBranch" label="Branch" />
            <Field name="leadYear" label="Year" />
          </div>
          <button
            disabled={submitting}
            className="btn-primary mt-8 rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest disabled:opacity-50"
          >
            {submitting ? "Registering…" : "Create team & get invite link"} <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </section>
  );
}
function GenderField({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        defaultValue="prefer_not_to_say"
        className="field-input rounded-lg px-3 py-2.5 text-sm"
      >
        <option value="prefer_not_to_say">Prefer not to say</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
    </label>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
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
        className="field-input rounded-lg px-3 py-2.5 text-sm"
      />
    </label>
  );
}
function Eyebrow({ number, label, title }: { number: string; label: string; title: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        {number} · {label}
      </div>
      <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
    </div>
  );
}
