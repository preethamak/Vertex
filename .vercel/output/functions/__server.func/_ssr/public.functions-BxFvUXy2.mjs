import { n as createServerFn } from "./server-BSMaBSks.mjs";
import { c as stringType, o as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-BjESbmfp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public.functions-BxFvUXy2.js
var SELECTED_INDEPENDENT_WORK = [
	{
		id: "selected-guardrails",
		slug: "guardrails",
		title: "GuardRails",
		description: "A security-first developer environment that brings code scanning into the editing loop.",
		tech: [
			"TypeScript",
			"VS Code",
			"Security"
		],
		cover_url: null,
		link: "https://github.com/preethamak/GuardRails-IDE",
		year: 2026
	},
	{
		id: "selected-vyper-guard",
		slug: "vyper-guard",
		title: "Vyper Guard",
		description: "Static analysis tooling for finding security issues in Vyper smart contracts.",
		tech: [
			"Python",
			"Vyper",
			"Static analysis"
		],
		cover_url: null,
		link: "https://github.com/preethamak/vyper",
		year: 2026
	},
	{
		id: "selected-codelab",
		slug: "codelab",
		title: "CodeLab",
		description: "A browser-based coding evaluation platform with isolated execution and assessment workflows.",
		tech: [
			"React",
			"FastAPI",
			"Docker"
		],
		cover_url: null,
		link: "https://github.com/preethamak/CodeLab1",
		year: 2025
	}
];
var getAnnouncements_createServerFn_handler = createServerRpc({
	id: "fdd1cca3b64d73935eb97749b0435714580a598e12d174ef26445767bdfcfb1a",
	name: "getAnnouncements",
	filename: "src/lib/public.functions.ts"
}, (opts) => getAnnouncements.__executeServer(opts));
var getAnnouncements = createServerFn({ method: "GET" }).handler(getAnnouncements_createServerFn_handler, async () => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const sb = serverPublicClient();
	const [feed, teams] = await Promise.all([sb.from("announcements").select("id, title, body, team_id, pinned, created_at").eq("published", true).order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(60), sb.from("teams").select("id, name").order("sort_order")]);
	return {
		items: feed.data ?? [],
		teams: teams.data ?? []
	};
});
var getShowcase_createServerFn_handler = createServerRpc({
	id: "2623930af5eedc83103708fc3da33538db40f0253efaa5b7ca98822e87750ffc",
	name: "getShowcase",
	filename: "src/lib/public.functions.ts"
}, (opts) => getShowcase.__executeServer(opts));
var getShowcase = createServerFn({ method: "GET" }).handler(getShowcase_createServerFn_handler, async () => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const sb = serverPublicClient();
	const [projects, contributors, members, teams] = await Promise.all([
		sb.from("projects").select("id, slug, title, description, tech, cover_url, link, year").eq("published", true).order("year", { ascending: false }),
		sb.from("project_contributors").select("project_id, member_id"),
		sb.from("members").select("id, slug, name, role, team_id, photo_url"),
		sb.from("teams").select("id, name").order("sort_order")
	]);
	return {
		projects: [...projects.data ?? [], ...SELECTED_INDEPENDENT_WORK],
		contributors: contributors.data ?? [],
		members: members.data ?? [],
		teams: teams.data ?? []
	};
});
var getMemberExtras_createServerFn_handler = createServerRpc({
	id: "c7b2e6d78ac6598a7954a60d092575ac8b164bbe7750f291d1d17871685a9263",
	name: "getMemberExtras",
	filename: "src/lib/public.functions.ts"
}, (opts) => getMemberExtras.__executeServer(opts));
var getMemberExtras = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ slug: stringType().min(1).max(80) }).parse(input)).handler(getMemberExtras_createServerFn_handler, async ({ data }) => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const sb = serverPublicClient();
	const { data: member } = await sb.from("members").select("id").eq("slug", data.slug).maybeSingle();
	if (!member) return {
		badges: [],
		achievements: [],
		projects: []
	};
	const [badgeRows, achievements, contributions] = await Promise.all([
		sb.from("member_badges").select("badge_id, note, awarded_on, badges(name, description, icon)").eq("member_id", member.id),
		sb.from("achievements").select("id, title, description, happened_on").eq("member_id", member.id).order("happened_on", { ascending: false }),
		sb.from("project_contributors").select("projects(id, slug, title, year, published)").eq("member_id", member.id)
	]);
	return {
		badges: (badgeRows.data ?? []).map((b) => ({
			id: b.badge_id,
			name: b.badges?.name ?? b.badge_id,
			description: b.badges?.description ?? null,
			icon: b.badges?.icon ?? "award",
			note: b.note,
			awardedOn: b.awarded_on
		})),
		achievements: achievements.data ?? [],
		projects: (contributions.data ?? []).map((c) => c.projects).filter((p) => Boolean(p && p.published))
	};
});
var getMentorPool_createServerFn_handler = createServerRpc({
	id: "3cd0b8f4f3dfeb8da1eb8f527df2f603f768c706cbc4ca3633853356c5ee1c16",
	name: "getMentorPool",
	filename: "src/lib/public.functions.ts"
}, (opts) => getMentorPool.__executeServer(opts));
var getMentorPool = createServerFn({ method: "GET" }).handler(getMentorPool_createServerFn_handler, async () => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const sb = serverPublicClient();
	const [members, teams] = await Promise.all([sb.from("members").select("id, slug, name, role, team_id, photo_url, skills, bio, is_head, is_leadership").order("sort_order"), sb.from("teams").select("id, name").order("sort_order")]);
	return {
		members: members.data ?? [],
		teams: teams.data ?? []
	};
});
//#endregion
export { getAnnouncements_createServerFn_handler, getMemberExtras_createServerFn_handler, getMentorPool_createServerFn_handler, getShowcase_createServerFn_handler };
