import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Route$8 } from "./router-BgH94mqf.mjs";
import { o as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
import { n as Reveal, t as Atmosphere } from "./Reveal-DtdgCDKJ.mjs";
import { n as MemberCard, r as SpotlightCard, t as Avatar } from "./SpotlightCard-Bbmix81R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/members-CLi4Tf98.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DirectoryExplorer({ directory }) {
	const { all, teams } = directory;
	const [q, setQ] = (0, import_react.useState)("");
	const [team, setTeam] = (0, import_react.useState)("all");
	const [role, setRole] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("team");
	const roles = (0, import_react.useMemo)(() => {
		const set = new Set(all.map((m) => m.role).filter(Boolean));
		return Array.from(set).sort();
	}, [all]);
	const results = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		const list = all.filter((m) => {
			if (team !== "all" && (m.teamId ?? "leadership") !== team) return false;
			if (role !== "all" && m.role !== role) return false;
			if (!query) return true;
			return m.name.toLowerCase().includes(query) || (m.team ?? "").toLowerCase().includes(query) || m.role.toLowerCase().includes(query) || m.skills.some((s) => s.toLowerCase().includes(query));
		});
		const byName = (a, b) => a.name.localeCompare(b.name);
		if (sort === "name") return [...list].sort(byName);
		if (sort === "role") return [...list].sort((a, b) => a.role.localeCompare(b.role) || byName(a, b));
		return [...list].sort((a, b) => (a.team ?? "").localeCompare(b.team ?? "") || Number(b.isHead) - Number(a.isHead) || byName(a, b));
	}, [
		all,
		q,
		team,
		role,
		sort
	]);
	const filtering = q.trim() !== "" || team !== "all" || role !== "all" || sort !== "team";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border border-hairline bg-card/40 px-4 py-3 focus-within:border-silver/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
					children: "Search"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Find a member, team, or skill…",
					className: "w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Team",
						value: team,
						onChange: setTeam,
						options: [
							{
								value: "all",
								label: "All teams"
							},
							{
								value: "leadership",
								label: "Leadership"
							},
							...teams.map((t) => ({
								value: t.id,
								label: t.name
							}))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Sort",
						value: sort,
						onChange: (v) => setSort(v),
						options: [
							{
								value: "team",
								label: "By team"
							},
							{
								value: "name",
								label: "A → Z"
							},
							{
								value: "role",
								label: "By role"
							}
						]
					}),
					filtering && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setQ("");
							setTeam("all");
							setRole("all");
							setSort("team");
						},
						className: "border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-silver hover:text-foreground",
						children: "Reset"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [
							results.length,
							" / ",
							all.length
						]
					})
				]
			}),
			filtering && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-px border border-hairline bg-hairline sm:grid-cols-2",
				children: [results.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/member/$slug",
					params: { slug: m.slug },
					className: "flex items-center gap-3 bg-background p-3 hover:bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							name: m.name,
							size: 40,
							photo: m.photo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-sm",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: [
									m.team ?? "Vertex",
									" · ",
									m.role
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted-foreground",
							children: "→"
						})
					]
				}, m.slug)), results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-background p-6 font-mono text-xs text-muted-foreground sm:col-span-2",
					children: "Nobody matches those filters."
				})]
			})
		]
	});
}
function Select({ label, value, onChange, options }) {
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
function MembersPage() {
	const directory = Route$8.useLoaderData();
	const [activeTeamId, setActiveTeamId] = (0, import_react.useState)(directory.teams[0]?.id ?? "");
	const activeTeam = directory.teams.find((team) => team.id === activeTeamId) ?? directory.teams[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden border-b border-hairline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atmosphere, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto max-w-6xl px-6 py-20 md:py-28",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.25em] text-silver",
							children: "Vertex collective"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-silver-gradient mt-4 max-w-4xl font-display text-6xl tracking-[-0.065em] md:text-8xl",
							children: "Meet Vertex."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-lg text-base leading-7 text-muted-foreground",
							children: "The people who run the club and make the work happen."
						})
					] })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-6 py-14 md:py-20",
				children: [
					directory.leadership.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
						children: "Leadership"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: directory.leadership.map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: index * .04,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberCard, {
								member,
								index: index + 1,
								isHead: true
							}) })
						}, member.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
								children: "Teams"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex gap-2 overflow-x-auto pb-2",
								children: directory.teams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setActiveTeamId(team.id),
									className: `shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${activeTeam?.id === team.id ? "border-silver bg-black/[0.04] text-foreground" : "border-hairline text-muted-foreground hover:border-silver"}`,
									children: team.name
								}, team.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "wait",
								children: activeTeam && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									initial: {
										opacity: 0,
										y: 12
									},
									animate: {
										opacity: 1,
										y: 0
									},
									exit: {
										opacity: 0,
										y: -8
									},
									transition: { duration: .28 },
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "p-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-mono text-[10px] uppercase tracking-[0.2em] text-silver",
													children: activeTeam.code
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
													className: "mt-2 font-display text-3xl",
													children: activeTeam.name
												}),
												activeTeam.blurb && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 max-w-xl text-sm leading-6 text-muted-foreground",
													children: activeTeam.blurb
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
												children: [(activeTeam.head ? 1 : 0) + activeTeam.members.length, " members"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
											children: [
												activeTeam.head && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberCard, {
													member: activeTeam.head,
													index: 1,
													isHead: true
												}),
												activeTeam.members.map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberCard, {
													member,
													index: index + 2
												}, member.id)),
												!activeTeam.head && activeTeam.members.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: "Team roster will be added soon."
												})
											]
										})]
									}) })
								}, activeTeam.id)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14 border-t border-hairline pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
							children: "Find someone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryExplorer, { directory })
						})]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { MembersPage as component };
