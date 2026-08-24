import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Route$12 } from "./router-BgH94mqf.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/announcements-CPBLZhDj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnnouncementsPage() {
	const { items, teams } = Route$12.useLoaderData();
	const [team, setTeam] = (0, import_react.useState)("all");
	const teamName = (0, import_react.useMemo)(() => new Map(teams.map((t) => [t.id, t.name])), [teams]);
	const feed = items.filter((a) => team === "all" || (a.team_id ?? "club") === team);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-backdrop opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-4xl px-6 py-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-px w-8 bg-silver" }), "Feed"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl",
							children: "Announcements."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 flex flex-wrap gap-2",
							children: [
								{
									id: "all",
									name: "Everything"
								},
								{
									id: "club",
									name: "Club-wide"
								},
								...teams
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTeam(t.id),
								className: `border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${team === t.id ? "border-silver text-foreground" : "border-hairline text-muted-foreground hover:border-silver"}`,
								children: t.name
							}, t.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-col gap-px border border-hairline bg-hairline",
							children: [feed.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "bg-background p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "border border-hairline px-2 py-0.5 text-silver",
												children: a.team_id ? teamName.get(a.team_id) ?? a.team_id : "Club-wide"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(a.created_at).toDateString() }),
											a.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-silver",
												children: "· Pinned"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 font-display text-2xl font-semibold leading-tight",
										children: a.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground",
										children: a.body
									})
								]
							}, a.id)), feed.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-background p-8 font-mono text-xs text-muted-foreground",
								children: "Nothing posted here yet."
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { AnnouncementsPage as component };
