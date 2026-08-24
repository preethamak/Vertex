import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as registerHackathonTeam } from "./hackathon.functions-DcMTSn9O.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$3 } from "./router-BgH94mqf.mjs";
import { _ as ArrowRight, d as Copy, f as Check, r as Users, u as FileText } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
import { n as Reveal, t as Atmosphere } from "./Reveal-DtdgCDKJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events.sih-internal-hackathon-BEoDAhmC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SIH_2026_THEME_NAMES = [
	"Smart Automation",
	"Fitness & Sports",
	"Space Technology",
	"Heritage & Culture",
	"MedTech / BioTech / HealthTech",
	"Agriculture, FoodTech & Rural Development",
	"Smart Vehicles",
	"Transportation & Logistics",
	"Robotics and Drones",
	"Clean & Green Technology",
	"Tourism",
	"Renewable / Sustainable Energy",
	"Blockchain & Cybersecurity",
	"Smart Education",
	"Disaster Management",
	"Games & Toys",
	"Miscellaneous",
	"Fintech"
];
var SIH_2026_RULES = [
	"A team has exactly 6 student members, including the team leader.",
	"All student members must be from the same college; inter-college teams are not permitted.",
	"Every team must include at least one female member.",
	"The team name must be unique and must not contain the institute name in any form.",
	"Only teams selected through the internal hackathon may be nominated by the college SPOC to SIH.",
	"A team may submit ideas against a maximum of 2 problem statements on the SIH portal.",
	"The team leader must verify the roster, contact details, chosen problem statement, idea title, idea description, and Idea Presentation PDF on the official portal.",
	"Teams selected for the grand finale may include up to 2 industry or academic mentors in addition to the 6 student members."
];
var SIH_2026_SOURCE_URL = "https://www.sih.gov.in/";
var SIH_2026_GUIDELINES_URL = "https://www.sih.gov.in/letters/2026/SIH%202026%20Guidelines.pdf";
var blankPerson = () => ({
	name: "",
	email: "",
	gender: "prefer_not_to_say",
	srn: "",
	branch: "",
	year: "",
	phone: ""
});
function HackathonPage() {
	const data = Route$3.useLoaderData();
	const [registering, setRegistering] = (0, import_react.useState)(false);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-6 py-32 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-muted-foreground",
					children: "Workspace unavailable"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-5xl",
					children: "SIH is being prepared."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
	const { event, workspace, milestones, announcements, statements, roster } = data;
	const registrationOpen = Boolean(workspace?.registration_open);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative overflow-hidden border-b border-hairline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atmosphere, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-28",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "chip rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-silver",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${registrationOpen ? "bg-emerald-300 shadow-[0_0_12px_rgb(110,231,183)]" : "bg-amber-300"}` }), registrationOpen ? "Registration open" : "Registration status pending"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground",
									children: "Vertex presents"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-silver-gradient mt-4 font-display text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-7xl",
									children: [
										"SIH Internal",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"Hackathon."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground",
									children: "Form your team, choose an official problem statement, build the idea, and submit it through one controlled workspace."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-wrap gap-3",
									children: [registrationOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setRegistering(true),
										className: "btn-primary rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest",
										children: ["Register your team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 15 })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "btn-ghost rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
										children: "Registration will open here"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#statements",
										className: "btn-ghost rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest",
										children: "Browse statements"
									})]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-panel edge-highlight rounded-2xl p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
									children: "Event desk"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-5 grid gap-4 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between gap-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: "Location"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "text-right",
												children: event.location
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between gap-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: "Team size"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: workspace ? workspace.min_team_size === workspace.max_team_size ? `Exactly ${workspace.min_team_size} members` : `${workspace.min_team_size}–${workspace.max_team_size} members` : "To be confirmed" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between gap-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: "Problem statements"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: statements.length || "Being verified" })]
										})
									]
								})]
							})]
						})]
					})]
				}),
				registering && workspace && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Registration, {
					workspace,
					onClose: () => setRegistering(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-6 py-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
							number: "01",
							label: "Live desk",
							title: "Every update, in one place."
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 grid gap-5 lg:grid-cols-[1fr_.9fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card rounded-2xl p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 14 }), " Rules"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-4 space-y-3 text-sm leading-6 text-muted-foreground",
										children: SIH_2026_RULES.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-silver" }), rule]
										}, rule))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: SIH_2026_GUIDELINES_URL,
										target: "_blank",
										rel: "noreferrer",
										className: "btn-ghost mt-5 rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-widest",
										children: "Read official SIH guidelines"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-panel rounded-2xl p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 14 }), " Team access"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-sm leading-7 text-muted-foreground",
										children: "Already registered? Open the private team console with the team key you saved at registration."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/events/sih-internal-hackathon/team",
										className: "btn-ghost mt-5 rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest",
										children: ["Open team console ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
									})
								]
							})]
						}),
						(announcements.length > 0 || milestones.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-12 grid gap-8 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Announcements"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-3",
								children: announcements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "surface-card rounded-xl p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-6 text-muted-foreground",
										children: item.body
									})]
								}, item.id))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Timeline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-4 border-l border-hairline pl-5",
								children: milestones.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative pb-6 before:absolute before:-left-[1.4rem] before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-silver",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-[10px] uppercase tracking-widest text-silver",
											children: item.starts_at ? new Date(item.starts_at).toLocaleDateString() : "Date to be announced"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-1 font-display text-lg",
											children: item.title
										}),
										item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted-foreground",
											children: item.description
										})
									]
								}, item.id))
							})] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "statements",
					className: "border-y border-hairline bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-6 py-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
							number: "02",
							label: "Problem statements",
							title: "Choose the right problem, not a random one."
						}) }), statements.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid gap-4 md:grid-cols-2",
							children: statements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "surface-card rounded-2xl p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "chip rounded-md px-2 py-1 font-mono text-[10px] text-silver",
											children: item.statement_code
										}), item.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
											children: item.category
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-5 font-display text-xl leading-tight",
										children: item.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-muted-foreground",
										children: [item.organization, item.theme].filter(Boolean).join(" · ")
									}),
									item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground",
										children: item.description
									})
								]
							}, item.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass-panel mt-10 rounded-2xl p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl",
								children: "Official statements are being verified."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-xl text-sm leading-6 text-muted-foreground",
								children: "Only statements approved by the Vertex SIH desk will appear here. This prevents students from starting on an outdated or unofficial prompt."
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-6 py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
						number: "03",
						label: "Official SIH themes",
						title: "Find the right lane for your idea."
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 flex flex-wrap gap-3",
						children: SIH_2026_THEME_NAMES.map((theme) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: SIH_2026_SOURCE_URL,
							target: "_blank",
							rel: "noreferrer",
							className: "chip rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground",
							children: theme
						}, theme))
					})]
				}),
				roster.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-6 py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
						number: "04",
						label: "Teams",
						title: "The builders in the room."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
						children: roster.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "surface-card rounded-2xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl",
									children: team.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[9px] uppercase tracking-widest text-silver",
									children: team.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: team.members.map((member) => member.name).join(" · ")
							})]
						}, team.id))
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Registration({ workspace, onClose }) {
	const register = useServerFn(registerHackathonTeam);
	const [members, setMembers] = (0, import_react.useState)(() => Array.from({ length: Math.max(0, workspace.min_team_size - 1) }, blankPerson));
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(null);
	const updateMember = (index, key, value) => setMembers((current) => current.map((member, memberIndex) => memberIndex === index ? {
		...member,
		[key]: value
	} : member));
	if (success) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative border-y border-hairline bg-surface-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-3xl px-6 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong rounded-2xl p-7 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mx-auto h-9 w-9 rounded-full bg-emerald-300 p-2 text-black" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-silver",
						children: "Registration confirmed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl",
						children: success.teamName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-7 w-fit rounded-xl bg-white p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
							value: success.checkinCode,
							size: 180,
							bgColor: "#ffffff",
							fgColor: "#000000",
							level: "M"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-lg text-sm leading-6 text-muted-foreground",
						children: "Save this team key now. It opens the private team console. The QR is only for event-day check-in—it cannot edit your team."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => navigator.clipboard.writeText(success.token).then(() => toast.success("Team key copied.")),
							className: "btn-primary rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 14 }), " Copy team key"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/events/sih-internal-hackathon/team",
							className: "btn-ghost rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest",
							children: "Open team console"
						})]
					})
				]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "register",
		className: "border-y border-hairline bg-surface-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-6 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.22em] text-silver",
					children: "Step one"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl",
					children: "Register a team."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground",
					children: "Close"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "glass-panel mt-8 rounded-2xl p-6",
				onSubmit: async (event) => {
					event.preventDefault();
					const form = new FormData(event.currentTarget);
					setSubmitting(true);
					try {
						const result = await register({ data: {
							name: String(form.get("teamName")),
							leadName: String(form.get("leadName")),
							leadEmail: String(form.get("leadEmail")),
							leadGender: String(form.get("leadGender")),
							leadPhone: String(form.get("leadPhone")),
							leadSrn: String(form.get("leadSrn")),
							leadBranch: String(form.get("leadBranch")),
							leadYear: String(form.get("leadYear")),
							members
						} });
						sessionStorage.setItem("vertex-sih-team-key", result.token);
						setSuccess(result);
					} catch (error) {
						toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.");
					} finally {
						setSubmitting(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "teamName",
								label: "Team name",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "leadName",
								label: "Team lead name",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "leadEmail",
								label: "Team lead email",
								type: "email",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenderField, {
								name: "leadGender",
								label: "Lead gender (SIH eligibility)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "leadSrn",
								label: "Lead SRN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "leadPhone",
								label: "Lead phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "leadBranch",
								label: "Lead branch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "leadYear",
								label: "Lead year"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-hairline pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl",
								children: "Team members"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									"Total team size must be exactly ",
									workspace.min_team_size,
									" members, including the lead."
								]
							})] }), members.length < workspace.max_team_size - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMembers((current) => [...current, blankPerson()]),
								className: "btn-ghost rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-widest",
								children: "Add member"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid gap-4",
							children: members.map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card rounded-xl p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[10px] uppercase tracking-widest text-silver",
										children: ["Member ", index + 2]
									}), members.length > Math.max(0, workspace.min_team_size - 1) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMembers((current) => current.filter((_, memberIndex) => memberIndex !== index)),
										className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground",
										children: "Remove"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 md:grid-cols-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
											children: "Gender (SIH eligibility)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: member.gender,
											onChange: (event) => updateMember(index, "gender", event.target.value),
											className: "field-input rounded-lg px-3 py-2 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "prefer_not_to_say",
													children: "Prefer not to say"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "female",
													children: "Female"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "male",
													children: "Male"
												})
											]
										})]
									}), [
										"name",
										"email",
										"srn",
										"branch",
										"year",
										"phone"
									].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
											children: key === "srn" ? "SRN" : key
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: key === "name" || key === "email",
											type: key === "email" ? "email" : "text",
											value: member[key],
											onChange: (event) => updateMember(index, key, event.target.value),
											className: "field-input rounded-lg px-3 py-2 text-sm"
										})]
									}, key))]
								})]
							}, index))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: submitting,
						className: "btn-primary mt-8 rounded-lg px-5 py-3 font-mono text-[11px] uppercase tracking-widest disabled:opacity-50",
						children: [
							submitting ? "Registering…" : "Confirm team registration",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 15 })
						]
					})
				]
			})]
		})
	});
}
function GenderField({ name, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			name,
			defaultValue: "prefer_not_to_say",
			className: "field-input rounded-lg px-3 py-2.5 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "prefer_not_to_say",
					children: "Prefer not to say"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "female",
					children: "Female"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "male",
					children: "Male"
				})
			]
		})]
	});
}
function Field({ name, label, type = "text", required = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			type,
			required,
			className: "field-input rounded-lg px-3 py-2.5 text-sm"
		})]
	});
}
function Eyebrow({ number, label, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground",
		children: [
			number,
			" · ",
			label
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mt-3 font-display text-3xl tracking-tight md:text-4xl",
		children: title
	})] });
}
//#endregion
export { HackathonPage as component };
