import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Users } from "lucide-react";
import { toast } from "sonner";
import { Atmosphere } from "@/components/Atmosphere";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { joinHackathonTeam } from "@/lib/hackathon.functions";

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

function JoinPage() {
  const navigate = useNavigate();
  const invite = Route.useSearch();
  const join = useServerFn(joinHackathonTeam);
  const [code, setCode] = useState(invite.code);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ teamName: string; memberCount: number } | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const result = await join({
        data: {
          code: code.trim(),
          name: String(form.get("name")),
          email: String(form.get("email")),
          gender: String(form.get("gender")) as Gender,
          phone: String(form.get("phone")),
          srn: String(form.get("srn")),
          branch: String(form.get("branch")),
          year: String(form.get("year")),
        },
      });
      setDone(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not join. Please try again.");
    } finally {
      setBusy(false);
    }
  };

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
                  {done.memberCount} of 6 members confirmed. Your team lead handles submissions
                  from the team console — keep an eye on the SIH page for announcements.
                </p>
                <Link
                  to="/events/sih-internal-hackathon"
                  className="btn-primary mt-6 rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
                >
                  Back to SIH workspace <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                  Team invite
                </p>
                <h1 className="mt-3 font-display text-5xl tracking-tight">Join your team.</h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                  Enter the join code your team lead shared, then your own details. Your lead's
                  dashboard updates the moment you submit.
                </p>

                <form onSubmit={submit} className="glass-panel mt-8 rounded-2xl p-6">
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

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <JoinField name="name" label="Full name" required />
                    <JoinField name="email" label="Email" type="email" required />
                    <label className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Gender (SIH eligibility)
                      </span>
                      <select
                        name="gender"
                        defaultValue="prefer_not_to_say"
                        className="field-input rounded-lg px-3 py-2.5 text-sm"
                      >
                        <option value="prefer_not_to_say">Prefer not to say</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </label>
                    <JoinField name="srn" label="SRN" />
                    <JoinField name="branch" label="Branch" />
                    <JoinField name="year" label="Year" />
                    <JoinField name="phone" label="Phone" />
                  </div>

                  <button
                    disabled={busy}
                    className="btn-primary mt-8 w-full rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest disabled:opacity-50 sm:w-auto"
                  >
                    <Users size={14} /> {busy ? "Joining…" : "Confirm my spot"}
                  </button>
                </form>
                <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  No account needed · details go only to your team roster
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
