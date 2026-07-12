import { Link } from "@tanstack/react-router";
import { initials, slugify, type Member } from "@/data/team";

export function Avatar({
  name,
  size = 72,
  photo,
}: {
  name: string;
  size?: number;
  photo?: string;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border border-hairline bg-secondary"
      style={{ width: size, height: size }}
    >
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, oklch(0.35 0 0) 0%, transparent 55%)",
            }}
          />
          <div className="relative flex h-full w-full items-center justify-center font-mono text-sm tracking-widest text-silver">
            {initials(name)}
          </div>
        </>
      )}
    </div>
  );
}

export function MemberCard({
  member,
  index,
  isHead = false,
}: {
  member: Member;
  index: number;
  isHead?: boolean;
}) {
  const slug = slugify(member.name);
  return (
    <Link
      to="/member/$slug"
      params={{ slug }}
      className="group relative flex items-center gap-4 border border-hairline bg-card/40 p-4 transition-colors hover:border-silver/50 hover:bg-card"
    >
      <Avatar name={member.name} size={56} photo={member.photo} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            {String(index).padStart(2, "0")}
          </span>
          {isHead && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver">
              Head
            </span>
          )}
        </div>
        <div className="font-display text-lg leading-tight text-foreground">
          {member.name}
        </div>
        {member.role && (
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {member.role}
          </div>
        )}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
        View →
      </span>
    </Link>
  );
}
