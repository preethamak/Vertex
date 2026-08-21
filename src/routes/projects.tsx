import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { getShowcase } from "@/lib/public.functions";

export const Route = createFileRoute("/projects")({
  loader: () => getShowcase(),
  head: () => ({
    meta: [
      { title: "Projects — Vertex Technical Club" },
      {
        name: "description",
        content: "Selected work and Vertex projects.",
      },
      { property: "og:title", content: "Projects — Vertex Technical Club" },
      {
        property: "og:description",
        content: "Selected work and Vertex projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-sm text-muted-foreground">The showcase couldn't load.</p>
    </div>
  ),
});

function ProjectsPage() {
  const { projects, contributors, members, teams } = Route.useLoaderData();
  const [team, setTeam] = useState("all");
  const [role, setRole] = useState("all");

  const memberById = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);
  const roles = useMemo(
    () => Array.from(new Set(members.map((m) => m.role).filter(Boolean))).sort(),
    [members],
  );

  const withPeople = useMemo(
    () =>
      projects.map((p) => ({
        ...p,
        people: contributors
          .filter((c) => c.project_id === p.id)
          .map((c) => memberById.get(c.member_id))
          .filter(Boolean) as (typeof members)[number][],
      })),
    [projects, contributors, memberById],
  );

  const filtered = withPeople.filter((p) => {
    if (team !== "all" && !p.people.some((m) => m.team_id === team)) return false;
    if (role !== "all" && !p.people.some((m) => m.role === role)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-40" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="inline-block h-px w-8 bg-silver" />
            Selected work
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
            Projects.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
            A small, honest record of projects we can stand behind. Team credit appears only when it
            has been recorded.
          </p>

          {(teams.length > 0 || roles.length > 0) && (
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Filter
                label="Team"
                value={team}
                onChange={setTeam}
                options={[
                  { value: "all", label: "All teams" },
                  ...teams.map((t) => ({ value: t.id, label: t.name })),
                ]}
              />
              <Filter
                label="Role"
                value={role}
                onChange={setRole}
                options={[
                  { value: "all", label: "All roles" },
                  ...roles.map((r) => ({ value: r, label: r })),
                ]}
              />
              {(team !== "all" || role !== "all") && (
                <button
                  onClick={() => {
                    setTeam("all");
                    setRole("all");
                  }}
                  className="border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-silver hover:text-foreground"
                >
                  Reset
                </button>
              )}
            </div>
          )}

          <div className="mt-10 grid gap-px border border-hairline bg-hairline md:grid-cols-2">
            {filtered.map((p) => (
              <article key={p.id} className="flex flex-col gap-4 bg-background p-6">
                {p.cover_url && (
                  <img
                    src={p.cover_url}
                    alt={p.title}
                    loading="lazy"
                    className="h-44 w-full border border-hairline object-cover"
                  />
                )}
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-2xl font-semibold leading-tight">{p.title}</h2>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {p.year ?? ""}
                  </span>
                </div>
                {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                {p.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {p.people.length > 0 && (
                  <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
                    {p.people.map((m) => (
                      <Link
                        key={m.id}
                        to="/member/$slug"
                        params={{ slug: m.slug }}
                        className="text-silver hover:text-foreground"
                      >
                        {m.name}
                      </Link>
                    ))}
                  </div>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto w-fit border border-hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-silver"
                  >
                    Open project →
                  </a>
                )}
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="bg-background p-8 font-mono text-xs text-muted-foreground md:col-span-2">
                No projects match those filters yet.
              </div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Filter({
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
