import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route$2 } from "./router-BgH94mqf.mjs";
import { t as VertexLogo } from "./VertexLogo-0I7ekk9v.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { c as Link2, g as ArrowUpRight, h as Award, m as BriefcaseBusiness } from "../_libs/lucide-react.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
import { r as SpotlightCard, t as Avatar } from "./SpotlightCard-Bbmix81R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/member._slug-CUIg8gTQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MemberProfile() {
	const { member, teammates, extras } = Route$2.useLoaderData();
	const [url, setUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setUrl(window.location.href);
	}, []);
	const share = async () => {
		if (navigator.share) try {
			await navigator.share({
				title: `${member.name} — Vertex`,
				text: `${member.name} · ${member.team ?? "Vertex"}`,
				url
			});
		} catch {}
		else navigator.clipboard?.writeText(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "hairline-b sticky top-0 z-40 bg-background/80 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VertexLogo, { className: "h-6 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-semibold tracking-tight",
							children: "Vertex"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground",
						children: "← Roster"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-backdrop opacity-40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-x-0 top-0 h-[420px]",
						style: { background: "radial-gradient(ellipse at 50% 0%, oklch(0.18 0 0) 0%, transparent 60%)" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-5xl px-6 py-16 md:py-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-px w-8 bg-silver" }),
								member.team ?? "Vertex",
								" · ",
								member.isHead ? "Team Head" : member.role
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-12 md:grid-cols-[1fr_auto] md:items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 18
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { duration: .55 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
											name: member.name,
											size: 140,
											photo: member.photo
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
												className: "font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl",
												children: member.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 font-mono text-xs uppercase tracking-widest text-silver",
												children: ["Vertex · ", member.role]
											})]
										})]
									}),
									member.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground",
										children: member.bio
									}),
									member.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-8 flex flex-wrap gap-2",
										children: member.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
											children: s
										}, s))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-10 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												label: "Team",
												value: member.team ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												label: "Role",
												value: member.isHead ? "Head" : member.role
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												label: "ID",
												value: member.slug.slice(0, 8).toUpperCase()
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: share,
											className: "border border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-foreground transition-colors hover:border-silver hover:bg-card",
											children: "Share profile"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => navigator.clipboard?.writeText(url),
											className: "border border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-silver hover:text-foreground",
											children: "Copy link"
										})]
									}),
									Object.keys(member.links).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
											children: "Elsewhere"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 flex flex-wrap gap-2",
											children: Object.entries(member.links).map(([label, href]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex items-center gap-2 border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-silver hover:text-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { size: 12 }),
													" ",
													socialLabel(label, href),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 12 })
												]
											}, label))
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									scale: .96
								},
								animate: {
									opacity: 1,
									scale: 1
								},
								transition: {
									duration: .5,
									delay: .12
								},
								className: "glass-panel rounded-2xl p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
											children: "QR · Scan to open"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[10px] text-silver",
											children: ["V.", member.slug.slice(0, 4).toUpperCase()]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-white p-4",
										children: url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
											value: url,
											size: 192,
											bgColor: "#ffffff",
											fgColor: "#000000",
											level: "M"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
										children: "Point a camera → land on this profile."
									})
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-hairline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 13 }), " Project work"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-2",
						children: [extras.projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/projects",
							className: "group flex items-center justify-between border border-hairline bg-card/40 p-4 transition-colors hover:border-silver",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg",
								children: project.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] text-muted-foreground",
								children: [project.year ?? "", " →"]
							})]
						}) }, project.id)), extras.projects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Project work will appear here when it is credited in the club showcase."
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { size: 13 }), " Record"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-2",
						children: [
							extras.achievements.map((achievement) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg",
									children: achievement.title
								}), achievement.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: achievement.description
								})]
							}) }, achievement.id)),
							extras.badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg",
									children: badge.name
								}), badge.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: badge.note
								})]
							}) }, badge.id)),
							extras.achievements.length === 0 && extras.badges.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Achievements will appear here as the club records them."
							})
						]
					})] })]
				})
			}),
			teammates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "hairline-t",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl px-6 py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-8 flex items-end justify-between gap-4 hairline-b pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
							children: ["Also on ", member.team ?? "Vertex"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl font-semibold tracking-tight",
							children: "Teammates"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3",
						children: teammates.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/member/$slug",
							params: { slug: m.slug },
							className: "flex items-center gap-4 border border-hairline bg-card/40 p-4 transition-colors hover:border-silver/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								name: m.name,
								size: 48,
								photo: m.photo
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-base",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: m.role
							})] })]
						}, m.slug))
					})]
				})
			})
		]
	});
}
function socialLabel(label, href) {
	const lower = `${label} ${href}`.toLowerCase();
	if (lower.includes("linkedin")) return "LinkedIn";
	if (lower.includes("github")) return "GitHub";
	if (lower.includes("instagram")) return "Instagram";
	if (lower.includes("twitter") || lower.includes("x.com")) return "X";
	if (lower.includes("portfolio") || lower.includes("website")) return "Portfolio";
	return label || "Link";
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-background p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-lg tracking-tight",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		})]
	});
}
//#endregion
export { MemberProfile as component };
