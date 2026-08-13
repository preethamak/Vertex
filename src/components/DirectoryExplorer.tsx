import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Directory, Member } from "@/data/team";
import { Avatar } from "./MemberCard";

type Sort = "team" | "name" | "role";

export function DirectoryExplorer({ directory }: { directory: Directory }) {
  const { all, teams } = directory;
  const [q, setQ] = useState("");
  const [team, setTeam] = useState<string>("all");
  const [role, setRole] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("team");

  const roles = useMemo(() => {
    const set = new Set(all.map((m) => m.role).filter(Boolean));
    return Array.from(set).sort();
  }, [all]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = all.filter((m: Member) => {
      if (team !== "all" && (m.teamId ?? "leadership") !== team) return false;
      if (role !== "all" && m.role !== role) return false;
      if (!query) return true;
      return (
        m.name.toLowerCase().includes(query) ||
        (m.team ?? "").toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        m.skills.some((s) => s.toLowerCase().includes(query))
      );
    });
    const byName = (a: Member, b: Member) => a.name.localeCompare(b.name);
    if (sort === "name") return [...list].sort(byName);
    if (sort === "role") return [...list].sort((a, b) => a.role.localeCompare(b.role) || byName(a, b));
    return [...list].sort(
      (a, b) => (a.team ?? "").localeCompare(b.team ?? "") || Number(b.isHead) - Number(a.isHead) || byName(a, b),
    );
  }, [all, q, team, role, sort]);

  const filtering = q.trim() !== "" || team !== "all" || role !== "all" || sort !== "team";

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 border border-hairline bg-card/40 px-4 py-3 focus-within:border-silver/60">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Search
        </span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a member, team, or skill…"
          className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Select
          label="Team"
          value={team}
          onChange={setTeam}
          options={[
            { value: "all", label: "All teams" },
            { value: "leadership", label: "Leadership" },
            ...teams.map((t) => ({ value: t.id, label: t.name })),
          ]}
        />
        <Select
          label="Role"
          value={role}
          onChange={setRole}
          options={[{ value: "all", label: "All roles" }, ...roles.map((r) => ({ value: r, label: r }))]}
        />
        <Select
          label="Sort"
          value={sort}
          onChange={(v) => setSort(v as Sort)}
          options={[
            { value: "team", label: "By team" },
            { value: "name", label: "A → Z" },
            { value: "role", label: "By role" },
          ]}
        />
        {filtering && (
          <button
            onClick={() => {
              setQ("");
              setTeam("all");
              setRole("all");
              setSort("team");
            }}
            className="border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-silver hover:text-foreground"
          >
            Reset
          </button>
        )}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {results.length} / {all.length}
        </span>
      </div>

      {filtering && (
        <div className="mt-4 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          {results.map((m) => (
            <Link
              key={m.slug}
              to="/member/$slug"
              params={{ slug: m.slug }}
              className="flex items-center gap-3 bg-background p-3 hover:bg-card"
            >
              <Avatar name={m.name} size={40} photo={m.photo} />
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm">{m.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {m.team ?? "Vertex"} · {m.role}
                </div>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">→</span>
            </Link>
          ))}
          {results.length === 0 && (
            <div className="bg-background p-6 font-mono text-xs text-muted-foreground sm:col-span-2">
              Nobody matches those filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Select({
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
