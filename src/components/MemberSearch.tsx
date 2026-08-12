import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Member } from "@/data/team";
import { Avatar } from "./MemberCard";

export function MemberSearch({ members }: { members: Member[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.team?.toLowerCase().includes(query) ||
          m.role.toLowerCase().includes(query) ||
          m.skills.some((s) => s.toLowerCase().includes(query)),
      )
      .slice(0, 8);
  }, [q, members]);

  return (
    <div className="relative w-full">
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
        {q && (
          <button
            onClick={() => setQ("")}
            className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-auto border border-hairline bg-background/95 backdrop-blur">
          {results.map((m) => (
            <Link
              key={m.slug}
              to="/member/$slug"
              params={{ slug: m.slug }}
              onClick={() => setQ("")}
              className="flex items-center gap-3 border-b border-hairline p-3 last:border-b-0 hover:bg-card"
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
        </div>
      )}
    </div>
  );
}
