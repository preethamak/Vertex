import { r as getRequest } from "./server-BSMaBSks.mjs";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { a as numberType, c as stringType, i as literalType, n as booleanType, o as objectType, r as enumType, s as recordType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schemas-D623IdKD.js
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const SUPABASE_URL = process.env["SUPABASE_URL"];
	const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"];
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	const authHeader = request.headers.get("authorization");
	if (!authHeader) throw new Error("Unauthorized: No authorization header provided");
	if (!authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Only Bearer tokens are supported");
	const token = authHeader.replace("Bearer ", "");
	if (!token) throw new Error("Unauthorized: No token provided");
	if (token.split(".").length !== 3) throw new Error("Unauthorized: Invalid token");
	const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: {
			fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
			headers: { Authorization: `Bearer ${token}` }
		},
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data, error } = await supabase.auth.getClaims(token);
	if (error || !data?.claims) throw new Error("Unauthorized: Invalid token");
	if (!data.claims.sub) throw new Error("Unauthorized: No user ID found in token");
	return next({ context: {
		supabase,
		userId: data.claims.sub,
		claims: data.claims
	} });
});
var memberInput = objectType({
	id: stringType().uuid().optional(),
	name: stringType().trim().min(2).max(100),
	slug: stringType().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
	role: stringType().trim().min(2).max(80),
	teamId: stringType().trim().max(40).nullable(),
	isHead: booleanType(),
	isLeadership: booleanType(),
	photoUrl: stringType().trim().max(1e3).nullable(),
	bio: stringType().trim().max(2e3).nullable(),
	skills: arrayType(stringType().trim().min(1).max(40)).max(20),
	links: recordType(stringType(), stringType().trim().max(300)),
	sortOrder: numberType().int().min(0).max(999)
});
var memberSelfInput = objectType({
	bio: stringType().trim().max(2e3).nullable(),
	skills: arrayType(stringType().trim().min(1).max(40)).max(20),
	links: recordType(stringType(), stringType().trim().max(300)),
	photoUrl: stringType().trim().max(1e3).nullable()
});
var eventInput = objectType({
	id: stringType().uuid().optional(),
	slug: stringType().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
	title: stringType().trim().min(2).max(140),
	eventDate: stringType().trim().min(4).max(20),
	startTime: stringType().trim().max(40).nullable(),
	location: stringType().trim().min(1).max(140),
	tag: stringType().trim().min(1).max(40),
	description: stringType().trim().max(2e3).nullable(),
	coverUrl: stringType().trim().max(1e3).nullable(),
	capacity: numberType().int().min(0).max(1e5).nullable(),
	published: booleanType()
});
var projectInput = objectType({
	id: stringType().uuid().optional(),
	slug: stringType().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
	title: stringType().trim().min(2).max(140),
	description: stringType().trim().max(2e3).nullable(),
	tech: arrayType(stringType().trim().min(1).max(40)).max(20),
	coverUrl: stringType().trim().max(1e3).nullable(),
	link: stringType().trim().max(500).nullable(),
	year: numberType().int().min(2e3).max(2100).nullable(),
	published: booleanType(),
	contributorIds: arrayType(stringType().uuid()).max(50)
});
var announcementInput = objectType({
	id: stringType().uuid().optional(),
	title: stringType().trim().min(2).max(160),
	body: stringType().trim().min(2).max(5e3),
	teamId: stringType().trim().max(40).nullable(),
	pinned: booleanType(),
	published: booleanType()
});
var badgeAwardInput = objectType({
	memberId: stringType().uuid(),
	badgeId: stringType().trim().min(1).max(60),
	note: stringType().trim().max(200).nullable()
});
var mentorRequestInput = objectType({
	mentorId: stringType().uuid(),
	topic: stringType().trim().min(3).max(120),
	message: stringType().trim().max(1e3).nullable()
});
var hackathonPerson = objectType({
	name: stringType().trim().min(2).max(100),
	email: stringType().trim().email().max(160),
	gender: enumType([
		"female",
		"male",
		"prefer_not_to_say"
	]),
	phone: stringType().trim().max(30).optional().default(""),
	srn: stringType().trim().max(40).optional().default(""),
	branch: stringType().trim().max(80).optional().default(""),
	year: stringType().trim().max(20).optional().default("")
});
var hackathonRegisterInput = objectType({
	name: stringType().trim().min(2).max(100),
	leadName: stringType().trim().min(2).max(100),
	leadEmail: stringType().trim().email().max(160),
	leadGender: enumType([
		"female",
		"male",
		"prefer_not_to_say"
	]),
	leadPhone: stringType().trim().max(30).optional().default(""),
	leadSrn: stringType().trim().max(40).optional().default(""),
	leadBranch: stringType().trim().max(80).optional().default(""),
	leadYear: stringType().trim().max(20).optional().default(""),
	members: arrayType(hackathonPerson).max(10).default([])
});
var hackathonTeamUpdateInput = objectType({
	token: stringType().trim().min(10).max(120),
	name: stringType().trim().min(2).max(100),
	mentorName: stringType().trim().max(100).optional().default(""),
	mentorEmail: stringType().trim().max(160).optional().default(""),
	members: arrayType(hackathonPerson.extend({ isLead: booleanType() })).max(10).default([])
});
var hackathonSubmissionInput = objectType({
	token: stringType().trim().min(10).max(120),
	problemStatementId: stringType().trim().max(60).optional().default(""),
	problemStatementTitle: stringType().trim().max(200).optional().default(""),
	theme: stringType().trim().max(120).optional().default(""),
	solutionTitle: stringType().trim().max(160).optional().default(""),
	solutionSummary: stringType().trim().max(4e3).optional().default(""),
	repositoryUrl: stringType().trim().url().max(500).or(literalType("")).optional().default(""),
	demoUrl: stringType().trim().url().max(500).or(literalType("")).optional().default(""),
	videoUrl: stringType().trim().url().max(500).or(literalType("")).optional().default(""),
	deckPath: stringType().trim().max(500).optional().default(""),
	submit: booleanType().default(false)
});
var hackathonDeckUploadInput = objectType({
	token: stringType().trim().min(10).max(120),
	contentType: literalType("application/pdf"),
	base64: stringType().min(16).max(14e6)
});
var hackathonWorkspaceInput = objectType({
	registrationOpen: booleanType(),
	submissionsOpen: booleanType(),
	minTeamSize: numberType().int().min(1).max(10),
	maxTeamSize: numberType().int().min(1).max(10),
	rules: stringType().trim().max(8e3).nullable()
});
var milestoneInput = objectType({
	id: stringType().uuid().optional(),
	title: stringType().trim().min(2).max(160),
	description: stringType().trim().max(2e3).nullable(),
	startsAt: stringType().trim().max(60).nullable(),
	endsAt: stringType().trim().max(60).nullable(),
	sortOrder: numberType().int().min(0).max(999),
	published: booleanType()
});
var eventAnnouncementInput = objectType({
	title: stringType().trim().min(2).max(160),
	body: stringType().trim().min(2).max(5e3),
	pinned: booleanType(),
	published: booleanType()
});
var hackathonProblemStatementInput = objectType({
	id: stringType().uuid().optional(),
	statementCode: stringType().trim().min(2).max(80),
	title: stringType().trim().min(5).max(500),
	organization: stringType().trim().max(200).nullable(),
	category: stringType().trim().max(120).nullable(),
	theme: stringType().trim().max(160).nullable(),
	description: stringType().trim().max(12e3).nullable(),
	sourceUrl: stringType().trim().url().max(500).nullable(),
	sourceVersion: stringType().trim().max(120).nullable(),
	published: booleanType(),
	sortOrder: numberType().int().min(0).max(9999)
});
//#endregion
export { hackathonDeckUploadInput as a, hackathonSubmissionInput as c, memberInput as d, memberSelfInput as f, requireSupabaseAuth as g, projectInput as h, eventInput as i, hackathonTeamUpdateInput as l, milestoneInput as m, badgeAwardInput as n, hackathonProblemStatementInput as o, mentorRequestInput as p, eventAnnouncementInput as r, hackathonRegisterInput as s, announcementInput as t, hackathonWorkspaceInput as u };
