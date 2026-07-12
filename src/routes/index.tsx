import { createFileRoute } from "@tanstack/react-router";
import { VertexLogo } from "@/components/VertexLogo";
import { MemberCard, Avatar } from "@/components/MemberCard";
import { MemberSearch } from "@/components/MemberSearch";
import { leadership, teams, slugify } from "@/data/team";
import { events } from "@/data/events";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
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
});

function Home() {
  const totalMembers =
    leadership.length + teams.reduce((n, t) => n + 1 + t.members.length, 0);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 hairline-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2 text-foreground">
            <VertexLogo className="h-6 w-auto" />
            <span className="font-display text-lg font-semibold tracking-tight">
              Vertex
            </span>
          </a>
          <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex">
            <a href="#leadership" className="hover:text-foreground">Leadership</a>
            <a href="#teams" className="hover:text-foreground">Teams</a>
            <a href="#events" className="hover:text-foreground">Events</a>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-60" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, oklch(0.18 0 0) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-32">
          <div className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="inline-block h-px w-8 bg-silver" />
            Est. 2026 · Vertex Technical Club
          </div>

          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            <VertexLogo className="h-20 w-auto text-foreground md:h-28" />
            <div>
              <h1 className="font-display text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
                Vertex
              </h1>
              <p className="mt-3 max-w-xl font-mono text-sm uppercase tracking-widest text-muted-foreground">
                A technical club — built by teams, run by people.
              </p>
            </div>
          </div>

          <div className="mt-12 max-w-2xl">
            <MemberSearch />
          </div>

          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden border border-hairline bg-hairline md:grid-cols-4">
            <Stat label="Members" value={String(totalMembers).padStart(2, "0")} />
            <Stat label="Teams" value={String(teams.length).padStart(2, "0")} />
            <Stat label="Leadership" value={String(leadership.length).padStart(2, "0")} />
            <Stat label="Founded" value="2026" />
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="hairline-t">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeader index="01" label="Leadership" title="The people at the top." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {leadership.map((m) => (
              <Link
                key={m.name}
                to="/member/$slug"
                params={{ slug: slugify(m.name) }}
                className="group relative flex flex-col items-start gap-6 border border-hairline bg-card/40 p-8 transition-colors hover:border-silver/50"
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
            ))}
          </div>
        </div>
      </section>

      {/* Teams */}
      <section id="teams" className="hairline-t">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeader index="02" label="Teams" title="Every team, every member." />

          <div className="mt-16 flex flex-col gap-24">
            {teams.map((team, i) => (
              <div key={team.id} className="relative">
                <div className="mb-8 flex items-end justify-between gap-6 hairline-b pb-4">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      Team / {String(i + 1).padStart(2, "0")} · {team.code}
                    </div>
                    <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                      {team.name}
                    </h3>
                  </div>
                  <div className="hidden font-mono text-xs text-muted-foreground md:block">
                    {team.members.length + 1} members
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <MemberCard member={team.head} index={1} isHead />
                  {team.members.map((m, idx) => (
                    <MemberCard key={m.name} member={m} index={idx + 2} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="hairline-t">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeader index="03" label="Events" title="What's on the schedule." />
          <div className="mt-12 grid gap-px border border-hairline bg-hairline md:grid-cols-2">
            {events.map((e) => {
              const d = new Date(e.date);
              const day = d.toLocaleDateString("en-US", { day: "2-digit" });
              const mon = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
              const yr = d.getFullYear();
              return (
                <article
                  key={e.id}
                  className="group relative flex gap-6 bg-background p-6 transition-colors hover:bg-card/40"
                >
                  <div className="flex w-20 shrink-0 flex-col items-center border border-hairline p-3">
                    <div className="font-display text-3xl leading-none">{day}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-widest text-silver">
                      {mon}
                    </div>
                    <div className="mt-2 font-mono text-[10px] text-muted-foreground">{yr}</div>
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
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="hairline-t">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeader index="04" label="Contact" title="Reach the club." />
          <div className="mt-12 grid gap-px border border-hairline bg-hairline md:grid-cols-3">
            <ContactCard
              label="Email"
              value="hello@vertex.club"
              href="mailto:hello@vertex.club"
            />
            <ContactCard
              label="Instagram"
              value="@vertex.club"
              href="https://instagram.com/vertex.club"
            />
            <ContactCard
              label="Location"
              value="Vertex HQ · Tech Block"
              href="#"
            />
          </div>

          <form
            className="mt-12 grid gap-4 border border-hairline bg-card/40 p-6 md:grid-cols-2"
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
                className="border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
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
                className="border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
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
                className="resize-none border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="border border-silver bg-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-background transition-opacity hover:opacity-90"
              >
                Send message →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="hairline-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <VertexLogo className="h-8 w-auto" />
            <div>
              <div className="font-display text-xl font-semibold">Vertex</div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Technical Club · Est. 2026
              </div>
            </div>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} Vertex — All members listed above.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-6">
      <div className="font-display text-4xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function ContactCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex flex-col gap-3 bg-background p-6 transition-colors hover:bg-card/40"
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

function SectionHeader({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>{index}</span>
        <span className="inline-block h-px w-10 bg-hairline" />
        <span>{label}</span>
      </div>
      <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
