import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { PhotoUpload } from "@/components/PhotoUpload";
import {
  adminOverview,
  awardBadge,
  checkInByCode,
  deleteAnnouncement,
  deleteMember,
  saveAnnouncement,
  saveEvent,
  saveMember,
  saveProject,
  setApplicationStatus,
} from "@/lib/admin.functions";
import { checkInHackathonTeam } from "@/lib/hackathon.functions";
import {
  hackathonAdmin,
  saveHackathonProblemStatement,
  setHackathonTeamStatus,
} from "@/lib/hackathon.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  loader: () => adminOverview(),
  head: () => ({
    meta: [
      { title: "Admin console — Vertex" },
      { name: "description", content: "Manage the Vertex roster, events, projects, and door check-in." },
      { property: "og:title", content: "Admin console — Vertex" },
      { property: "og:description", content: "Vertex staff tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <p className="max-w-sm text-center font-mono text-sm text-muted-foreground">
        This console is for team heads and admins only.
      </p>
    </div>
  ),
});

const TABS = ["Check-in", "SIH", "Applications", "Members", "Events", "Projects", "Announcements"] as const;
type Tab = (typeof TABS)[number];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

function AdminPage() {
  const data = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("Check-in");
  const isAdmin = data.viewer.isAdmin;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className="inline-block h-px w-8 bg-silver" />
          {isAdmin ? "Admin" : "Team head"} console
        </div>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight md:text-6xl">Control room.</h1>

        <div className="mt-6 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
          <Stat label="Applications" value={String(data.applications.length)} />
          <Stat label="Members" value={String(data.members.length)} />
          <Stat label="Registrations" value={String(data.registrations.length)} />
          <Stat
            label="Checked in"
            value={String(data.registrations.filter((r) => r.checked_in_at).length)}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.filter((t) => isAdmin || t === "Check-in" || t === "SIH" || t === "Applications" || t === "Announcements").map(
            (t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${
                  tab === t ? "border-silver text-foreground" : "border-hairline text-muted-foreground hover:border-silver"
                }`}
              >
                {t}
              </button>
            ),
          )}
        </div>

        <div className="mt-8">
          {tab === "Check-in" && <CheckIn registrations={data.registrations} events={data.events} />}
          {tab === "SIH" && <SihOperations isAdmin={isAdmin} />}
          {tab === "Applications" && <Applications rows={data.applications} />}
          {tab === "Members" && <Members members={data.members} teams={data.teams} />}
          {tab === "Events" && <Events events={data.events} />}
          {tab === "Projects" && <Projects projects={data.projects} members={data.members} />}
          {tab === "Announcements" && (
            <Announcements rows={data.announcements} teams={data.teams} isAdmin={isAdmin} headTeams={data.viewer.headTeams} />
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-5">
      <div className="font-display text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

const field =
  "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none";
const btn = "border border-silver bg-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background disabled:opacity-50";
const ghost = "border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-silver";

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{text}</span>
      {children}
    </label>
  );
}

/* ---------------- SIH operations ---------------- */

function SihOperations({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const load = useServerFn(hackathonAdmin);
  const saveStatement = useServerFn(saveHackathonProblemStatement);
  const setStatus = useServerFn(setHackathonTeamStatus);
  const [data, setData] = useState<Awaited<ReturnType<typeof hackathonAdmin>> | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      setData(await load());
    } catch {
      toast.error("Could not load SIH operations.");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  if (!data) {
    return <p className="font-mono text-xs text-muted-foreground">Loading SIH operations…</p>;
  }

  const checkedIn = new Set(data.checkins.map((entry) => entry.team_id));
  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
        <Stat label="Teams" value={String(data.teams.length)} />
        <Stat label="Students" value={String(data.members.length)} />
        <Stat label="Final submissions" value={String(data.submissions.filter((entry) => entry.status === "final").length)} />
        <Stat label="Checked in" value={String(checkedIn.size)} />
      </div>

      <section className="border border-hairline bg-card/40 p-6">
        <div className="font-display text-xl">Teams</div>
        <div className="mt-4 flex flex-col gap-px border border-hairline bg-hairline">
          {data.teams.map((team) => {
            const roster = data.members.filter((member) => member.team_id === team.id);
            const submission = data.submissions.find((entry) => entry.team_id === team.id);
            return (
              <div key={team.id} className="bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-lg">{team.name}</div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {roster.length}/6 students · {team.college || "College not supplied"} · {checkedIn.has(team.id) ? "checked in" : "not checked in"}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {roster.map((member) => `${member.name}${member.is_lead ? " (lead)" : ""}`).join(", ")}
                    </p>
                    {submission?.solution_title && <p className="mt-1 text-xs text-silver">{submission.solution_title} · {submission.status}</p>}
                  </div>
                  <select
                    value={team.status}
                    onChange={async (event) => {
                      try {
                        await setStatus({ data: { id: team.id, status: event.target.value as "registered" } });
                        toast.success("Team status updated.");
                        await refresh();
                        await router.invalidate();
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Could not update team status.");
                      }
                    }}
                    className={field}
                  >
                    {["registered", "in_review", "shortlisted", "selected", "waitlisted", "rejected", "withdrawn"].map((status) => (
                      <option key={status} value={status} className="bg-background">{status.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
          {data.teams.length === 0 && <div className="bg-background p-4 text-sm text-muted-foreground">No SIH teams registered yet.</div>}
        </div>
      </section>

      {isAdmin && <section className="grid gap-5 border border-hairline bg-card/40 p-6">
        <div>
          <div className="font-display text-xl">Official problem statements</div>
          <p className="mt-1 text-sm text-muted-foreground">Paste only statements verified against the official SIH release. Publishing makes a statement available to teams.</p>
        </div>
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const values = new FormData(form);
            setBusy(true);
            try {
              await saveStatement({ data: {
                statementCode: String(values.get("code") ?? ""), title: String(values.get("title") ?? ""),
                organization: String(values.get("organization") ?? "") || null, category: String(values.get("category") ?? "") || null,
                theme: String(values.get("theme") ?? "") || null, description: String(values.get("description") ?? "") || null,
                sourceUrl: String(values.get("sourceUrl") ?? "") || null, sourceVersion: String(values.get("sourceVersion") ?? "") || null,
                published: values.get("published") === "on", sortOrder: Number(values.get("sortOrder") ?? 0),
              } });
              toast.success("Problem statement saved."); form.reset(); await refresh();
            } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save statement."); }
            finally { setBusy(false); }
          }}
        >
          <input name="code" required placeholder="Problem statement code" className={field} />
          <input name="title" required placeholder="Official title" className={field} />
          <input name="organization" placeholder="Organisation" className={field} />
          <input name="theme" placeholder="Official theme" className={field} />
          <input name="category" placeholder="Category" className={field} />
          <input name="sourceUrl" type="url" placeholder="Official source URL" className={field} />
          <input name="sourceVersion" placeholder="Source version / release" className={field} />
          <input name="sortOrder" type="number" min="0" defaultValue="0" className={field} />
          <textarea name="description" placeholder="Official description" rows={4} className={`${field} resize-none md:col-span-2`} />
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><input type="checkbox" name="published" /> Publish to teams</label>
          <button className={`${btn} w-fit`} disabled={busy}>{busy ? "Saving…" : "Save statement"}</button>
        </form>
        <div className="flex flex-col gap-px border border-hairline bg-hairline">
          {data.statements.map((statement) => <div key={statement.id} className="bg-background p-3 text-sm"><span className="font-mono text-[10px] text-silver">{statement.statement_code}</span> <span className="ml-2">{statement.title}</span> <span className="ml-2 text-muted-foreground">{statement.published ? "Published" : "Draft"}</span></div>)}
        </div>
      </section>}
    </div>
  );
}

/* ---------------- check-in ---------------- */

function CheckIn({
  registrations,
  events,
}: {
  registrations: { id: string; event_id: string; name: string; email: string; checked_in_at: string | null }[];
  events: { id: string; title: string }[];
}) {
  const router = useRouter();
  const scan = useServerFn(checkInByCode);
  const scanSih = useServerFn(checkInHackathonTeam);
  const [result, setResult] = useState<string | null>(null);
  const [eventId, setEventId] = useState(events[0]?.id ?? "");

  const rows = registrations.filter((r) => r.event_id === eventId);
  const done = rows.filter((r) => r.checked_in_at).length;

  return (
    <div className="grid gap-8">
      <form
        className="flex flex-wrap items-end gap-3 border border-hairline bg-card/40 p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const form = e.currentTarget;
          try {
            const code = String(f.get("code") ?? "").trim();
            if (code.toUpperCase().includes("VTX-SIH:")) {
              const res = await scanSih({ data: { code } });
              if (res.status === "ok") {
                setResult(`✓ ${res.team} checked in · ${res.members.map((m) => m.name).join(", ")}`);
              } else if (res.status === "already") {
                setResult(`! ${res.team} already checked in · ${res.members.map((m) => m.name).join(", ")}`);
              } else setResult("✗ Unknown SIH team code");
            } else {
              const res = await scan({ data: { code } });
              if (res.status === "ok") setResult(`✓ ${res.name} checked in · ${res.event}`);
              else if (res.status === "already") setResult(`! ${res.name} already checked in`);
              else setResult("✗ Unknown pass code");
            }
          } catch {
            setResult("✗ Check-in failed");
          }
          form.reset();
          await router.invalidate();
        }}
      >
        <Label text="Pass code or scanned URL">
          <input name="code" required autoFocus className={`${field} w-80`} placeholder="Paste or scan…" />
        </Label>
        <button className={btn}>Check in</button>
        {result && <span className="font-mono text-xs text-silver">{result}</span>}
      </form>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Label text="Event">
            <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={field}>
              {events.map((e) => (
                <option key={e.id} value={e.id} className="bg-background">
                  {e.title}
                </option>
              ))}
            </select>
          </Label>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {done} / {rows.length} attended
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-px border border-hairline bg-hairline">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 bg-background p-3">
              <div>
                <div className="font-display text-sm">{r.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{r.email}</div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-silver">
                {r.checked_in_at ? "In" : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- applications ---------------- */

function Applications({
  rows,
}: {
  rows: {
    id: string;
    name: string;
    email: string;
    team_first: string | null;
    team_second: string | null;
    why: string | null;
    status: string;
    notes: string | null;
  }[];
}) {
  const router = useRouter();
  const update = useServerFn(setApplicationStatus);

  return (
    <div className="flex flex-col gap-px border border-hairline bg-hairline">
      {rows.map((a) => (
        <div key={a.id} className="bg-background p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display text-lg">{a.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {a.email} · {a.team_first ?? "—"} / {a.team_second ?? "—"} · {a.status}
              </div>
            </div>
            <div className="flex gap-2">
              {(["shortlisted", "accepted", "rejected"] as const).map((s) => (
                <button
                  key={s}
                  className={ghost}
                  onClick={async () => {
                    try {
                      await update({ data: { id: a.id, status: s, notes: a.notes } });
                      toast.success(`Marked ${s}.`);
                      await router.invalidate();
                    } catch {
                      toast.error("Could not update.");
                    }
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {a.why && <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{a.why}</p>}
        </div>
      ))}
      {rows.length === 0 && (
        <div className="bg-background p-6 font-mono text-xs text-muted-foreground">No applications yet.</div>
      )}
    </div>
  );
}

/* ---------------- members ---------------- */

type MemberRow = {
  id: string;
  slug: string;
  name: string;
  role: string;
  team_id: string | null;
  is_head: boolean;
  is_leadership: boolean;
  photo_url: string | null;
  bio: string | null;
  skills: string[] | null;
  links: unknown;
  sort_order: number;
};

function Members({ members, teams }: { members: MemberRow[]; teams: { id: string; name: string }[] }) {
  const router = useRouter();
  const save = useServerFn(saveMember);
  const remove = useServerFn(deleteMember);
  const award = useServerFn(awardBadge);
  const [editing, setEditing] = useState<MemberRow | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const open = (m: MemberRow | null) => {
    setEditing(m ?? ({ id: "", slug: "", name: "", role: "Member", team_id: teams[0]?.id ?? null, is_head: false, is_leadership: false, photo_url: null, bio: null, skills: [], links: {}, sort_order: 0 } as MemberRow));
    setPhoto(m?.photo_url ?? null);
  };

  return (
    <div className="grid gap-8">
      <button className={btn} onClick={() => open(null)}>
        + Add member
      </button>

      {editing && (
        <form
          className="grid gap-4 border border-hairline bg-card/40 p-6 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const name = String(f.get("name") ?? "");
            setBusy(true);
            try {
              await save({
                data: {
                  ...(editing.id ? { id: editing.id } : {}),
                  name,
                  slug: String(f.get("slug") ?? "") || slugify(name),
                  role: String(f.get("role") ?? "Member"),
                  teamId: String(f.get("team") ?? "") || null,
                  isHead: f.get("isHead") === "on",
                  isLeadership: f.get("isLeadership") === "on",
                  photoUrl: photo,
                  bio: String(f.get("bio") ?? "") || null,
                  skills: String(f.get("skills") ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  links: {},
                  sortOrder: Number(f.get("sortOrder") ?? 0),
                },
              });
              toast.success("Member saved.");
              setEditing(null);
              await router.invalidate();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not save.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="md:col-span-2">
            <PhotoUpload value={photo} onChange={setPhoto} label="Member photo" />
          </div>
          <Label text="Name">
            <input name="name" required defaultValue={editing.name} className={field} />
          </Label>
          <Label text="Profile link name (slug)">
            <input name="slug" defaultValue={editing.slug} placeholder="auto from name" className={field} />
          </Label>
          <Label text="Role">
            <input name="role" required defaultValue={editing.role} className={field} />
          </Label>
          <Label text="Team">
            <select name="team" defaultValue={editing.team_id ?? ""} className={field}>
              <option value="" className="bg-background">
                Leadership / none
              </option>
              {teams.map((t) => (
                <option key={t.id} value={t.id} className="bg-background">
                  {t.name}
                </option>
              ))}
            </select>
          </Label>
          <Label text="Skills (comma separated)">
            <input name="skills" defaultValue={(editing.skills ?? []).join(", ")} className={field} />
          </Label>
          <Label text="Sort order">
            <input name="sortOrder" type="number" defaultValue={editing.sort_order} className={field} />
          </Label>
          <Label text="Bio">
            <textarea name="bio" rows={3} defaultValue={editing.bio ?? ""} className={`${field} md:col-span-2 resize-none`} />
          </Label>
          <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isHead" defaultChecked={editing.is_head} /> Team head
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isLeadership" defaultChecked={editing.is_leadership} /> Leadership
            </label>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button className={btn} disabled={busy}>
              {busy ? "Saving…" : "Save member"}
            </button>
            <button type="button" className={ghost} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-px border border-hairline bg-hairline">
        {members.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-4 bg-background p-4">
            <div className="min-w-0 flex-1">
              <div className="font-display text-base">{m.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.role} · {teams.find((t) => t.id === m.team_id)?.name ?? "Leadership"} · /{m.slug}
              </div>
            </div>
            <button className={ghost} onClick={() => open(m)}>
              Edit
            </button>
            <button
              className={ghost}
              onClick={async () => {
                const badgeId = window.prompt("Badge id (founder, team-head, hackathon-win, shipper, regular, mentor)");
                if (!badgeId) return;
                try {
                  await award({ data: { memberId: m.id, badgeId, note: null } });
                  toast.success("Badge awarded.");
                } catch {
                  toast.error("Could not award badge.");
                }
              }}
            >
              Badge
            </button>
            <button
              className={ghost}
              onClick={async () => {
                if (!window.confirm(`Remove ${m.name}?`)) return;
                try {
                  await remove({ data: { id: m.id } });
                  toast.success("Member removed.");
                  await router.invalidate();
                } catch {
                  toast.error("Could not remove.");
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- events ---------------- */

type EventRow = {
  id: string;
  slug: string;
  title: string;
  event_date: string | null;
  start_time: string | null;
  location: string;
  tag: string;
  description: string | null;
  cover_url: string | null;
  capacity: number | null;
  published: boolean;
};

function Events({ events }: { events: EventRow[] }) {
  const router = useRouter();
  const save = useServerFn(saveEvent);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const open = (e: EventRow | null) => {
    setEditing(
      e ??
        ({
          id: "",
          slug: "",
          title: "",
          event_date: new Date().toISOString().slice(0, 10),
          start_time: "",
          location: "TBA",
          tag: "Event",
          description: "",
          cover_url: null,
          capacity: null,
          published: true,
        } as EventRow),
    );
    setCover(e?.cover_url ?? null);
  };

  return (
    <div className="grid gap-8">
      <button className={btn} onClick={() => open(null)}>
        + Add event
      </button>

      {editing && (
        <form
          className="grid gap-4 border border-hairline bg-card/40 p-6 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const title = String(f.get("title") ?? "");
            setBusy(true);
            try {
              await save({
                data: {
                  ...(editing.id ? { id: editing.id } : {}),
                  title,
                  slug: String(f.get("slug") ?? "") || slugify(title),
                  eventDate: String(f.get("date") ?? ""),
                  startTime: String(f.get("time") ?? "") || null,
                  location: String(f.get("location") ?? "TBA"),
                  tag: String(f.get("tag") ?? "Event"),
                  description: String(f.get("description") ?? "") || null,
                  coverUrl: cover,
                  capacity: f.get("capacity") ? Number(f.get("capacity")) : null,
                  published: f.get("published") === "on",
                },
              });
              toast.success("Event saved.");
              setEditing(null);
              await router.invalidate();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not save.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="md:col-span-2">
            <PhotoUpload value={cover} onChange={setCover} folder="events" label="Cover image" />
          </div>
          <Label text="Title">
            <input name="title" required defaultValue={editing.title} className={field} />
          </Label>
          <Label text="Link name (slug)">
            <input name="slug" defaultValue={editing.slug} placeholder="auto from title" className={field} />
          </Label>
          <Label text="Date">
            <input name="date" type="date" required defaultValue={editing.event_date ?? ""} className={field} />
          </Label>
          <Label text="Start time">
            <input name="time" defaultValue={editing.start_time ?? ""} className={field} />
          </Label>
          <Label text="Location">
            <input name="location" required defaultValue={editing.location} className={field} />
          </Label>
          <Label text="Tag">
            <input name="tag" required defaultValue={editing.tag} className={field} />
          </Label>
          <Label text="Capacity">
            <input name="capacity" type="number" defaultValue={editing.capacity ?? ""} className={field} />
          </Label>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <input type="checkbox" name="published" defaultChecked={editing.published} /> Published
          </label>
          <Label text="Description">
            <textarea name="description" rows={3} defaultValue={editing.description ?? ""} className={`${field} resize-none md:col-span-2`} />
          </Label>
          <div className="flex gap-2 md:col-span-2">
            <button className={btn} disabled={busy}>
              {busy ? "Saving…" : "Save event"}
            </button>
            <button type="button" className={ghost} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-px border border-hairline bg-hairline">
        {events.map((e) => (
          <div key={e.id} className="flex items-center justify-between gap-4 bg-background p-4">
            <div>
              <div className="font-display text-base">{e.title}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {e.event_date ? new Date(e.event_date).toDateString() : "Date TBA"} · {e.location} · {e.published ? "live" : "draft"}
              </div>
            </div>
            <button className={ghost} onClick={() => open(e)}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- projects ---------------- */

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tech: string[];
  cover_url: string | null;
  link: string | null;
  year: number | null;
  published: boolean;
};

function Projects({ projects, members }: { projects: ProjectRow[]; members: MemberRow[] }) {
  const router = useRouter();
  const save = useServerFn(saveProject);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [people, setPeople] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const open = (p: ProjectRow | null) => {
    setEditing(
      p ??
        ({
          id: "",
          slug: "",
          title: "",
          description: "",
          tech: [],
          cover_url: null,
          link: "",
          year: new Date().getFullYear(),
          published: true,
        } as ProjectRow),
    );
    setCover(p?.cover_url ?? null);
    setPeople([]);
  };

  return (
    <div className="grid gap-8">
      <button className={btn} onClick={() => open(null)}>
        + Add project
      </button>

      {editing && (
        <form
          className="grid gap-4 border border-hairline bg-card/40 p-6 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const title = String(f.get("title") ?? "");
            setBusy(true);
            try {
              await save({
                data: {
                  ...(editing.id ? { id: editing.id } : {}),
                  title,
                  slug: String(f.get("slug") ?? "") || slugify(title),
                  description: String(f.get("description") ?? "") || null,
                  tech: String(f.get("tech") ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  coverUrl: cover,
                  link: String(f.get("link") ?? "") || null,
                  year: f.get("year") ? Number(f.get("year")) : null,
                  published: f.get("published") === "on",
                  contributorIds: people,
                },
              });
              toast.success("Project saved.");
              setEditing(null);
              await router.invalidate();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not save.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="md:col-span-2">
            <PhotoUpload value={cover} onChange={setCover} folder="projects" label="Cover image" />
          </div>
          <Label text="Title">
            <input name="title" required defaultValue={editing.title} className={field} />
          </Label>
          <Label text="Link name (slug)">
            <input name="slug" defaultValue={editing.slug} placeholder="auto from title" className={field} />
          </Label>
          <Label text="Tech (comma separated)">
            <input name="tech" defaultValue={editing.tech.join(", ")} className={field} />
          </Label>
          <Label text="External link">
            <input name="link" defaultValue={editing.link ?? ""} className={field} />
          </Label>
          <Label text="Year">
            <input name="year" type="number" defaultValue={editing.year ?? ""} className={field} />
          </Label>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <input type="checkbox" name="published" defaultChecked={editing.published} /> Published
          </label>
          <Label text="Description">
            <textarea name="description" rows={3} defaultValue={editing.description ?? ""} className={`${field} resize-none md:col-span-2`} />
          </Label>
          <div className="md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Contributors
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {members.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() =>
                    setPeople(people.includes(m.id) ? people.filter((p) => p !== m.id) : [...people, m.id])
                  }
                  className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                    people.includes(m.id) ? "border-silver text-foreground" : "border-hairline text-muted-foreground"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button className={btn} disabled={busy}>
              {busy ? "Saving…" : "Save project"}
            </button>
            <button type="button" className={ghost} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-px border border-hairline bg-hairline">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 bg-background p-4">
            <div>
              <div className="font-display text-base">{p.title}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {p.year ?? "—"} · {p.published ? "live" : "draft"}
              </div>
            </div>
            <button className={ghost} onClick={() => open(p)}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- announcements ---------------- */

function Announcements({
  rows,
  teams,
  isAdmin,
  headTeams,
}: {
  rows: { id: string; title: string; body: string; team_id: string | null; pinned: boolean; published: boolean; created_at: string }[];
  teams: { id: string; name: string }[];
  isAdmin: boolean;
  headTeams: string[];
}) {
  const router = useRouter();
  const save = useServerFn(saveAnnouncement);
  const remove = useServerFn(deleteAnnouncement);
  const [busy, setBusy] = useState(false);
  const allowed = isAdmin ? teams : teams.filter((t) => headTeams.includes(t.id));

  return (
    <div className="grid gap-8">
      <form
        className="grid gap-4 border border-hairline bg-card/40 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const form = e.currentTarget;
          setBusy(true);
          try {
            await save({
              data: {
                title: String(f.get("title") ?? ""),
                body: String(f.get("body") ?? ""),
                teamId: String(f.get("team") ?? "") || null,
                pinned: f.get("pinned") === "on",
                published: true,
              },
            });
            toast.success("Announcement posted.");
            form.reset();
            await router.invalidate();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not post.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <Label text="Title">
          <input name="title" required className={field} />
        </Label>
        <Label text="Message">
          <textarea name="body" rows={4} required className={`${field} resize-none`} />
        </Label>
        <div className="flex flex-wrap items-center gap-4">
          <Label text="Audience">
            <select name="team" className={field} defaultValue={isAdmin ? "" : (allowed[0]?.id ?? "")}>
              {isAdmin && (
                <option value="" className="bg-background">
                  Club-wide
                </option>
              )}
              {allowed.map((t) => (
                <option key={t.id} value={t.id} className="bg-background">
                  {t.name}
                </option>
              ))}
            </select>
          </Label>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <input type="checkbox" name="pinned" /> Pin to top
          </label>
          <button className={btn} disabled={busy}>
            {busy ? "Posting…" : "Post announcement"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-px border border-hairline bg-hairline">
        {rows.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-4 bg-background p-4">
            <div className="min-w-0">
              <div className="font-display text-base">{a.title}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {a.team_id ? (teams.find((t) => t.id === a.team_id)?.name ?? a.team_id) : "Club-wide"} ·{" "}
                {new Date(a.created_at).toDateString()}
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{a.body}</p>
            </div>
            <button
              className={ghost}
              onClick={async () => {
                try {
                  await remove({ data: { id: a.id } });
                  toast.success("Deleted.");
                  await router.invalidate();
                } catch {
                  toast.error("Could not delete.");
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
