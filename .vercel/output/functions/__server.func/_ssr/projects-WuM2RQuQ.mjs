import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Route$7 } from "./router-BgH94mqf.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-WuM2RQuQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectsPage() {
	const { projects, contributors, members, teams } = Route$7.useLoaderData();
	const [team, setTeam] = (0, import_react.useState)("all");
	const [role, setRole] = (0, import_react.useState)("all");
	const memberById = (0, import_react.useMemo)(() => new Map(members.map((m) => [m.id, m])), [members]);
	const roles = (0, import_react.useMemo)(() => Array.from(new Set(members.map((m) => m.role).filter(Boolean))).sort(), [members]);
	const filtered = (0, import_react.useMemo)(() => projects.map((p) => ({
		...p,
		people: contributors.filter((c) => c.project_id === p.id).map((c) => memberById.get(c.member_id)).filter(Boolean)
	})), [
		projects,
		contributors,
		memberById
	]).filter((p) => {
		if (team !== "all" && !p.people.some((m) => m.team_id === team)) return false;
		if (role !== "all" && !p.people.some((m) => m.role === role)) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-backdrop opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-6xl px-6 py-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-px w-8 bg-silver" }), "Selected work"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl",
							children: "Projects."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-sm leading-6 text-muted-foreground",
							children: "A small, honest record of projects we can stand behind. Team credit appears only when it has been recorded."
						}),
						(teams.length > 0 || roles.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
									label: "Team",
									value: team,
									onChange: setTeam,
									options: [{
										value: "all",
										label: "All teams"
									}, ...teams.map((t) => ({
										value: t.id,
										label: t.name
									}))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
									label: "Role",
									value: role,
									onChange: setRole,
									options: [{
										value: "all",
										label: "All roles"
									}, ...roles.map((r) => ({
										value: r,
										label: r
									}))]
								}),
								(team !== "all" || role !== "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setTeam("all");
										setRole("all");
									},
									className: "border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-silver hover:text-foreground",
									children: "Reset"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 grid gap-px border border-hairline bg-hairline md:grid-cols-2",
							children: [filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "flex flex-col gap-4 bg-background p-6",
								children: [
									p.cover_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.cover_url,
										alt: p.title,
										loading: "lazy",
										className: "h-44 w-full border border-hairline object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-2xl font-semibold leading-tight",
											children: p.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-muted-foreground",
											children: p.year ?? ""
										})]
									}),
									p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: p.description
									}),
									p.tech.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: p.tech.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
											children: t
										}, t))
									}),
									p.people.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest",
										children: p.people.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/member/$slug",
											params: { slug: m.slug },
											className: "text-silver hover:text-foreground",
											children: m.name
										}, m.id))
									}),
									p.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: p.link,
										target: "_blank",
										rel: "noreferrer",
										className: "mt-auto w-fit border border-hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-silver",
										children: "Open project →"
									})
								]
							}, p.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-background p-8 font-mono text-xs text-muted-foreground md:col-span-2",
								children: "No projects match those filters yet."
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Filter({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center gap-2 border border-hairline bg-card/40 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "bg-transparent font-mono text-[11px] text-foreground focus:outline-none",
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: o.value,
				className: "bg-background",
				children: o.label
			}, o.value))
		})]
	});
}
//#endregion
export { ProjectsPage as component };
