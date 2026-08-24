import { n as createServerFn } from "./server-BSMaBSks.mjs";
import { c as stringType, o as objectType, r as enumType } from "../_libs/zod.mjs";
import { a as hackathonDeckUploadInput, c as hackathonSubmissionInput, g as requireSupabaseAuth, l as hackathonTeamUpdateInput, m as milestoneInput, o as hackathonProblemStatementInput, r as eventAnnouncementInput, s as hackathonRegisterInput, u as hackathonWorkspaceInput } from "./schemas-D623IdKD.mjs";
import { t as createServerRpc } from "./createServerRpc-BjESbmfp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hackathon.functions-BMf494wG.js
var EVENT_SLUG = "sih-internal-hackathon";
var OFFICIAL_SIH_TEAM_SIZE = 6;
var getHackathon_createServerFn_handler = createServerRpc({
	id: "315b37bd70257c77dacf0ec0f75535b5fab54bb8afd70d93bf5f8c1eb0bbdc5a",
	name: "getHackathon",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => getHackathon.__executeServer(opts));
var getHackathon = createServerFn({ method: "GET" }).handler(getHackathon_createServerFn_handler, async () => {
	const { serverPublicClient } = await import("./supabase-public.server-C4Z0rfun.mjs");
	const sb = serverPublicClient();
	const { data: event } = await sb.from("events").select("id, slug, title, description, location, tag, event_date, start_time, schedule_tba, cover_url").eq("slug", EVENT_SLUG).eq("published", true).maybeSingle();
	if (!event) return null;
	const [workspace, milestones, announcements, submissions, statements] = await Promise.all([
		sb.from("event_workspaces").select("registration_open, submissions_open, min_team_size, max_team_size, rules").eq("event_id", event.id).eq("published", true).maybeSingle(),
		sb.from("event_milestones").select("id, title, description, starts_at, ends_at, sort_order").eq("event_id", event.id).eq("published", true).order("sort_order"),
		sb.from("event_announcements").select("id, title, body, pinned, created_at").eq("event_id", event.id).eq("published", true).order("pinned", { ascending: false }).order("created_at", { ascending: false }),
		sb.from("hackathon_submissions").select("id, solution_title, solution_summary, theme, problem_statement_title, repository_url, demo_url").eq("published", true),
		sb.from("hackathon_problem_statements").select("id, statement_code, title, organization, category, theme, description, source_url, source_version").eq("event_id", event.id).eq("published", true).order("sort_order").order("statement_code")
	]);
	let roster = [];
	try {
		const { getPublicRoster } = await import("./hackathon.server-DBn-zx-k.mjs");
		roster = await getPublicRoster(event.id);
	} catch (error) {
		console.error("Could not load the public SIH roster", error);
	}
	return {
		event,
		workspace: workspace.data ? {
			...workspace.data,
			min_team_size: OFFICIAL_SIH_TEAM_SIZE,
			max_team_size: OFFICIAL_SIH_TEAM_SIZE
		} : null,
		milestones: milestones.data ?? [],
		announcements: announcements.data ?? [],
		showcase: submissions.data ?? [],
		statements: statements.data ?? [],
		roster
	};
});
var registerHackathonTeam_createServerFn_handler = createServerRpc({
	id: "d95be992206c2b1b9f88b9135594f7b43e560a5e641f31d19336d28079a60d08",
	name: "registerHackathonTeam",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => registerHackathonTeam.__executeServer(opts));
var registerHackathonTeam = createServerFn({ method: "POST" }).inputValidator((input) => hackathonRegisterInput.parse(input)).handler(registerHackathonTeam_createServerFn_handler, async ({ data }) => {
	const { createTeam } = await import("./hackathon.server-DBn-zx-k.mjs");
	return createTeam(data);
});
var getHackathonTeam_createServerFn_handler = createServerRpc({
	id: "1a5e5a1cf5803238a5c7226cd57ab689388e5ed4868e50ac7524e8988e73ff95",
	name: "getHackathonTeam",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => getHackathonTeam.__executeServer(opts));
var getHackathonTeam = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ token: stringType().trim().min(10).max(120) }).parse(input)).handler(getHackathonTeam_createServerFn_handler, async ({ data }) => {
	const { loadTeamByToken } = await import("./hackathon.server-DBn-zx-k.mjs");
	return loadTeamByToken(data.token);
});
var updateHackathonTeam_createServerFn_handler = createServerRpc({
	id: "83fc6212c1709483048e7809e44ac9d1844537789df1f9dbdf2633fa07bc37f8",
	name: "updateHackathonTeam",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => updateHackathonTeam.__executeServer(opts));
var updateHackathonTeam = createServerFn({ method: "POST" }).inputValidator((input) => hackathonTeamUpdateInput.parse(input)).handler(updateHackathonTeam_createServerFn_handler, async ({ data }) => {
	const { updateTeam } = await import("./hackathon.server-DBn-zx-k.mjs");
	return updateTeam(data);
});
var saveHackathonSubmission_createServerFn_handler = createServerRpc({
	id: "85cd74950566ce6fbd4e8a93beafc455df652dc4f5367f59b1a2bae5fc3050d4",
	name: "saveHackathonSubmission",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => saveHackathonSubmission.__executeServer(opts));
var saveHackathonSubmission = createServerFn({ method: "POST" }).inputValidator((input) => hackathonSubmissionInput.parse(input)).handler(saveHackathonSubmission_createServerFn_handler, async ({ data }) => {
	const { saveSubmission } = await import("./hackathon.server-DBn-zx-k.mjs");
	return saveSubmission(data);
});
var uploadHackathonDeck_createServerFn_handler = createServerRpc({
	id: "723f1fa9349adce5c808261b30d8c4dd36ac81d213e1b201d40f6759fbd39727",
	name: "uploadHackathonDeck",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => uploadHackathonDeck.__executeServer(opts));
var uploadHackathonDeck = createServerFn({ method: "POST" }).inputValidator((input) => hackathonDeckUploadInput.parse(input)).handler(uploadHackathonDeck_createServerFn_handler, async ({ data }) => {
	const { storeSubmissionDeck } = await import("./hackathon.server-DBn-zx-k.mjs");
	return storeSubmissionDeck(data);
});
var checkInHackathonTeam_createServerFn_handler = createServerRpc({
	id: "c86bb559543af313a1ca8ede430c0de96f22ee9ade61f9e7f91926c062b1534c",
	name: "checkInHackathonTeam",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => checkInHackathonTeam.__executeServer(opts));
var checkInHackathonTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ code: stringType().trim().min(8).max(240) }).parse(input)).handler(checkInHackathonTeam_createServerFn_handler, async ({ data, context }) => {
	const { assertStaff } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertStaff(context.supabase, context.userId);
	const { checkInHackathonTeam: checkIn } = await import("./hackathon.server-DBn-zx-k.mjs");
	return checkIn(data.code, context.userId);
});
var hackathonAdmin_createServerFn_handler = createServerRpc({
	id: "75e0c94c45356348a33e707511c793cad21b6e95ffc4c6aa17e4c8bfc3abd3c4",
	name: "hackathonAdmin",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => hackathonAdmin.__executeServer(opts));
var hackathonAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(hackathonAdmin_createServerFn_handler, async ({ context }) => {
	const { assertStaff } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertStaff(context.supabase, context.userId);
	const { adminOverviewData } = await import("./hackathon.server-DBn-zx-k.mjs");
	return adminOverviewData();
});
var saveHackathonWorkspace_createServerFn_handler = createServerRpc({
	id: "07f6ca7c10aa19c69df06e63cbb56101aeb6b5bc84f4ba14d763ebe0b6a58c98",
	name: "saveHackathonWorkspace",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => saveHackathonWorkspace.__executeServer(opts));
var saveHackathonWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => hackathonWorkspaceInput.parse(input)).handler(saveHackathonWorkspace_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const { eventId } = await import("./hackathon.server-DBn-zx-k.mjs").then((m) => m.resolveEvent());
	const { error } = await context.supabase.from("event_workspaces").update({
		registration_open: data.registrationOpen,
		submissions_open: data.submissionsOpen,
		min_team_size: OFFICIAL_SIH_TEAM_SIZE,
		max_team_size: OFFICIAL_SIH_TEAM_SIZE,
		rules: data.rules
	}).eq("event_id", eventId);
	if (error) throw new Error("Could not update the hackathon settings.");
	return { ok: true };
});
var saveMilestone_createServerFn_handler = createServerRpc({
	id: "11b020e44f5087a0d37f7e08b916186f752e29caa1a0749ca7d261cd2cd819bc",
	name: "saveMilestone",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => saveMilestone.__executeServer(opts));
var saveMilestone = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => milestoneInput.parse(input)).handler(saveMilestone_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const { eventId } = await import("./hackathon.server-DBn-zx-k.mjs").then((m) => m.resolveEvent());
	const row = {
		event_id: eventId,
		title: data.title,
		description: data.description,
		starts_at: data.startsAt,
		ends_at: data.endsAt,
		sort_order: data.sortOrder,
		published: data.published
	};
	const { error } = data.id ? await context.supabase.from("event_milestones").update(row).eq("id", data.id) : await context.supabase.from("event_milestones").insert(row);
	if (error) throw new Error("Could not save that milestone.");
	return { ok: true };
});
var deleteMilestone_createServerFn_handler = createServerRpc({
	id: "37aabd23f070657249dcc5808effdcd6af57d5d8208448f0fe697dd50529493b",
	name: "deleteMilestone",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => deleteMilestone.__executeServer(opts));
var deleteMilestone = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(deleteMilestone_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const { error } = await context.supabase.from("event_milestones").delete().eq("id", data.id);
	if (error) throw new Error("Could not delete that milestone.");
	return { ok: true };
});
var saveEventAnnouncement_createServerFn_handler = createServerRpc({
	id: "f9c589e6b9ae7b59eb21832096933934c1028884571546887c5b9afddbb409fd",
	name: "saveEventAnnouncement",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => saveEventAnnouncement.__executeServer(opts));
var saveEventAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => eventAnnouncementInput.parse(input)).handler(saveEventAnnouncement_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const { eventId } = await import("./hackathon.server-DBn-zx-k.mjs").then((m) => m.resolveEvent());
	const { error } = await context.supabase.from("event_announcements").insert({
		event_id: eventId,
		title: data.title,
		body: data.body,
		pinned: data.pinned,
		published: data.published
	});
	if (error) throw new Error("Could not post that update.");
	return { ok: true };
});
var saveHackathonProblemStatement_createServerFn_handler = createServerRpc({
	id: "c9cc1d651bdb020a12b8841956953a63119442fd0f77c6d2b85ab93477f1ee45",
	name: "saveHackathonProblemStatement",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => saveHackathonProblemStatement.__executeServer(opts));
var saveHackathonProblemStatement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => hackathonProblemStatementInput.parse(input)).handler(saveHackathonProblemStatement_createServerFn_handler, async ({ data, context }) => {
	const { assertAdmin } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertAdmin(context.supabase, context.userId);
	const { eventId } = await import("./hackathon.server-DBn-zx-k.mjs").then((m) => m.resolveEvent());
	const row = {
		event_id: eventId,
		statement_code: data.statementCode,
		title: data.title,
		organization: data.organization,
		category: data.category,
		theme: data.theme,
		description: data.description,
		source_url: data.sourceUrl,
		source_version: data.sourceVersion,
		published: data.published,
		sort_order: data.sortOrder
	};
	const { error } = data.id ? await context.supabase.from("hackathon_problem_statements").update(row).eq("id", data.id) : await context.supabase.from("hackathon_problem_statements").insert(row);
	if (error) throw new Error("Could not save that problem statement.");
	return { ok: true };
});
var setHackathonTeamStatus_createServerFn_handler = createServerRpc({
	id: "4c0c6fb0a0ee27ae153b8a1a651484e9bad2ebc28632522777cc2d200100ea9f",
	name: "setHackathonTeamStatus",
	filename: "src/lib/hackathon.functions.ts"
}, (opts) => setHackathonTeamStatus.__executeServer(opts));
var setHackathonTeamStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"registered",
		"in_review",
		"shortlisted",
		"selected",
		"waitlisted",
		"rejected",
		"withdrawn"
	])
}).parse(input)).handler(setHackathonTeamStatus_createServerFn_handler, async ({ data, context }) => {
	const { assertStaff } = await import("./roles.server-KUZ4Ph49.mjs");
	await assertStaff(context.supabase, context.userId);
	const { error } = await context.supabase.from("hackathon_teams").update({ status: data.status }).eq("id", data.id);
	if (error) throw new Error("Could not update that team.");
	return { ok: true };
});
//#endregion
export { checkInHackathonTeam_createServerFn_handler, deleteMilestone_createServerFn_handler, getHackathonTeam_createServerFn_handler, getHackathon_createServerFn_handler, hackathonAdmin_createServerFn_handler, registerHackathonTeam_createServerFn_handler, saveEventAnnouncement_createServerFn_handler, saveHackathonProblemStatement_createServerFn_handler, saveHackathonSubmission_createServerFn_handler, saveHackathonWorkspace_createServerFn_handler, saveMilestone_createServerFn_handler, setHackathonTeamStatus_createServerFn_handler, updateHackathonTeam_createServerFn_handler, uploadHackathonDeck_createServerFn_handler };
