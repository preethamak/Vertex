import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getAnnouncements = createServerFn({ method: "GET" }).handler(async () => {
  const { serverPublicClient } = await import("@/lib/supabase-public.server");
  const sb = serverPublicClient();
  const [feed, teams] = await Promise.all([
    sb
      .from("announcements")
      .select("id, title, body, team_id, pinned, created_at")
      .eq("published", true)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60),
    sb.from("teams").select("id, name").order("sort_order"),
  ]);
  return { items: feed.data ?? [], teams: teams.data ?? [] };
});

export const getShowcase = createServerFn({ method: "GET" }).handler(async () => {
  const { serverPublicClient } = await import("@/lib/supabase-public.server");
  const sb = serverPublicClient();
  const [projects, contributors, members, teams] = await Promise.all([
    sb
      .from("projects")
      .select("id, slug, title, description, tech, cover_url, link, year")
      .eq("published", true)
      .order("year", { ascending: false }),
    sb.from("project_contributors").select("project_id, member_id"),
    sb.from("members").select("id, slug, name, role, team_id, photo_url"),
    sb.from("teams").select("id, name").order("sort_order"),
  ]);
  return {
    projects: projects.data ?? [],
    contributors: contributors.data ?? [],
    members: members.data ?? [],
    teams: teams.data ?? [],
  };
});

export const getMemberExtras = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(80) }).parse(input))
  .handler(async ({ data }) => {
    const { serverPublicClient } = await import("@/lib/supabase-public.server");
    const sb = serverPublicClient();
    const { data: member } = await sb.from("members").select("id").eq("slug", data.slug).maybeSingle();
    if (!member) return { badges: [], achievements: [], projects: [] };

    const [badgeRows, achievements, contributions] = await Promise.all([
      sb.from("member_badges").select("badge_id, note, awarded_on, badges(name, description, icon)").eq("member_id", member.id),
      sb
        .from("achievements")
        .select("id, title, description, happened_on")
        .eq("member_id", member.id)
        .order("happened_on", { ascending: false }),
      sb.from("project_contributors").select("projects(id, slug, title, year, published)").eq("member_id", member.id),
    ]);

    return {
      badges: (badgeRows.data ?? []).map((b) => ({
        id: b.badge_id,
        name: b.badges?.name ?? b.badge_id,
        description: b.badges?.description ?? null,
        icon: b.badges?.icon ?? "award",
        note: b.note,
        awardedOn: b.awarded_on,
      })),
      achievements: achievements.data ?? [],
      projects: (contributions.data ?? [])
        .map((c) => c.projects)
        .filter((p): p is { id: string; slug: string; title: string; year: number | null; published: boolean } =>
          Boolean(p && p.published),
        ),
    };
  });

export const getMentorPool = createServerFn({ method: "GET" }).handler(async () => {
  const { serverPublicClient } = await import("@/lib/supabase-public.server");
  const sb = serverPublicClient();
  const [members, teams] = await Promise.all([
    sb
      .from("members")
      .select("id, slug, name, role, team_id, photo_url, skills, bio, is_head, is_leadership")
      .order("sort_order"),
    sb.from("teams").select("id, name").order("sort_order"),
  ]);
  return { members: members.data ?? [], teams: teams.data ?? [] };
});
