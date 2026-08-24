import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as Route$14 } from "./router-BgH94mqf.mjs";
import { t as VertexLogo } from "./VertexLogo-0I7ekk9v.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { g as ArrowUpRight, i as UsersRound, n as Wrench, p as CalendarDays } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
import { n as Reveal, t as Atmosphere } from "./Reveal-DtdgCDKJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BC9NRJG0.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const sih = Route$14.useLoaderData().find((event) => event.slug === "sih-internal-hackathon");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen overflow-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-[min(760px,calc(100svh-72px))] overflow-hidden border-b border-hairline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atmosphere, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex min-h-[min(760px,calc(100svh-72px))] max-w-6xl flex-col justify-center px-6 py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .55 },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VertexLogo, { className: "h-11 w-auto text-foreground sm:h-14" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground",
									children: "Technical Club"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-10 max-w-4xl font-display text-6xl font-semibold leading-[0.95] tracking-[-0.035em] sm:text-8xl lg:text-[8rem]",
								children: ["Vertex", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: "."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground",
								children: [
									"A place to learn seriously, make useful things, and find people who care about the",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display italic",
										children: "work"
									}),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-9 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/join",
									className: "btn-primary rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest",
									children: ["Join Vertex ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 15 })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/events",
									className: "btn-ghost rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest",
									children: "See what is happening"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-16 grid max-w-4xl gap-px border border-hairline bg-hairline sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeLink, {
								to: "/join",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { size: 17 }),
								label: "Members",
								detail: "Find your team"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeLink, {
								to: "/projects",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { size: 17 }),
								label: "Work",
								detail: "See what gets built"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeLink, {
								to: "/events",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 17 }),
								label: "Events",
								detail: "Find the next room"
							})
						]
					})]
				})]
			}), sih && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-6xl px-6 py-16 md:py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/events/sih-internal-hackathon",
					className: "group grid overflow-hidden rounded-2xl border border-hairline bg-card shadow-[var(--shadow-soft)] md:grid-cols-[.75fr_1.25fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-h-52 overflow-hidden border-b border-hairline p-6 md:border-b-0 md:border-r",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid-backdrop absolute inset-0 opacity-60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex h-full flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] uppercase tracking-[0.25em] text-silver",
								children: "Now building"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-5xl tracking-[-0.06em] text-foreground",
								children: "SIH"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between p-6 md:p-9",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
								children: "Internal Hackathon"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-3xl tracking-tight md:text-4xl",
								children: sih.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-xl text-sm leading-7 text-muted-foreground",
								children: "Team registration, official SIH themes, rules, submissions, and event-day access in one workspace."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver",
							children: [
								"Open workspace",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
									size: 15,
									className: "transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
								})
							]
						})]
					})]
				}) })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function HomeLink({ to, icon, label, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "group flex items-center gap-4 bg-background p-5 transition-colors hover:bg-black/[0.03]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-silver",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-sm text-foreground",
				children: detail
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
				className: "ml-auto text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground",
				size: 16
			})
		]
	});
}
//#endregion
export { Home as component };
