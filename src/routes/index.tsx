import { createFileRoute, Link } from "@tanstack/react-router";
import { MemberCard, Avatar } from "@/components/MemberCard";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { VertexLogo } from "@/components/VertexLogo";
import { Atmosphere } from "@/components/Atmosphere";
import { Reveal } from "@/components/Reveal";
import { motion } from "motion/react";
import { ArrowUpRight, Code2, ShieldCheck, Sparkles } from "lucide-react";
import { getDirectory, getEvents } from "@/lib/club.functions";
import { founderWork } from "@/data/founder-work";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [directory, events] = await Promise.all([getDirectory(), getEvents()]);
    return { directory, events };
  },
  head: () => ({
    meta: [
      { title: "Vertex — Technical Club" },
      {
        name: "description",
        content:
          "Vertex is a college technical club. Meet the founders, leadership, and every team from Technical to Media, Events, PR, and Sponsorship.",
      },
      { property: "og:title", content: "Vertex — Technical Club" },
      {
        property: "og:description",
        content:
          "Meet the people behind Vertex — founders, leadership, and every team that builds, ships, and organizes everything we do.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-sm text-muted-foreground">The roster couldn't load.</p>
    </div>
  ),
});

function Home() {
  const { directory, events } = Route.useLoaderData();
  const { teams, leadership, all } = directory;
  const totalMembers = all.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <Atmosphere />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
          >
            <span className="inline-block h-px w-8 bg-silver" />
            Est. 2026 · Technical Club
            <span className="ml-2 hidden items-center gap-2 text-silver sm:inline-flex">
              <i className="h-1.5 w-1.5 rounded-full bg-silver shadow-[0_0_12px_white]" /> Club is
              active
            </span>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <div>
              <div className="flex items-center gap-5">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <VertexLogo className="h-14 w-auto text-foreground drop-shadow-[0_0_45px_rgba(255,255,255,.24)] md:h-20" />
                </motion.div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-silver">
                  V / 01
                </span>
              </div>
              <h1 className="text-silver-gradient mt-8 max-w-3xl font-display text-5xl font-semibold leading-[0.88] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
                Build what campus
                <br />
                will remember.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Vertex is the technical club for students who want to move from curiosity to working
                systems—together.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/join"
                  className="btn-primary rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
                >
                  Join the first cohort <ArrowUpRight size={15} />
                </Link>
                <Link
                  to="/events"
                  className="btn-ghost rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
                >
                  Enter the event desk
                </Link>
              </div>
            </div>

            <SignalField />
          </div>

          <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Members" value={String(totalMembers).padStart(2, "0")} />
            <Stat label="Teams" value={String(teams.length).padStart(2, "0")} />
            <Stat label="Leadership" value={String(leadership.length).padStart(2, "0")} />
            <Stat label="Founded" value="2026" />
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="relative border-t border-white/10 bg-white/[0.012]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <SectionHeader index="01" label="Founder work" title="Proof before promises." />
          </Reveal>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground">
            Vertex is at day one. These are real projects built by our founder—shared as the
            technical standard we intend to grow from, not presented as club work.
          </p>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {founderWork.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.08}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="surface-card group relative flex min-h-[310px] flex-col overflow-hidden rounded-2xl p-6"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.tone}`} />
                  <div className="relative flex items-center justify-between gap-4">
                    <span className="chip rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-silver">
                      {project.label}
                    </span>
                    <ArrowUpRight
                      className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground"
                      size={18}
                    />
                  </div>
                  <div className="relative mt-auto">
                    <div className="flex items-end justify-between gap-4">
                      <h3 className="font-display text-3xl tracking-tight">{project.title}</h3>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        {project.status}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] uppercase tracking-widest text-silver"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <SectionHeader index="02" label="Leadership" title="The people who set the pace." />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {leadership.map((m, index) => (
              <Reveal key={m.slug} delay={index * 0.08}>
                <Link
                  to="/member/$slug"
                  params={{ slug: m.slug }}
                  className="surface-card edge-highlight group flex h-full flex-col items-start gap-6 rounded-2xl p-8"
                >
                  <div className="flex w-full items-start justify-between">
                    <Avatar name={m.name} size={80} photo={m.photo} />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.role}
                    </span>
                  </div>
                  <div>
                    <div className="font-display text-2xl leading-tight">{m.name}</div>
                    <div className="mt-1 font-mono text-xs uppercase tracking-widest text-silver">
                      Vertex · {m.role}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    View profile →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Teams */}
      <section id="teams" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <SectionHeader index="03" label="Teams" title="Five teams. One shared signal." />
          </Reveal>

          <div className="mt-16 flex flex-col gap-24">
            {teams.map((team, i) => (
              <Reveal key={team.id} className="relative">
                <div className="mb-8 flex items-end justify-between gap-6 hairline-b pb-4">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      Team / {String(i + 1).padStart(2, "0")} · {team.code}
                    </div>
                    <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                      {team.name}
                    </h3>
                    {team.blurb && (
                      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{team.blurb}</p>
                    )}
                  </div>
                  <div className="hidden font-mono text-xs text-muted-foreground md:block">
                    {team.members.length + (team.head ? 1 : 0)} members
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {team.head && <MemberCard member={team.head} index={1} isHead />}
                  {team.members.map((m, idx) => (
                    <MemberCard key={m.slug} member={m} index={idx + 2} />
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <SectionHeader index="04" label="Events" title="Something worth showing up for." />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {events.map((e) => {
              const d = e.event_date ? new Date(e.event_date) : null;
              const day = d ? d.toLocaleDateString("en-US", { day: "2-digit" }) : "--";
              const mon = d
                ? d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
                : "TBA";
              return (
                <article
                  key={e.id}
                  className="surface-card group relative flex gap-6 rounded-2xl p-6"
                >
                  <div className="flex w-20 shrink-0 flex-col items-center border border-hairline p-3">
                    <div className="font-display text-3xl leading-none">{day}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-widest text-silver">
                      {mon}
                    </div>
                    <div className="mt-2 font-mono text-[10px] text-muted-foreground">
                      {d ? d.getFullYear() : ""}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span className="border border-hairline px-2 py-0.5 text-silver">
                        {e.tag}
                      </span>
                      <span>· {e.location}</span>
                    </div>
                    <h4 className="mt-2 font-display text-xl font-semibold leading-tight">
                      {e.title}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <Link
            to="/events"
            className="btn-ghost mt-8 rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest"
          >
            Register for an event →
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <SectionHeader index="05" label="Contact" title="Start a conversation." />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <ContactCard label="Email" value="hello@vertex.club" href="mailto:hello@vertex.club" />
            <ContactCard
              label="Instagram"
              value="@vertex.club"
              href="https://instagram.com/vertex.club"
            />
            <ContactCard label="Location" value="Vertex HQ · Tech Block" href="#top" />
          </div>

          <form
            className="glass-panel mt-12 grid gap-4 rounded-2xl p-6 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const subject = encodeURIComponent(`Vertex — ${f.get("name")}`);
              const body = encodeURIComponent(
                `${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`,
              );
              window.location.href = `mailto:hello@vertex.club?subject=${subject}&body=${body}`;
            }}
          >
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Name
              </span>
              <input
                required
                name="name"
                className="field-input rounded-lg px-3 py-2 font-mono text-sm"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Email
              </span>
              <input
                required
                type="email"
                name="email"
                className="field-input rounded-lg px-3 py-2 font-mono text-sm"
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Message
              </span>
              <textarea
                required
                name="message"
                rows={4}
                className="field-input resize-none rounded-lg px-3 py-2 font-mono text-sm"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="btn-primary rounded-lg px-6 py-3 font-mono text-[11px] uppercase tracking-widest"
              >
                Send message →
              </button>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="text-silver-gradient font-display text-4xl font-semibold tracking-tight">
        {value}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function SignalField() {
  return (
    <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 shadow-[0_30px_100px_-40px_rgba(255,255,255,.35)]">
      <div className="grid-backdrop absolute inset-0 opacity-50" />
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-16 left-[18%] h-40 w-40 rounded-full border border-white/15" />
      <div className="absolute bottom-[26%] left-[26%] h-2 w-2 rounded-full bg-white shadow-[0_0_18px_white]" />
      <div className="absolute right-[19%] top-[24%] h-2.5 w-2.5 rounded-full bg-silver shadow-[0_0_22px_white]" />
      <div className="absolute bottom-[27%] left-[27%] right-[20%] h-px origin-left rotate-[-25deg] bg-gradient-to-r from-white/70 to-transparent" />
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>Vertex field</span>
        <span className="flex items-center gap-2 text-silver">
          <i className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> live
        </span>
      </div>
      <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-3">
        <div className="glass-panel rounded-xl p-4">
          <ShieldCheck size={17} className="text-silver" />
          <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Build with intent
          </p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <Code2 size={17} className="text-silver" />
          <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Learn in public
          </p>
        </div>
      </div>
      <div className="absolute left-[48%] top-[37%] flex -translate-x-1/2 flex-col items-center text-center">
        <Sparkles size={25} className="text-white drop-shadow-[0_0_16px_white]" />
        <span className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-silver">
          First signal
        </span>
      </div>
    </div>
  );
}

function ContactCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="surface-card group flex flex-col gap-3 rounded-2xl p-6"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-xl text-foreground">{value}</span>
      <span className="mt-auto font-mono text-[10px] uppercase tracking-widest text-silver opacity-0 transition-opacity group-hover:opacity-100">
        Open →
      </span>
    </a>
  );
}

function SectionHeader({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>{index}</span>
        <span className="inline-block h-px w-10 bg-hairline" />
        <span>{label}</span>
      </div>
      <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{title}</h2>
    </div>
  );
}
