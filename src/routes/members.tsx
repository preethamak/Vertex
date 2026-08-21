import { createFileRoute } from "@tanstack/react-router";
import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { MemberCard } from "@/components/MemberCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getDirectory } from "@/lib/club.functions";

export const Route = createFileRoute("/members")({
  loader: () => getDirectory(),
  head: () => ({
    meta: [
      { title: "Members — Vertex Technical Club" },
      { name: "description", content: "Meet the people building Vertex." },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const directory = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver">
          Vertex people
        </p>
        <h1 className="mt-4 font-display text-5xl tracking-[-0.055em] md:text-7xl">Our team.</h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
          The people shaping the club, running its teams, and making the work happen.
        </p>

        {directory.leadership.length > 0 && (
          <section className="mt-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Leadership
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {directory.leadership.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index + 1} isHead />
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Teams
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {directory.teams.map((team) => (
              <section key={team.id} className="rounded-2xl border border-hairline bg-card/40 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
                  {team.code}
                </p>
                <h2 className="mt-2 font-display text-2xl">{team.name}</h2>
                {team.blurb && (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{team.blurb}</p>
                )}
                <div className="mt-5 grid gap-2">
                  {team.head && <MemberCard member={team.head} index={1} isHead />}
                  {team.members.map((member, index) => (
                    <MemberCard key={member.id} member={member} index={index + 2} />
                  ))}
                  {!team.head && team.members.length === 0 && (
                    <p className="text-sm text-muted-foreground">Team roster will be added soon.</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-hairline pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Find someone
          </p>
          <div className="mt-4">
            <DirectoryExplorer directory={directory} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
