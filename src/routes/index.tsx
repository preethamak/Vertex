import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowUpRight, CalendarDays, UsersRound, Wrench } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Atmosphere } from "@/components/Atmosphere";
import { Reveal } from "@/components/Reveal";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { VertexLogo } from "@/components/VertexLogo";
import { CountUp, KineticHeading, Magnetic, Parallax, Ticker } from "@/components/motion-kit";
import { getEvents } from "@/lib/club.functions";
import { SIH_2026_THEME_NAMES } from "@/data/sih-2026";

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
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SihBanner />
      <SiteHeader />
      <main>
        <section
          ref={heroRef}
          className="relative min-h-[min(820px,calc(100svh-72px))] overflow-hidden border-b border-hairline"
        >
          <Atmosphere mesh />
          <div className="relative mx-auto flex min-h-[min(820px,calc(100svh-72px))] max-w-6xl flex-col justify-center px-6 py-20">
            <motion.div style={{ y: contentY, opacity: contentOpacity }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="flex items-center gap-4"
              >
                <VertexLogo className="h-11 w-auto text-foreground sm:h-14" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Technical Club
                </span>
              </motion.div>
              <h1 className="mt-10 max-w-5xl font-display text-6xl font-semibold leading-[0.95] tracking-[-0.035em] sm:text-8xl lg:text-[8rem]">
                <KineticHeading text="Vertex" delay={0.15} />
                <motion.span
                  className="text-accent"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  .
                </motion.span>
              </h1>
              <KineticHeading
                delay={0.5}
                stagger={0.035}
                className="mt-7 block max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
                text="A place to learn seriously, make useful things, and find people who care about the work."
              />
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-9 flex flex-wrap gap-3"
              >
                <Magnetic>
                  <Link
                    to="/join"
                    className="btn-primary rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
                  >
                    Join Vertex <ArrowUpRight size={15} />
                  </Link>
                </Magnetic>
                <Magnetic strength={8}>
                  <Link
                    to="/events"
                    className="btn-ghost rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
                  >
                    See what is happening
                  </Link>
                </Magnetic>
              </motion.div>
            </motion.div>

            <Reveal delay={0.2} className="mt-16">
              <div className="grid max-w-4xl gap-px border border-hairline bg-hairline sm:grid-cols-3">
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
            </Reveal>

            <Reveal delay={0.35} className="mt-12">
              <div className="flex max-w-3xl flex-wrap gap-x-10 gap-y-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <Stat value={30} suffix="+" label="Active members" />
                <Stat value={188} suffix="" label="SIH problem statements" />
                <Stat value={18} suffix="" label="Official themes" />
                <Stat value={5} suffix="" label="Core teams" />
              </div>
            </Reveal>
          </div>
        </section>

        <Ticker items={[...SIH_2026_THEME_NAMES.slice(0, 10)]} />

        {sih && (
          <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Reveal>
              <Parallax distance={24}>
                <Link
                  to="/events/sih-internal-hackathon"
                  className="group grid overflow-hidden rounded-2xl ring-card md:grid-cols-[.75fr_1.25fr]"
                >
                  <div className="relative min-h-52 overflow-hidden border-b border-hairline p-6 md:border-b-0 md:border-r">
                    <div className="grid-backdrop absolute inset-0 opacity-60" />
                  <div className="relative flex h-full flex-col justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver">
                      Now building
                    </span>
                    <img
                      src="/sih-2026-logo.png"
                      alt="Smart India Hackathon 2026 — Ministry of Education, AICTE, MoE's Innovation Cell"
                      className="w-full max-w-[210px]"
                      loading="lazy"
                    />
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
                        188 official problem statements are live. Register as a lead, invite your
                        five, and build — all in one workspace.
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
              </Parallax>
            </Reveal>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function SihBanner() {
  const reduceMotion = useReducedMotion();
  const row = Array.from({ length: 8 });
  return (
    <Link
      to="/events/sih-internal-hackathon"
      aria-label="SIH 2026 registration is open — register now"
      className="block overflow-hidden border-b border-hairline bg-accent text-accent-foreground"
    >
      <div
        className={`flex w-max items-center gap-10 py-2 font-mono text-[10px] uppercase tracking-[0.3em] ${
          reduceMotion ? "" : "marquee-track"
        }`}
      >
        {row.map((_, index) => (
          <span key={index} className="flex items-center gap-10 whitespace-nowrap">
            <span className="font-semibold">SIH Registration opens for 2026</span>
            <span className="opacity-60">◆</span>
            <span className="inline-flex items-center gap-1.5 underline underline-offset-4">
              Register now <ArrowUpRight size={12} />
            </span>
            <span className="opacity-60">◆</span>
          </span>
        ))}
      </div>
    </Link>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
        <CountUp to={value} suffix={suffix} />
      </div>
      <div className="mt-1">{label}</div>
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
      className="group flex items-center gap-4 bg-background p-5 transition-colors hover:bg-black/[0.03]"
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
