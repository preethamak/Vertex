import { r as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { R as redirect, V as notFound, _ as createRootRouteWithContext, b as useRouter, d as HeadContent, g as createFileRoute, h as lazyRouteComponent, m as Outlet, p as createRouter, u as Scripts, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createServerFn, o as __exportAll } from "./server-BSMaBSks.mjs";
import { c as stringType, i as literalType, o as objectType, r as enumType } from "../_libs/zod.mjs";
import { d as memberInput, f as memberSelfInput, g as requireSupabaseAuth, h as projectInput, i as eventInput, n as badgeAwardInput, p as mentorRequestInput, t as announcementInput } from "./schemas-D623IdKD.mjs";
import { d as createSsrRpc, n as getHackathon } from "./hackathon.functions-DcMTSn9O.mjs";
import { t as supabase } from "./client-BqAKV5t-.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-D5RrtMBg.js
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("abd3f40b5905dba10259216c0028ef1b8c18a56f854cd5318ca86fb2de9a4850"));
var adminOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("65dbdd42678d4cf3348f8143806993df600c6d6e2d11eded1594324413609a95"));
var setApplicationStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"new",
		"shortlisted",
		"accepted",
		"rejected"
	]),
	notes: stringType().trim().max(2e3).nullable()
}).parse(input)).handler(createSsrRpc("dd2a8c89ce3736258bb458077f853a2565c444665a699be34aede0a82db3cbaf"));
var saveMember = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => memberInput.parse(input)).handler(createSsrRpc("c07ee71ae67327ae81b23a75041ec0a74c5c69438e800798807d1d27de13438c"));
var deleteMember = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("c918f2dd87a2ffa258d05da90727329acdcabdb4199e7ff55651f703f4792eea"));
var saveEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => eventInput.parse(input)).handler(createSsrRpc("a18765086123a1b90d8c7e5177ac19c654a51bdd4cfe62a68d4b9368a7c6b862"));
var saveProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => projectInput.parse(input)).handler(createSsrRpc("ea98b929abfe26e270171c8d6865179b152abf07048060620df7abd2a5ffe5f3"));
var saveAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => announcementInput.parse(input)).handler(createSsrRpc("1389361846863de4e90f05e73e83611660fe88d28f6c6086f35017a0c29aca96"));
var deleteAnnouncement = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("7aed836ca3c7d5eabd427603c60172c5d3b24a35045c8bb62b7a4a95365aadf2"));
var checkInByCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ code: stringType().trim().min(4).max(200) }).parse(input)).handler(createSsrRpc("74396d79369d1dc9ad1ac5ee0aa50d92c93f34f1c450d27648c84912b3712e7c"));
var awardBadge = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => badgeAwardInput.parse(input)).handler(createSsrRpc("ac17ee71de988c3e9289df3e8a418abf7d6d3997c2492e75893c3c8be3f53737"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	memberId: stringType().uuid(),
	badgeId: stringType().min(1).max(60)
}).parse(input)).handler(createSsrRpc("9e799f128d5e8530fe0456c717276aca0c5f2b00262ac0a2ba2669b7b118778a"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ path: stringType().trim().min(3).max(400) }).parse(input)).handler(createSsrRpc("f974a7103f7ddf748d05c6f2b8c4ebe6385cc84f321e5fdd7b203eb2f0afd7c2"));
var uploadMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	folder: stringType().trim().regex(/^[a-z0-9-]{2,40}$/),
	ext: stringType().trim().regex(/^[a-z0-9]{2,5}$/),
	contentType: stringType().trim().regex(/^image\/[a-z0-9.+-]{2,20}$/),
	base64: stringType().min(16).max(14e6)
}).parse(input)).handler(createSsrRpc("e81a989fea9c7fe6d1562da3cf5cda6feba4be56ab88613ae645731732309162"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/club.functions-B4k2opzM.js
var getDirectory = createServerFn({ method: "GET" }).handler(createSsrRpc("1de6554cf9a3a8844899305af3f2472885a37a529b5cecd109d3cc290adffb2e"));
var getEvents = createServerFn({ method: "GET" }).handler(createSsrRpc("1aeab4936b03f9db2e1eb62b26de91ec0e68fe02999e3ff150a1aa83b1701c69"));
createServerFn({ method: "GET" }).handler(createSsrRpc("1b5b74872eb0bf431b9205f006cf918d06e49822c4742b4ea87f21b91ff8ee8f"));
createServerFn({ method: "GET" }).handler(createSsrRpc("fb5702f5e1298815283b0c124e1533f2a19a2d05880a0bd17e0f32aed3e008d5"));
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
var submitApplication = createServerFn({ method: "POST" }).inputValidator((input) => applicationSchema.parse(input)).handler(createSsrRpc("626e5e725c543fe7bb8b2e155270d3d1187ec6b59879e7c3bc807b93e79f8ffc"));
var registrationSchema = objectType({
	eventSlug: stringType().trim().min(1).max(80),
	name: stringType().trim().min(2).max(100),
	email: stringType().trim().email().max(160),
	phone: stringType().trim().max(30).optional().or(literalType("")),
	usn: stringType().trim().max(40).optional().or(literalType(""))
});
var registerForEvent = createServerFn({ method: "POST" }).inputValidator((input) => registrationSchema.parse(input)).handler(createSsrRpc("3ea66db66939812643ce4b4cbfa48bd5c18884d5106cb85c82d10d0a7d9c5aac"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/public.functions-CychlYzk.js
var getAnnouncements = createServerFn({ method: "GET" }).handler(createSsrRpc("fdd1cca3b64d73935eb97749b0435714580a598e12d174ef26445767bdfcfb1a"));
var getShowcase = createServerFn({ method: "GET" }).handler(createSsrRpc("2623930af5eedc83103708fc3da33538db40f0253efaa5b7ca98822e87750ffc"));
var getMemberExtras = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ slug: stringType().min(1).max(80) }).parse(input)).handler(createSsrRpc("c7b2e6d78ac6598a7954a60d092575ac8b164bbe7750f291d1d17871685a9263"));
createServerFn({ method: "GET" }).handler(createSsrRpc("3cd0b8f4f3dfeb8da1eb8f527df2f603f768c706cbc4ca3633853356c5ee1c16"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BgH94mqf.js
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-C2IehoX6.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Vertex — Technical Club" },
			{
				name: "description",
				content: "Vertex is a college technical club. Meet the founders, leadership, and every team that runs it."
			},
			{
				name: "theme-color",
				content: "#faf7f0"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$13 = () => import("./routes-BC9NRJG0.mjs");
var Route$14 = createFileRoute("/")({
	loader: () => getEvents(),
	head: () => ({ meta: [{ title: "Vertex — Technical Club" }, {
		name: "description",
		content: "Vertex is a student technical club."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./route-Di7iQBCH.mjs");
var Route$13 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitErrorComponentImporter$6 = () => import("./announcements-BEH7lAhK.mjs");
var $$splitComponentImporter$11 = () => import("./announcements-CPBLZhDj.mjs");
var Route$12 = createFileRoute("/announcements")({
	loader: () => getAnnouncements(),
	head: () => ({ meta: [
		{ title: "Announcements — Vertex Technical Club" },
		{
			name: "description",
			content: "Club-wide and per-team announcements from Vertex heads: deadlines, meets, calls for help."
		},
		{
			property: "og:title",
			content: "Announcements — Vertex Technical Club"
		},
		{
			property: "og:description",
			content: "The Vertex announcement feed, straight from the team heads."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$6, "errorComponent")
});
var $$splitComponentImporter$10 = () => import("./auth-CkTyrtFm.mjs");
var Route$11 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — Vertex" },
		{
			name: "description",
			content: "Vertex members sign in to manage their profile, applications, and event check-ins."
		},
		{
			property: "og:title",
			content: "Sign in — Vertex"
		},
		{
			property: "og:description",
			content: "Member access for the Vertex technical club."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./events-Bh-cUjKB.mjs");
var Route$10 = createFileRoute("/events")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitErrorComponentImporter$5 = () => import("./join-DEcBDYag.mjs");
var $$splitComponentImporter$8 = () => import("./join-3LImwFgb.mjs");
var Route$9 = createFileRoute("/join")({
	loader: () => getDirectory(),
	head: () => ({ meta: [
		{ title: "Join Vertex — Apply to a team" },
		{
			name: "description",
			content: "Applications for Vertex are open. Pick two teams, tell us what you want to build, and we'll get back to you."
		},
		{
			property: "og:title",
			content: "Join Vertex — Apply to a team"
		},
		{
			property: "og:description",
			content: "Apply to Technical, Media, Events, PR, or Sponsorship at Vertex."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$5, "errorComponent")
});
var $$splitComponentImporter$7 = () => import("./members-CLi4Tf98.mjs");
var Route$8 = createFileRoute("/members")({
	loader: () => getDirectory(),
	head: () => ({ meta: [{ title: "Members — Vertex Technical Club" }, {
		name: "description",
		content: "Meet the people building Vertex."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitErrorComponentImporter$4 = () => import("./projects-BbbLNgBS.mjs");
var $$splitComponentImporter$6 = () => import("./projects-WuM2RQuQ.mjs");
var Route$7 = createFileRoute("/projects")({
	loader: () => getShowcase(),
	head: () => ({ meta: [
		{ title: "Projects — Vertex Technical Club" },
		{
			name: "description",
			content: "Selected work and Vertex projects."
		},
		{
			property: "og:title",
			content: "Projects — Vertex Technical Club"
		},
		{
			property: "og:description",
			content: "Selected work and Vertex projects."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$4, "errorComponent")
});
var $$splitErrorComponentImporter$3 = () => import("./admin-BRiyBqtR.mjs");
var $$splitComponentImporter$5 = () => import("./admin-CgIHxDhD.mjs");
var Route$6 = createFileRoute("/_authenticated/admin")({
	loader: () => adminOverview(),
	head: () => ({ meta: [
		{ title: "Admin console — Vertex" },
		{
			name: "description",
			content: "Manage the Vertex roster, events, projects, and door check-in."
		},
		{
			property: "og:title",
			content: "Admin console — Vertex"
		},
		{
			property: "og:description",
			content: "Vertex staff tools."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent")
});
var myDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b0705bdd82e56db2e73d9e8ca958a31ba63d696b34bd030fec9a730f21b7828f"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => memberSelfInput.parse(input)).handler(createSsrRpc("c0f7c2ca92dbe4705ebe47afaad595711dff48695f6cf98e16b21d10c9736fef"));
var myMentorships = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8d460d7b20a82b59558628b4680fe83abf021c66851604b07cd66ca961e9d09c"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => mentorRequestInput.parse(input)).handler(createSsrRpc("b2df155459cc94208e8eab35d800bfa1eb36661d192b155ed02a531c4f3bce9a"));
var respondMentorship = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"pending",
		"accepted",
		"declined",
		"closed"
	])
}).parse(input)).handler(createSsrRpc("052f30363672a6d3cdc672b71265d987539b72a8c17c026f9d5ea90416fbe1e4"));
var $$splitErrorComponentImporter$2 = () => import("./me-DzCfkTYE.mjs");
var $$splitComponentImporter$4 = () => import("./me-BoSohzxv.mjs");
var Route$5 = createFileRoute("/_authenticated/me")({
	loader: async () => {
		const [dashboard, mentorships] = await Promise.all([myDashboard(), myMentorships()]);
		return {
			dashboard,
			mentorships
		};
	},
	head: () => ({ meta: [
		{ title: "My profile — Vertex" },
		{
			name: "description",
			content: "Update your Vertex profile photo, bio, and skills."
		},
		{
			property: "og:title",
			content: "My profile — Vertex"
		},
		{
			property: "og:description",
			content: "Member dashboard for the Vertex technical club."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
var $$splitErrorComponentImporter$1 = () => import("./events.index-DizrOHqF.mjs");
var $$splitComponentImporter$3 = () => import("./events.index-WotpVJ88.mjs");
var Route$4 = createFileRoute("/events/")({
	loader: () => getEvents(),
	head: () => ({ meta: [
		{ title: "Events — Vertex Technical Club" },
		{
			name: "description",
			content: "Hackathons, workshops, launch nights, and mixers run by Vertex. Register and get a scannable entry pass."
		},
		{
			property: "og:title",
			content: "Events — Vertex Technical Club"
		},
		{
			property: "og:description",
			content: "Register for Vertex events and get a scannable entry pass."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
var $$splitComponentImporter$2 = () => import("./events.sih-internal-hackathon-BEoDAhmC.mjs");
var Route$3 = createFileRoute("/events/sih-internal-hackathon")({
	loader: () => getHackathon(),
	head: () => ({ meta: [{ title: "SIH Internal Hackathon — Vertex" }, {
		name: "description",
		content: "The official Vertex workspace for SIH Internal Hackathon teams, submissions, milestones, and updates."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitErrorComponentImporter = () => import("./member._slug-Cz3rjRot.mjs");
var $$splitNotFoundComponentImporter = () => import("./member._slug-kzKpUlGC.mjs");
var $$splitComponentImporter$1 = () => import("./member._slug-CUIg8gTQ.mjs");
var Route$2 = createFileRoute("/member/$slug")({
	loader: async ({ params }) => {
		const directory = await getDirectory();
		const member = directory.all.find((m) => m.slug === params.slug);
		if (!member) throw notFound();
		return {
			member,
			teammates: directory.all.filter((m) => m.teamId === member.teamId && m.slug !== member.slug).slice(0, 6),
			extras: await getMemberExtras({ data: { slug: params.slug } })
		};
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [
		{ title: `${loaderData.member.name} — Vertex` },
		{
			name: "description",
			content: `${loaderData.member.name} · ${loaderData.member.team ?? "Vertex"} · ${loaderData.member.role}`
		},
		{
			property: "og:title",
			content: `${loaderData.member.name} — Vertex`
		},
		{
			property: "og:description",
			content: `${loaderData.member.name} · ${loaderData.member.team ?? "Vertex"} · ${loaderData.member.role}`
		},
		{
			property: "og:type",
			content: "profile"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] : [{ title: "Member — Vertex" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
var $$splitComponentImporter = () => import("./events.sih-internal-hackathon.team-iIyx_X4N.mjs");
var Route$1 = createFileRoute("/events/sih-internal-hackathon/team")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TYPES = {
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	webp: "image/webp",
	gif: "image/gif",
	svg: "image/svg+xml",
	pdf: "application/pdf"
};
var Route = createFileRoute("/api/public/media/$")({ server: { handlers: { GET: async ({ params }) => {
	const path = params._splat ?? "";
	if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
	const { supabaseAdmin } = await import("./client.server-DV608Anp.mjs");
	const { data, error } = await supabaseAdmin.storage.from("media").download(path);
	if (error || !data) return new Response("Not found", { status: 404 });
	const ext = path.split(".").pop()?.toLowerCase() ?? "";
	const buffer = await data.arrayBuffer();
	return new Response(buffer, { headers: {
		"Content-Type": data.type || TYPES[ext] || "application/octet-stream",
		"Cache-Control": "public, max-age=31536000, immutable"
	} });
} } } });
var IndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var AuthenticatedRouteRoute = Route$13.update({
	id: "/_authenticated",
	getParentRoute: () => Route$15
});
var AnnouncementsRoute = Route$12.update({
	id: "/announcements",
	path: "/announcements",
	getParentRoute: () => Route$15
});
var AuthRoute = Route$11.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$15
});
var EventsRoute = Route$10.update({
	id: "/events",
	path: "/events",
	getParentRoute: () => Route$15
});
var JoinRoute = Route$9.update({
	id: "/join",
	path: "/join",
	getParentRoute: () => Route$15
});
var MembersRoute = Route$8.update({
	id: "/members",
	path: "/members",
	getParentRoute: () => Route$15
});
var ProjectsRoute = Route$7.update({
	id: "/projects",
	path: "/projects",
	getParentRoute: () => Route$15
});
var AuthenticatedAdminRoute = Route$6.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMeRoute = Route$5.update({
	id: "/me",
	path: "/me",
	getParentRoute: () => AuthenticatedRouteRoute
});
var EventsIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => EventsRoute
});
var EventsSihInternalHackathonRoute = Route$3.update({
	id: "/sih-internal-hackathon",
	path: "/sih-internal-hackathon",
	getParentRoute: () => EventsRoute
});
var MemberSlugRoute = Route$2.update({
	id: "/member/$slug",
	path: "/member/$slug",
	getParentRoute: () => Route$15
});
var EventsSihInternalHackathonTeamRoute = Route$1.update({
	id: "/team",
	path: "/team",
	getParentRoute: () => EventsSihInternalHackathonRoute
});
var ApiPublicMediaSplatRoute = Route.update({
	id: "/api/public/media/$",
	path: "/api/public/media/$",
	getParentRoute: () => Route$15
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedMeRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var EventsSihInternalHackathonRouteChildren = { EventsSihInternalHackathonTeamRoute };
var EventsRouteChildren = {
	EventsSihInternalHackathonRoute: EventsSihInternalHackathonRoute._addFileChildren(EventsSihInternalHackathonRouteChildren),
	EventsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AnnouncementsRoute,
	AuthRoute,
	EventsRoute: EventsRoute._addFileChildren(EventsRouteChildren),
	JoinRoute,
	MembersRoute,
	ProjectsRoute,
	MemberSlugRoute,
	ApiPublicMediaSplatRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { saveProject as C, saveMember as S, uploadMedia as T, checkInByCode as _, Route$5 as a, saveAnnouncement as b, Route$6 as c, Route$9 as d, Route$12 as f, awardBadge as g, submitApplication as h, Route$4 as i, Route$7 as l, registerForEvent as m, Route$2 as n, respondMentorship as o, Route$14 as p, Route$3 as r, updateMyProfile as s, router_exports as t, Route$8 as u, deleteAnnouncement as v, setApplicationStatus as w, saveEvent as x, deleteMember as y };
