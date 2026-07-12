import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { VertexLogo } from "@/components/VertexLogo";
import { Avatar } from "@/components/MemberCard";
import { findMember, getAllMembers } from "@/data/team";

export const Route = createFileRoute("/member/$slug")({
  loader: ({ params }) => {
    const member = findMember(params.slug);
    if (!member) throw notFound();
    return { member };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.member.name} — Vertex` },
          {
            name: "description",
            content: `${loaderData.member.name} · ${loaderData.member.team ?? "Vertex"} · ${loaderData.member.role ?? "Member"}`,
          },
        ]
      : [{ title: "Member — Vertex" }, { name: "robots", content: "noindex" }],
  }),
  component: MemberProfile,
  notFoundComponent: MemberNotFound,
});

function MemberNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          404 · Member
        </div>
        <h1 className="mt-4 font-display text-4xl">Not on the roster.</h1>
        <Link
          to="/"
          className="mt-8 inline-block border border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-silver"
        >
          ← Back to Vertex
        </Link>
      </div>
    </div>
  );
}

function MemberProfile() {
  const { member } = Route.useLoaderData();
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const all = getAllMembers();
  const teammates = all
    .filter((m) => m.teamId === member.teamId && m.slug !== member.slug)
    .slice(0, 6);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${member.name} — Vertex`,
          text: `${member.name} · ${member.team}`,
          url,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="hairline-b sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <VertexLogo className="h-6 w-auto" />
            <span className="font-display text-lg font-semibold tracking-tight">
              Vertex
            </span>
          </Link>
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            ← Roster
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-40" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, oklch(0.18 0 0) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="inline-block h-px w-8 bg-silver" />
            {member.team} · {member.isHead ? "Team Head" : member.role}
          </div>

          <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <div className="flex items-start gap-6">
                <Avatar name={member.name} size={140} photo={member.photo} />
                <div className="pt-2">
                  <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                    {member.name}
                  </h1>
                  <div className="mt-3 font-mono text-xs uppercase tracking-widest text-silver">
                    Vertex · {member.role ?? "Member"}
                  </div>
                </div>
              </div>

              {member.bio && (
                <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              )}

              <div className="mt-10 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3">
                <Stat label="Team" value={member.team ?? "—"} />
                <Stat label="Role" value={member.isHead ? "Head" : member.role ?? "Member"} />
                <Stat label="ID" value={member.slug.slice(0, 8).toUpperCase()} />
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <button
                  onClick={share}
                  className="border border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-foreground transition-colors hover:border-silver hover:bg-card"
                >
                  Share profile
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(url)}
                  className="border border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-silver hover:text-foreground"
                >
                  Copy link
                </button>
              </div>
            </div>

            {/* QR */}
            <div className="border border-hairline bg-card/40 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  QR · Scan to open
                </span>
                <span className="font-mono text-[10px] text-silver">V.{member.slug.slice(0, 4).toUpperCase()}</span>
              </div>
              <div className="bg-white p-4">
                {url && (
                  <QRCodeSVG
                    value={url}
                    size={192}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                )}
              </div>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Point a camera → land on this profile.
              </div>
            </div>
          </div>
        </div>
      </section>

      {teammates.length > 0 && (
        <section className="hairline-t">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="mb-8 flex items-end justify-between gap-4 hairline-b pb-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  Also on {member.team}
                </div>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
                  Teammates
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {teammates.map((m) => (
                <Link
                  key={m.slug}
                  to="/member/$slug"
                  params={{ slug: m.slug }}
                  className="flex items-center gap-4 border border-hairline bg-card/40 p-4 transition-colors hover:border-silver/50"
                >
                  <Avatar name={m.name} size={48} photo={m.photo} />
                  <div>
                    <div className="font-display text-base">{m.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.role ?? "Member"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-4">
      <div className="font-display text-lg tracking-tight">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
