import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowUpRight, CalendarDays, UsersRound, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { Atmosphere } from "@/components/Atmosphere";
import { Reveal } from "@/components/Reveal";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { VertexLogo } from "@/components/VertexLogo";
import { getEvents } from "@/lib/club.functions";

export const Route = createFileRoute("/")({
  loader: () => getEvents(),
  head: () => ({
    meta: [
      { title: "Vertex — Technical Club" },
      {
        name: "description",
        content: "Vertex is a student technical club.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const events = Route.useLoaderData();
  const sih = events.find((event) => event.slug === "sih-internal-hackathon");

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative min-h-[min(760px,calc(100svh-72px))] overflow-hidden border-b border-white/10">
          <Atmosphere />
          <div className="relative mx-auto flex min-h-[min(760px,calc(100svh-72px))] max-w-6xl flex-col justify-center px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="flex items-center gap-4">
                <VertexLogo className="h-11 w-auto text-foreground sm:h-14" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Technical Club
                </span>
              </div>
              <h1 className="text-silver-gradient mt-10 max-w-4xl font-display text-6xl font-semibold leading-[0.84] tracking-[-0.075em] sm:text-8xl lg:text-[8.5rem]">
                Vertex.
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
                A place to learn seriously, make useful things, and find people who care about the
                work.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/join"
                  className="btn-primary rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
                >
                  Join Vertex <ArrowUpRight size={15} />
                </Link>
                <Link
                  to="/events"
                  className="btn-ghost rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
                >
                  See what is happening
                </Link>
              </div>
            </motion.div>

            <div className="mt-16 grid max-w-4xl gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
              <HomeLink
                to="/join"
                icon={<UsersRound size={17} />}
                label="Members"
                detail="Find your team"
              />
              <HomeLink
                to="/projects"
                icon={<Wrench size={17} />}
                label="Work"
                detail="See what gets built"
              />
              <HomeLink
                to="/events"
                icon={<CalendarDays size={17} />}
                label="Events"
                detail="Find the next room"
              />
            </div>
          </div>
        </section>

        {sih && (
          <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <Reveal>
              <Link
                to="/events/sih-internal-hackathon"
                className="group grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] md:grid-cols-[.75fr_1.25fr]"
              >
                <div className="relative min-h-52 overflow-hidden border-b border-white/10 p-6 md:border-b-0 md:border-r">
                  <div className="grid-backdrop absolute inset-0 opacity-60" />
                  <div className="relative flex h-full flex-col justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver">
                      Now building
                    </span>
                    <span className="font-display text-5xl tracking-[-0.06em] text-foreground">
                      SIH
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between p-6 md:p-9">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Internal Hackathon
                    </p>
                    <h2 className="mt-4 font-display text-3xl tracking-tight md:text-4xl">
                      {sih.title}
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                      Team registration, official SIH themes, rules, submissions, and event-day
                      access in one workspace.
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver">
                    Open workspace{" "}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function HomeLink({
  to,
  icon,
  label,
  detail,
}: {
  to: "/join" | "/projects" | "/events";
  icon: ReactNode;
  label: string;
  detail: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 bg-background p-5 transition-colors hover:bg-white/[0.045]"
    >
      <span className="text-silver">{icon}</span>
      <span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span className="mt-1 block text-sm text-foreground">{detail}</span>
      </span>
      <ArrowUpRight
        className="ml-auto text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
        size={16}
      />
    </Link>
  );
}
