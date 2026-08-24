import { n as createServerFn } from "./server-BSMaBSks.mjs";
import { c as stringType, o as objectType, r as enumType } from "../_libs/zod.mjs";
import { d as memberInput, g as requireSupabaseAuth, h as projectInput, i as eventInput, n as badgeAwardInput, t as announcementInput } from "./schemas-D623IdKD.mjs";
import { t as createServerRpc } from "./createServerRpc-BjESbmfp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-xvc0bNgz.js
var getViewer_createServerFn_handler = createServerRpc({
	id: "abd3f40b5905dba10259216c0028ef1b8c18a56f854cd5318ca86fb2de9a4850",
	name: "getViewer",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getViewer.__executeServer(opts));
var getViewer = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getViewer_createServerFn_handler, async ({ context }) => {
	const { loadViewer } = await import("./roles.server-KUZ4Ph49.mjs");
	return loadViewer(context.supabase, context.userId);
});
var adminOverview_createServerFn_handler = createServerRpc({
	id: "65dbdd42678d4cf3348f8143806993df600c6d6e2d11eded1594324413609a95",
	name: "adminOverview",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(adminOverview_createServerFn_handler, async ({ context }) => {
	const { assertStaff } = await import("./roles.server-KUZ4Ph49.mjs");
	const viewer = await assertStaff(context.supabase, context.userId);
	const sb = context.supabase;
	const [apps, members, teams, events, projects, announcements, regs] = await Promise.all([
		sb.from("applications").select("*").order("created_at", { ascending: false }),
		sb.from("members").select("*").order("sort_order"),
		sb.from("teams").select("*").order("sort_order"),
		sb.from("events").select("*").order("event_date", { ascending: false }),
		sb.from("projects").select("*").order("year", { ascending: false }),
		sb.from("announcements").select("*").order("created_at", { ascending: false }),
		sb.from("event_registrations").select("id, event_id, name, email, usn, code, checked_in_at, created_at").order("created_at", { ascending: false })
	]);
	return {
		viewer,
		applications: apps.data ?? [],
		members: members.data ?? [],
		teams: teams.data ?? [],
		events: events.data ?? [],
		projects: projects.data ?? [],
		announcements: announcements.data ?? [],
		registrations: regs.data ?? []
	};
});
var setApplicationStatus_createServerFn_handler = createServerRpc({
	id: "dd2a8c89ce3736258bb458077f853a2565c444665a699be34aede0a82db3cbaf",
	name: "setApplicationStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setApplicationStatus.__executeServer(opts));
var setApplicationStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"new",
		"shortlisted",
		"accepted",
		"rejected"
	]),
	notes: stringType().trim().max(2e3).nullable()
}).parse(input)).handler(setApplicationStatus_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("applications").update({
		status: data.status,
		notes: data.notes
	}).eq("id", data.id);
	if (error) throw new Error("Could not update that application.");
	return { ok: true };
});
var saveMember_createServerFn_handler = createServerRpc({
	id: "c07ee71ae67327ae81b23a75041ec0a74c5c69438e800798807d1d27de13438c",
	name: "saveMember",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveMember.__executeServer(opts));
var saveMember = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => memberInput.parse(input)).handler(saveMember_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const row = {
		slug: data.slug,
		name: data.name,
		role: data.role,
		team_id: data.teamId,
		is_head: data.isHead,
		is_leadership: data.isLeadership,
		photo_url: data.photoUrl,
		bio: data.bio,
		skills: data.skills,
		links: data.links,
		sort_order: data.sortOrder
	};
	const { error } = await (data.id ? context.supabase.from("members").update(row).eq("id", data.id) : context.supabase.from("members").insert(row));
	if (error) throw new Error(error.code === "23505" ? "A member with that link name already exists." : "Could not save the member.");
	return { ok: true };
});
var deleteMember_createServerFn_handler = createServerRpc({
	id: "c918f2dd87a2ffa258d05da90727329acdcabdb4199e7ff55651f703f4792eea",
	name: "deleteMember",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteMember.__executeServer(opts));
var deleteMember = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(deleteMember_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const { error } = await context.supabase.from("members").delete().eq("id", data.id);
	if (error) throw new Error("Could not remove that member.");
	return { ok: true };
});
var saveEvent_createServerFn_handler = createServerRpc({
	id: "a18765086123a1b90d8c7e5177ac19c654a51bdd4cfe62a68d4b9368a7c6b862",
	name: "saveEvent",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveEvent.__executeServer(opts));
var saveEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => eventInput.parse(input)).handler(saveEvent_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const row = {
		slug: data.slug,
		title: data.title,
		event_date: data.eventDate,
		start_time: data.startTime,
		location: data.location,
		tag: data.tag,
		description: data.description,
		cover_url: data.coverUrl,
		capacity: data.capacity,
		published: data.published
	};
	const { error } = await (data.id ? context.supabase.from("events").update(row).eq("id", data.id) : context.supabase.from("events").insert(row));
	if (error) throw new Error(error.code === "23505" ? "That event already exists — same link name, or same title on the same date." : "Could not save the event.");
	return { ok: true };
});
var saveProject_createServerFn_handler = createServerRpc({
	id: "ea98b929abfe26e270171c8d6865179b152abf07048060620df7abd2a5ffe5f3",
	name: "saveProject",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveProject.__executeServer(opts));
var saveProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => projectInput.parse(input)).handler(saveProject_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const row = {
		slug: data.slug,
		title: data.title,
		description: data.description,
		tech: data.tech,
		cover_url: data.coverUrl,
		link: data.link,
		year: data.year,
		published: data.published
	};
	const res = data.id ? await context.supabase.from("projects").update(row).eq("id", data.id).select("id").single() : await context.supabase.from("projects").insert(row).select("id").single();
	if (res.error || !res.data) throw new Error(res.error?.code === "23505" ? "A project with that link name already exists." : "Could not save the project.");
	const projectId = res.data.id;
	await context.supabase.from("project_contributors").delete().eq("project_id", projectId);
	if (data.contributorIds.length > 0) await context.supabase.from("project_contributors").insert(data.contributorIds.map((memberId) => ({
		project_id: projectId,
		member_id: memberId
	})));
	return { ok: true };
});
var saveAnnouncement_createServerFn_handler = createServerRpc({
	id: "1389361846863de4e90f05e73e83611660fe88d28f6c6086f35017a0c29aca96",
	name: "saveAnnouncement",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveAnnouncement.__executeServer(opts));
var saveAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => announcementInput.parse(input)).handler(saveAnnouncement_createServerFn_handler, async ({ data, context }) => {
	const { assertStaff } = await import("./roles.server-KUZ4Ph49.mjs");
	const viewer = await assertStaff(context.supabase, context.userId);
	if (!viewer.isAdmin && (!data.teamId || !viewer.headTeams.includes(data.teamId))) throw new Error("Heads can only post to their own team.");
	const row = {
		title: data.title,
		body: data.body,
		team_id: data.teamId,
		pinned: data.pinned,
		published: data.published,
		author_id: context.userId
	};
	const { error } = await (data.id ? context.supabase.from("announcements").update(row).eq("id", data.id) : context.supabase.from("announcements").insert(row));
	if (error) throw new Error("Could not post that announcement.");
	return { ok: true };
});
var deleteAnnouncement_createServerFn_handler = createServerRpc({
	id: "7aed836ca3c7d5eabd427603c60172c5d3b24a35045c8bb62b7a4a95365aadf2",
	name: "deleteAnnouncement",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteAnnouncement.__executeServer(opts));
var deleteAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(deleteAnnouncement_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("announcements").delete().eq("id", data.id);
	if (error) throw new Error("Could not delete that announcement.");
	return { ok: true };
});
var checkInByCode_createServerFn_handler = createServerRpc({
	id: "74396d79369d1dc9ad1ac5ee0aa50d92c93f34f1c450d27648c84912b3712e7c",
	name: "checkInByCode",
	filename: "src/lib/admin.functions.ts"
}, (opts) => checkInByCode.__executeServer(opts));
var checkInByCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ code: stringType().trim().min(4).max(200) }).parse(input)).handler(checkInByCode_createServerFn_handler, async ({ data, context }) => {
	const { assertStaff } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertStaff(context.supabase, context.userId);
	const code = data.code.trim().split("/").pop() ?? data.code.trim();
	const { data: reg, error } = await context.supabase.from("event_registrations").select("id, name, email, checked_in_at, event_id, events(title, event_date)").eq("code", code).maybeSingle();
	if (error || !reg) return { status: "invalid" };
	if (reg.checked_in_at) return {
		status: "already",
		name: reg.name,
		event: reg.events?.title ?? "",
		at: reg.checked_in_at
	};
	const { error: upErr } = await context.supabase.from("event_registrations").update({
		checked_in_at: (/* @__PURE__ */ new Date()).toISOString(),
		checked_in_by: context.userId
	}).eq("id", reg.id);
	if (upErr) throw new Error("Could not record that check-in.");
	return {
		status: "ok",
		name: reg.name,
		event: reg.events?.title ?? "",
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var awardBadge_createServerFn_handler = createServerRpc({
	id: "ac17ee71de988c3e9289df3e8a418abf7d6d3997c2492e75893c3c8be3f53737",
	name: "awardBadge",
	filename: "src/lib/admin.functions.ts"
}, (opts) => awardBadge.__executeServer(opts));
var awardBadge = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => badgeAwardInput.parse(input)).handler(awardBadge_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const { error } = await context.supabase.from("member_badges").upsert({
		member_id: data.memberId,
		badge_id: data.badgeId,
		note: data.note
	});
	if (error) throw new Error("Could not award that badge.");
	return { ok: true };
});
var revokeBadge_createServerFn_handler = createServerRpc({
	id: "9e799f128d5e8530fe0456c717276aca0c5f2b00262ac0a2ba2669b7b118778a",
	name: "revokeBadge",
	filename: "src/lib/admin.functions.ts"
}, (opts) => revokeBadge.__executeServer(opts));
var revokeBadge = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	memberId: stringType().uuid(),
	badgeId: stringType().min(1).max(60)
}).parse(input)).handler(revokeBadge_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const { error } = await context.supabase.from("member_badges").delete().eq("member_id", data.memberId).eq("badge_id", data.badgeId);
	if (error) throw new Error("Could not remove that badge.");
	return { ok: true };
});
var finalizeUpload_createServerFn_handler = createServerRpc({
	id: "f974a7103f7ddf748d05c6f2b8c4ebe6385cc84f321e5fdd7b203eb2f0afd7c2",
	name: "finalizeUpload",
	filename: "src/lib/admin.functions.ts"
}, (opts) => finalizeUpload.__executeServer(opts));
var finalizeUpload = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ path: stringType().trim().min(3).max(400) }).parse(input)).handler(finalizeUpload_createServerFn_handler, async ({ data }) => {
	return {
		url: `/api/public/media/${data.path}`,
		path: data.path
	};
});
var uploadMedia_createServerFn_handler = createServerRpc({
	id: "e81a989fea9c7fe6d1562da3cf5cda6feba4be56ab88613ae645731732309162",
	name: "uploadMedia",
	filename: "src/lib/admin.functions.ts"
}, (opts) => uploadMedia.__executeServer(opts));
var uploadMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	folder: stringType().trim().regex(/^[a-z0-9-]{2,40}$/),
	ext: stringType().trim().regex(/^[a-z0-9]{2,5}$/),
	contentType: stringType().trim().regex(/^image\/[a-z0-9.+-]{2,20}$/),
	base64: stringType().min(16).max(14e6)
}).parse(input)).handler(uploadMedia_createServerFn_handler, async ({ data }) => {
	const binary = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
	if (binary.byteLength > 8388608) throw new Error("That image is too large.");
	const path = `${data.folder}/${crypto.randomUUID()}.${data.ext}`;
	const { supabaseAdmin } = await import("./client.server-DV608Anp.mjs");
	const { error } = await supabaseAdmin.storage.from("media").upload(path, binary, {
		contentType: data.contentType,
		cacheControl: "31536000",
		upsert: false
	});
	if (error) throw new Error("Could not store that image.");
	return {
		url: `/api/public/media/${path}`,
		path
	};
});
//#endregion
export { adminOverview_createServerFn_handler, awardBadge_createServerFn_handler, checkInByCode_createServerFn_handler, deleteAnnouncement_createServerFn_handler, deleteMember_createServerFn_handler, finalizeUpload_createServerFn_handler, getViewer_createServerFn_handler, revokeBadge_createServerFn_handler, saveAnnouncement_createServerFn_handler, saveEvent_createServerFn_handler, saveMember_createServerFn_handler, saveProject_createServerFn_handler, setApplicationStatus_createServerFn_handler, uploadMedia_createServerFn_handler };
