import { n as createServerFn } from "./server-BSMaBSks.mjs";
import { c as stringType, o as objectType, r as enumType } from "../_libs/zod.mjs";
import { f as memberSelfInput, g as requireSupabaseAuth, p as mentorRequestInput } from "./schemas-D623IdKD.mjs";
import { t as createServerRpc } from "./createServerRpc-BjESbmfp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/member.functions-3BeTfOs1.js
var myDashboard_createServerFn_handler = createServerRpc({
	id: "b0705bdd82e56db2e73d9e8ca958a31ba63d696b34bd030fec9a730f21b7828f",
	name: "myDashboard",
	filename: "src/lib/member.functions.ts"
}, (opts) => myDashboard.__executeServer(opts));
var myDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(myDashboard_createServerFn_handler, async ({ context }) => {
	const { loadViewer } = await import("./roles.server-KUZ4Ph49.mjs");
	const viewer = await loadViewer(context.supabase, context.userId);
	const email = String(context.claims?.email ?? "").toLowerCase();
	const [teamsRes, badgeRes, catalogRes] = await Promise.all([
		context.supabase.from("teams").select("id, name").order("sort_order"),
		viewer.member ? context.supabase.from("member_badges").select("badge_id, note, awarded_on").eq("member_id", viewer.member.id) : Promise.resolve({ data: [] }),
		context.supabase.from("badges").select("id, name, description, icon")
	]);
	let attendance = [];
	if (email) {
		const { supabaseAdmin } = await import("./client.server-DV608Anp.mjs");
		const { data } = await supabaseAdmin.from("event_registrations").select("code, checked_in_at, events(title, event_date)").ilike("email", email).order("created_at", { ascending: false });
		attendance = (data ?? []).map((r) => ({
			event: r.events?.title ?? "Event",
			date: r.events?.event_date ?? "",
			checkedInAt: r.checked_in_at,
			code: r.code
		}));
	}
	return {
		viewer,
		email,
		teams: teamsRes.data ?? [],
		badges: badgeRes.data ?? [],
		badgeCatalog: catalogRes.data ?? [],
		attendance
	};
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "c0f7c2ca92dbe4705ebe47afaad595711dff48695f6cf98e16b21d10c9736fef",
	name: "updateMyProfile",
	filename: "src/lib/member.functions.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => memberSelfInput.parse(input)).handler(updateMyProfile_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("members").update({
		bio: data.bio,
		skills: data.skills,
		links: data.links,
		photo_url: data.photoUrl
	}).eq("user_id", context.userId);
	if (error) throw new Error("Could not save your profile.");
	return { ok: true };
});
var myMentorships_createServerFn_handler = createServerRpc({
	id: "8d460d7b20a82b59558628b4680fe83abf021c66851604b07cd66ca961e9d09c",
	name: "myMentorships",
	filename: "src/lib/member.functions.ts"
}, (opts) => myMentorships.__executeServer(opts));
var myMentorships = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(myMentorships_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("mentorship_requests").select("id, topic, message, status, created_at, mentee_id, mentor_id").order("created_at", { ascending: false });
	if (error) return [];
	return data ?? [];
});
var requestMentor_createServerFn_handler = createServerRpc({
	id: "b2df155459cc94208e8eab35d800bfa1eb36661d192b155ed02a531c4f3bce9a",
	name: "requestMentor",
	filename: "src/lib/member.functions.ts"
}, (opts) => requestMentor.__executeServer(opts));
var requestMentor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => mentorRequestInput.parse(input)).handler(requestMentor_createServerFn_handler, async ({ data, context }) => {
	const { loadViewer } = await import("./roles.server-KUZ4Ph49.mjs");
	const viewer = await loadViewer(context.supabase, context.userId);
	if (!viewer.member) throw new Error("Only listed members can request a mentor.");
	if (viewer.member.id === data.mentorId) throw new Error("Pick someone other than yourself.");
	const { error } = await context.supabase.from("mentorship_requests").insert({
		mentee_id: viewer.member.id,
		mentor_id: data.mentorId,
		topic: data.topic,
		message: data.message
	});
	if (error) throw new Error("Could not send that request.");
	return { ok: true };
});
var respondMentorship_createServerFn_handler = createServerRpc({
	id: "052f30363672a6d3cdc672b71265d987539b72a8c17c026f9d5ea90416fbe1e4",
	name: "respondMentorship",
	filename: "src/lib/member.functions.ts"
}, (opts) => respondMentorship.__executeServer(opts));
var respondMentorship = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"pending",
		"accepted",
		"declined",
		"closed"
	])
}).parse(input)).handler(respondMentorship_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("mentorship_requests").update({ status: data.status }).eq("id", data.id);
	if (error) throw new Error("Could not update that request.");
	return { ok: true };
});
//#endregion
export { myDashboard_createServerFn_handler, myMentorships_createServerFn_handler, requestMentor_createServerFn_handler, respondMentorship_createServerFn_handler, updateMyProfile_createServerFn_handler };
