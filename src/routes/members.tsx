import { createFileRoute } from "@tanstack/react-router";
import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { MemberCard } from "@/components/MemberCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Reveal } from "@/components/Reveal";
import { Atmosphere } from "@/components/Atmosphere";
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
      <main>
        <section className="relative overflow-hidden border-b border-hairline">
          <Atmosphere />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver">
                Vertex collective
              </p>
              <h1 className="text-silver-gradient mt-4 max-w-4xl font-display text-6xl tracking-[-0.065em] md:text-8xl">
                The team behind the work.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                Explore the people and teams building Vertex. Every profile is a living portfolio,
                not just a line on a roster.
              </p>
            </Reveal>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          {directory.leadership.length > 0 && (
            <section className="mt-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Leadership
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {directory.leadership.map((member, index) => (
                  <Reveal key={member.id} delay={index * 0.04}>
                    <SpotlightCard>
                      <MemberCard member={member} index={index + 1} isHead />
                    </SpotlightCard>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Teams
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {directory.teams.map((team, teamIndex) => (
                <Reveal key={team.id} delay={teamIndex * 0.06}>
                  <SpotlightCard className="h-full">
                    <section className="p-5">
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
                          <p className="text-sm text-muted-foreground">
                            Team roster will be added soon.
                          </p>
                        )}
                      </div>
                    </section>
                  </SpotlightCard>
                </Reveal>
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
