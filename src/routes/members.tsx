import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
  const [activeTeamId, setActiveTeamId] = useState(directory.teams[0]?.id ?? "");
  const activeTeam = directory.teams.find((team) => team.id === activeTeamId) ?? directory.teams[0];

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
                Meet Vertex.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                The people who run the club and make the work happen.
              </p>
            </Reveal>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          {directory.leadership.length > 0 && (
            <section>
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

          <section className="mt-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Teams
            </p>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {directory.teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setActiveTeamId(team.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${activeTeam?.id === team.id ? "border-silver bg-white/10 text-foreground" : "border-hairline text-muted-foreground hover:border-silver"}`}
                >
                  {team.name}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {activeTeam && (
                <motion.div
                  key={activeTeam.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="mt-4"
                >
                  <SpotlightCard>
                    <section className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
                            {activeTeam.code}
                          </p>
                          <h2 className="mt-2 font-display text-3xl">{activeTeam.name}</h2>
                          {activeTeam.blurb && (
                            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                              {activeTeam.blurb}
                            </p>
                          )}
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {(activeTeam.head ? 1 : 0) + activeTeam.members.length} members
                        </span>
                      </div>
                      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {activeTeam.head && (
                          <MemberCard member={activeTeam.head} index={1} isHead />
                        )}
                        {activeTeam.members.map((member, index) => (
                          <MemberCard key={member.id} member={member} index={index + 2} />
                        ))}
                        {!activeTeam.head && activeTeam.members.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Team roster will be added soon.
                          </p>
                        )}
                      </div>
                    </section>
                  </SpotlightCard>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section className="mt-14 border-t border-hairline pt-8">
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
