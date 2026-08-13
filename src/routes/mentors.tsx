import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Avatar } from "@/components/MemberCard";
import { getMentorPool } from "@/lib/public.functions";
import { requestMentor } from "@/lib/member.functions";

export const Route = createFileRoute("/mentors")({
  loader: () => getMentorPool(),
  head: () => ({
    meta: [
      { title: "Mentor matching — Vertex Technical Club" },
      {
        name: "description",
        content:
          "Match with a Vertex mentor by team and skill — heads and senior members you can learn from, one request away.",
      },
      { property: "og:title", content: "Mentor matching — Vertex Technical Club" },
      { property: "og:description", content: "Find a Vertex mentor by team and skill." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MentorsPage,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-sm text-muted-foreground">Mentors couldn't load.</p>
    </div>
  ),
});

function MentorsPage() {
  const { members, teams } = Route.useLoaderData();
  const send = useServerFn(requestMentor);
  const [team, setTeam] = useState("all");
  const [skill, setSkill] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const mentors = members.filter((m) => m.is_head || m.is_leadership || (m.skills ?? []).length > 0);
  const skills = useMemo(
    () => Array.from(new Set(mentors.flatMap((m) => m.skills ?? []))).sort(),
    [mentors],
  );
  const teamName = useMemo(() => new Map(teams.map((t) => [t.id, t.name])), [teams]);

  const filtered = mentors
    .filter((m) => (team === "all" ? true : m.team_id === team))
    .filter((m) => (skill === "all" ? true : (m.skills ?? []).includes(skill)))
    .sort((a, b) => Number(b.is_head) - Number(a.is_head) || a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="inline-block h-px w-8 bg-silver" />
            Mentor matching
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
            Find a mentor.
          </h1>
          <p className="mt-5 max-w-xl text-sm text-muted-foreground">
            Pick a team and a skill. Send a request — the mentor sees it on their member dashboard and can accept
            or decline.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Pick
              label="Team"
              value={team}
              onChange={setTeam}
              options={[{ value: "all", label: "All teams" }, ...teams.map((t) => ({ value: t.id, label: t.name }))]}
            />
            <Pick
              label="Skill"
              value={skill}
              onChange={setSkill}
              options={[{ value: "all", label: "Any skill" }, ...skills.map((s) => ({ value: s, label: s }))]}
            />
            {(team !== "all" || skill !== "all") && (
              <button
                onClick={() => {
                  setTeam("all");
                  setSkill("all");
                }}
                className="border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-silver hover:text-foreground"
              >
                Reset
              </button>
            )}
          </div>

          <div className="mt-10 grid gap-px border border-hairline bg-hairline md:grid-cols-2">
            {filtered.map((m) => (
              <div key={m.id} className="bg-background p-6">
                <div className="flex items-start gap-4">
                  <Avatar name={m.name} size={56} photo={m.photo_url} />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/member/$slug"
                      params={{ slug: m.slug }}
                      className="font-display text-xl leading-tight hover:text-silver"
                    >
                      {m.name}
                    </Link>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.team_id ? (teamName.get(m.team_id) ?? "Vertex") : "Leadership"} · {m.role}
                    </div>
                    {(m.skills ?? []).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(m.skills ?? []).slice(0, 6).map((s) => (
                          <span
                            key={s}
                            className="border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setOpenId(openId === m.id ? null : m.id)}
                  className="mt-5 border border-hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-silver"
                >
                  {openId === m.id ? "Cancel" : "Request mentorship →"}
                </button>

                {openId === m.id && (
                  <form
                    className="mt-4 grid gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      setBusy(true);
                      try {
                        await send({
                          data: {
                            mentorId: m.id,
                            topic: String(f.get("topic") ?? ""),
                            message: String(f.get("message") ?? "") || null,
                          },
                        });
                        toast.success("Request sent.");
                        setOpenId(null);
                      } catch {
                        toast.error("Sign in as a listed member to request mentorship.");
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <input
                      name="topic"
                      required
                      placeholder="What do you want help with?"
                      className="border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
                    />
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="A line about where you're at (optional)"
                      className="resize-none border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-fit border border-silver bg-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background disabled:opacity-50"
                    >
                      {busy ? "Sending…" : "Send request"}
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Pick({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 border border-hairline bg-card/40 px-3 py-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-mono text-[11px] text-foreground focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-background">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
