import { i as getServerFnById, n as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-BSMaBSks.mjs";
import { c as stringType, o as objectType, r as enumType } from "../_libs/zod.mjs";
import { a as hackathonDeckUploadInput, c as hackathonSubmissionInput, g as requireSupabaseAuth, l as hackathonTeamUpdateInput, m as milestoneInput, o as hackathonProblemStatementInput, r as eventAnnouncementInput, s as hackathonRegisterInput, u as hackathonWorkspaceInput } from "./schemas-D623IdKD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-B5odfqXC.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/hackathon.functions-DcMTSn9O.js
var getHackathon = createServerFn({ method: "GET" }).handler(createSsrRpc("315b37bd70257c77dacf0ec0f75535b5fab54bb8afd70d93bf5f8c1eb0bbdc5a"));
var registerHackathonTeam = createServerFn({ method: "POST" }).inputValidator((input) => hackathonRegisterInput.parse(input)).handler(createSsrRpc("d95be992206c2b1b9f88b9135594f7b43e560a5e641f31d19336d28079a60d08"));
var getHackathonTeam = createServerFn({ method: "POST" }).inputValidator((input) => objectType({ token: stringType().trim().min(10).max(120) }).parse(input)).handler(createSsrRpc("1a5e5a1cf5803238a5c7226cd57ab689388e5ed4868e50ac7524e8988e73ff95"));
var updateHackathonTeam = createServerFn({ method: "POST" }).inputValidator((input) => hackathonTeamUpdateInput.parse(input)).handler(createSsrRpc("83fc6212c1709483048e7809e44ac9d1844537789df1f9dbdf2633fa07bc37f8"));
var saveHackathonSubmission = createServerFn({ method: "POST" }).inputValidator((input) => hackathonSubmissionInput.parse(input)).handler(createSsrRpc("85cd74950566ce6fbd4e8a93beafc455df652dc4f5367f59b1a2bae5fc3050d4"));
var uploadHackathonDeck = createServerFn({ method: "POST" }).inputValidator((input) => hackathonDeckUploadInput.parse(input)).handler(createSsrRpc("723f1fa9349adce5c808261b30d8c4dd36ac81d213e1b201d40f6759fbd39727"));
var checkInHackathonTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ code: stringType().trim().min(8).max(240) }).parse(input)).handler(createSsrRpc("c86bb559543af313a1ca8ede430c0de96f22ee9ade61f9e7f91926c062b1534c"));
var hackathonAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("75e0c94c45356348a33e707511c793cad21b6e95ffc4c6aa17e4c8bfc3abd3c4"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => hackathonWorkspaceInput.parse(input)).handler(createSsrRpc("07f6ca7c10aa19c69df06e63cbb56101aeb6b5bc84f4ba14d763ebe0b6a58c98"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => milestoneInput.parse(input)).handler(createSsrRpc("11b020e44f5087a0d37f7e08b916186f752e29caa1a0749ca7d261cd2cd819bc"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("37aabd23f070657249dcc5808effdcd6af57d5d8208448f0fe697dd50529493b"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => eventAnnouncementInput.parse(input)).handler(createSsrRpc("f9c589e6b9ae7b59eb21832096933934c1028884571546887c5b9afddbb409fd"));
var saveHackathonProblemStatement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => hackathonProblemStatementInput.parse(input)).handler(createSsrRpc("c9cc1d651bdb020a12b8841956953a63119442fd0f77c6d2b85ab93477f1ee45"));
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
}).parse(input)).handler(createSsrRpc("4c0c6fb0a0ee27ae153b8a1a651484e9bad2ebc28632522777cc2d200100ea9f"));
//#endregion
export { registerHackathonTeam as a, setHackathonTeamStatus as c, createSsrRpc as d, hackathonAdmin as i, updateHackathonTeam as l, getHackathon as n, saveHackathonProblemStatement as o, getHackathonTeam as r, saveHackathonSubmission as s, checkInHackathonTeam as t, uploadHackathonDeck as u };
