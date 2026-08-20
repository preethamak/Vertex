import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, KeyRound, Users } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getHackathonTeam } from "@/lib/hackathon.functions";

export const Route = createFileRoute("/hackathon/team")({ component: TeamConsole });

type TeamData = Awaited<ReturnType<typeof getHackathonTeam>>;

function TeamConsole() {
  const loadTeam = useServerFn(getHackathonTeam);
  const [token, setToken] = useState("");
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setToken(sessionStorage.getItem("vertex-sih-team-key") ?? ""), []);

  const open = async () => {
    if (!token.trim()) return toast.error("Enter the private team key from registration.");
    setLoading(true);
    try {
      const data = await loadTeam({ data: { token: token.trim() } });
      sessionStorage.setItem("vertex-sih-team-key", token.trim());
      setTeamData(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Team key not recognised.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <Link
          to="/hackathon"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} /> SIH workspace
        </Link>
        <div className="mt-10 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <aside className="glass-panel h-fit rounded-2xl p-6">
            <KeyRound className="text-silver" size={21} />
            <h1 className="mt-4 font-display text-3xl">Team console</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Use the private team key created at registration. It is not the QR check-in code.
            </p>
            <label className="mt-6 flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Team key
              </span>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="field-input rounded-lg px-3 py-2.5 font-mono text-sm"
                autoComplete="off"
              />
            </label>
            <button
              onClick={open}
              disabled={loading}
              className="btn-primary mt-4 w-full justify-center rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Opening…" : "Open team workspace"}
            </button>
          </aside>
          <section>
            {teamData ? (
              <TeamSummary data={teamData} />
            ) : (
              <div className="surface-card rounded-2xl p-8">
                <Users className="text-silver" size={28} />
                <p className="mt-5 font-display text-2xl">Your workspace stays private.</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Open it with your team key to see your roster, progress, and submission state.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function TeamSummary({ data }: { data: TeamData }) {
  return (
    <div className="space-y-5">
      <div className="surface-card rounded-2xl p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[.2em] text-silver">
              {data.team.status}
            </span>
            <h2 className="mt-3 font-display text-4xl">{data.team.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {data.team.college || "College not added"}
            </p>
          </div>
          <span className="chip rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
            {data.members.length} members
          </span>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {data.members.map((member) => (
            <div key={member.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="font-display text-lg">{member.name}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {member.is_lead ? "Team lead" : "Member"}
                {member.usn ? ` · ${member.usn}` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel rounded-2xl p-7">
        <div className="font-mono text-[10px] uppercase tracking-[.2em] text-silver">
          Submission status
        </div>
        <h3 className="mt-3 font-display text-2xl">
          {data.submission?.finalized_at
            ? "Final submission locked"
            : data.submission?.solution_title || "Draft not started"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {data.submission?.finalized_at
            ? "Your team’s final entry is protected. Contact the SIH desk only if a correction is necessary."
            : data.workspace?.submissions_open
              ? "Submission editing is opening next in this console."
              : "The SIH desk has not opened submissions yet."}
        </p>
      </div>
    </div>
  );
}
