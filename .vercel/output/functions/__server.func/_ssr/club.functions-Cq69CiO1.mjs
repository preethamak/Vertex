import { n as createServerFn } from "./server-BSMaBSks.mjs";
import { c as stringType, i as literalType, o as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-BjESbmfp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/club.functions-Cq69CiO1.js
function toMember(r, teamName) {
	return {
		id: r.id,
		slug: r.slug,
		name: r.name,
		role: r.role,
		teamId: r.team_id,
		team: teamName,
		isHead: r.is_head,
		isLeadership: r.is_leadership,
		photo: r.photo_url,
		bio: r.bio,
		skills: r.skills ?? [],
		links: r.links ?? {}
	};
}
var getDirectory_createServerFn_handler = createServerRpc({
	id: "1de6554cf9a3a8844899305af3f2472885a37a529b5cecd109d3cc290adffb2e",
	name: "getDirectory",
	filename: "src/lib/club.functions.ts"
}, (opts) => getDirectory.__executeServer(opts));
var getDirectory = createServerFn({ method: "GET" }).handler(getDirectory_createServerFn_handler, async () => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const supabase = serverPublicClient();
	const [teamsRes, membersRes] = await Promise.all([supabase.from("teams").select("*").order("sort_order"), supabase.from("members").select("*").order("sort_order")]);
	if (teamsRes.error) throw teamsRes.error;
	if (membersRes.error) throw membersRes.error;
	const teamRows = teamsRes.data ?? [];
	const rows = membersRes.data ?? [];
	const nameById = new Map(teamRows.map((t) => [t.id, t.name]));
	const all = rows.map((r) => toMember(r, r.team_id ? nameById.get(r.team_id) ?? null : "Leadership"));
	return {
		teams: teamRows.map((t) => {
			const mine = all.filter((m) => m.teamId === t.id);
			return {
				id: t.id,
				name: t.name,
				code: t.code,
				blurb: t.blurb,
				head: mine.find((m) => m.isHead),
				members: mine.filter((m) => !m.isHead)
			};
		}),
		leadership: all.filter((m) => m.isLeadership),
		all
	};
});
var getEvents_createServerFn_handler = createServerRpc({
	id: "1aeab4936b03f9db2e1eb62b26de91ec0e68fe02999e3ff150a1aa83b1701c69",
	name: "getEvents",
	filename: "src/lib/club.functions.ts"
}, (opts) => getEvents.__executeServer(opts));
var getEvents = createServerFn({ method: "GET" }).handler(getEvents_createServerFn_handler, async () => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const { data, error } = await serverPublicClient().from("events").select("id, slug, title, event_date, start_time, location, tag, description, cover_url").eq("published", true).order("event_date");
	if (error) throw error;
	return data ?? [];
});
var getAchievements_createServerFn_handler = createServerRpc({
	id: "1b5b74872eb0bf431b9205f006cf918d06e49822c4742b4ea87f21b91ff8ee8f",
	name: "getAchievements",
	filename: "src/lib/club.functions.ts"
}, (opts) => getAchievements.__executeServer(opts));
var getAchievements = createServerFn({ method: "GET" }).handler(getAchievements_createServerFn_handler, async () => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const { data, error } = await serverPublicClient().from("achievements").select("id, title, description, happened_on").order("happened_on", { ascending: false });
	if (error) throw error;
	return data ?? [];
});
var getProjects_createServerFn_handler = createServerRpc({
	id: "fb5702f5e1298815283b0c124e1533f2a19a2d05880a0bd17e0f32aed3e008d5",
	name: "getProjects",
	filename: "src/lib/club.functions.ts"
}, (opts) => getProjects.__executeServer(opts));
var getProjects = createServerFn({ method: "GET" }).handler(getProjects_createServerFn_handler, async () => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const { data, error } = await serverPublicClient().from("projects").select("id, slug, title, description, tech, cover_url, link, year").eq("published", true).order("year", { ascending: false });
	if (error) throw error;
	return data ?? [];
});
var applicationSchema = objectType({
	name: stringType().trim().min(2).max(100),
	usn: stringType().trim().max(40).optional().or(literalType("")),
	year: stringType().trim().max(20).optional().or(literalType("")),
	branch: stringType().trim().max(80).optional().or(literalType("")),
	email: stringType().trim().email().max(160),
	phone: stringType().trim().max(30).optional().or(literalType("")),
	teamFirst: stringType().trim().max(40),
	teamSecond: stringType().trim().max(40).optional().or(literalType("")),
	why: stringType().trim().min(10).max(2e3),
	links: stringType().trim().max(500).optional().or(literalType(""))
});
var submitApplication_createServerFn_handler = createServerRpc({
	id: "626e5e725c543fe7bb8b2e155270d3d1187ec6b59879e7c3bc807b93e79f8ffc",
	name: "submitApplication",
	filename: "src/lib/club.functions.ts"
}, (opts) => submitApplication.__executeServer(opts));
var submitApplication = createServerFn({ method: "POST" }).inputValidator((input) => applicationSchema.parse(input)).handler(submitApplication_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-DV608Anp.mjs");
	const { error } = await supabaseAdmin.from("applications").insert({
		name: data.name,
		usn: data.usn || null,
		year: data.year || null,
		branch: data.branch || null,
		email: data.email,
		phone: data.phone || null,
		team_first: data.teamFirst || null,
		team_second: data.teamSecond || null,
		why: data.why,
		links: data.links || null
	});
	if (error) throw new Error("Could not submit your application. Try again.");
	return { ok: true };
});
var registrationSchema = objectType({
	eventSlug: stringType().trim().min(1).max(80),
	name: stringType().trim().min(2).max(100),
	email: stringType().trim().email().max(160),
	phone: stringType().trim().max(30).optional().or(literalType("")),
	usn: stringType().trim().max(40).optional().or(literalType(""))
});
var registerForEvent_createServerFn_handler = createServerRpc({
	id: "3ea66db66939812643ce4b4cbfa48bd5c18884d5106cb85c82d10d0a7d9c5aac",
	name: "registerForEvent",
	filename: "src/lib/club.functions.ts"
}, (opts) => registerForEvent.__executeServer(opts));
var registerForEvent = createServerFn({ method: "POST" }).inputValidator((input) => registrationSchema.parse(input)).handler(registerForEvent_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-DV608Anp.mjs");
	const { data: event, error: eventError } = await supabaseAdmin.from("events").select("id, title, event_date, location").eq("slug", data.eventSlug).eq("published", true).maybeSingle();
	if (eventError || !event) throw new Error("That event is not open for registration.");
	const { data: row, error } = await supabaseAdmin.from("event_registrations").insert({
		event_id: event.id,
		name: data.name,
		email: data.email,
		phone: data.phone || null,
		usn: data.usn || null
	}).select("code").single();
	if (error) throw new Error("Could not save your registration. Try again.");
	return {
		code: row.code,
		event: {
			title: event.title,
			date: event.event_date,
			location: event.location
		}
	};
});
//#endregion
export { getAchievements_createServerFn_handler, getDirectory_createServerFn_handler, getEvents_createServerFn_handler, getProjects_createServerFn_handler, registerForEvent_createServerFn_handler, submitApplication_createServerFn_handler };
