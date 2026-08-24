import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { c as setHackathonTeamStatus, i as hackathonAdmin, o as saveHackathonProblemStatement, t as checkInHackathonTeam } from "./hackathon.functions-DcMTSn9O.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as saveProject, S as saveMember, _ as checkInByCode, b as saveAnnouncement, c as Route$6, g as awardBadge, v as deleteAnnouncement, w as setApplicationStatus, x as saveEvent, y as deleteMember } from "./router-BgH94mqf.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
import { t as PhotoUpload } from "./PhotoUpload-BwKCY1_o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CgIHxDhD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"Check-in",
	"SIH",
	"Applications",
	"Members",
	"Events",
	"Projects",
	"Announcements"
];
var slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
function AdminPage() {
	const data = Route$6.useLoaderData();
	const [tab, setTab] = (0, import_react.useState)("Check-in");
	const isAdmin = data.viewer.isAdmin;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-6 py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-px w-8 bg-silver" }),
							isAdmin ? "Admin" : "Team head",
							" console"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 font-display text-4xl font-semibold tracking-tight md:text-6xl",
						children: "Control room."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Applications",
								value: String(data.applications.length)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Members",
								value: String(data.members.length)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Registrations",
								value: String(data.registrations.length)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Checked in",
								value: String(data.registrations.filter((r) => r.checked_in_at).length)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-wrap gap-2",
						children: TABS.filter((t) => isAdmin || t === "Check-in" || t === "SIH" || t === "Applications" || t === "Announcements").map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setTab(t),
							className: `border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${tab === t ? "border-silver text-foreground" : "border-hairline text-muted-foreground hover:border-silver"}`,
							children: t
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [
							tab === "Check-in" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIn, {
								registrations: data.registrations,
								events: data.events
							}),
							tab === "SIH" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SihOperations, { isAdmin }),
							tab === "Applications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Applications, { rows: data.applications }),
							tab === "Members" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Members, {
								members: data.members,
								teams: data.teams
							}),
							tab === "Events" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Events, { events: data.events }),
							tab === "Projects" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projects, {
								projects: data.projects,
								members: data.members
							}),
							tab === "Announcements" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Announcements, {
								rows: data.announcements,
								teams: data.teams,
								isAdmin,
								headTeams: data.viewer.headTeams
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-background p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-3xl font-semibold tracking-tight",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		})]
	});
}
var field = "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none";
var btn = "border border-silver bg-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background disabled:opacity-50";
var ghost = "border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-silver";
function Label({ text, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: text
		}), children]
	});
}
function SihOperations({ isAdmin }) {
	const router = useRouter();
	const load = useServerFn(hackathonAdmin);
	const saveStatement = useServerFn(saveHackathonProblemStatement);
	const setStatus = useServerFn(setHackathonTeamStatus);
	const [data, setData] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			setData(await load());
		} catch {
			toast.error("Could not load SIH operations.");
		}
	}, [load]);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-xs text-muted-foreground",
		children: "Loading SIH operations…"
	});
	const checkedIn = new Set(data.checkins.map((entry) => entry.team_id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Teams",
						value: String(data.teams.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Students",
						value: String(data.members.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Final submissions",
						value: String(data.submissions.filter((entry) => entry.status === "final").length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Checked in",
						value: String(checkedIn.size)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-hairline bg-card/40 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-xl",
					children: "Teams"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-px border border-hairline bg-hairline",
					children: [data.teams.map((team) => {
						const roster = data.members.filter((member) => member.team_id === team.id);
						const submission = data.submissions.find((entry) => entry.team_id === team.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-background p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-lg",
										children: team.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
										children: [
											roster.length,
											"/6 students ·",
											" ",
											checkedIn.has(team.id) ? "checked in" : "not checked in"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: roster.map((member) => `${member.name}${member.is_lead ? " (lead)" : ""}`).join(", ")
									}),
									submission?.solution_title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-silver",
										children: [
											submission.solution_title,
											" · ",
											submission.status
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: team.status,
									onChange: async (event) => {
										try {
											await setStatus({ data: {
												id: team.id,
												status: event.target.value
											} });
											toast.success("Team status updated.");
											await refresh();
											await router.invalidate();
										} catch (error) {
											toast.error(error instanceof Error ? error.message : "Could not update team status.");
										}
									},
									className: field,
									children: [
										"registered",
										"in_review",
										"shortlisted",
										"selected",
										"waitlisted",
										"rejected",
										"withdrawn"
									].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: status,
										className: "bg-background",
										children: status.replaceAll("_", " ")
									}, status))
								})]
							})
						}, team.id);
					}), data.teams.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-background p-4 text-sm text-muted-foreground",
						children: "No SIH teams registered yet."
					})]
				})]
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-5 border border-hairline bg-card/40 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl",
						children: "Official problem statements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Paste only statements verified against the official SIH release. Publishing makes a statement available to teams."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-3 md:grid-cols-2",
						onSubmit: async (event) => {
							event.preventDefault();
							const form = event.currentTarget;
							const values = new FormData(form);
							setBusy(true);
							try {
								await saveStatement({ data: {
									statementCode: String(values.get("code") ?? ""),
									title: String(values.get("title") ?? ""),
									organization: String(values.get("organization") ?? "") || null,
									category: String(values.get("category") ?? "") || null,
									theme: String(values.get("theme") ?? "") || null,
									description: String(values.get("description") ?? "") || null,
									sourceUrl: String(values.get("sourceUrl") ?? "") || null,
									sourceVersion: String(values.get("sourceVersion") ?? "") || null,
									published: values.get("published") === "on",
									sortOrder: Number(values.get("sortOrder") ?? 0)
								} });
								toast.success("Problem statement saved.");
								form.reset();
								await refresh();
							} catch (error) {
								toast.error(error instanceof Error ? error.message : "Could not save statement.");
							} finally {
								setBusy(false);
							}
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "code",
								required: true,
								placeholder: "Problem statement code",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "title",
								required: true,
								placeholder: "Official title",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "organization",
								placeholder: "Organisation",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "theme",
								placeholder: "Official theme",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "category",
								placeholder: "Category",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "sourceUrl",
								type: "url",
								placeholder: "Official source URL",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "sourceVersion",
								placeholder: "Source version / release",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "sortOrder",
								type: "number",
								min: "0",
								defaultValue: "0",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name: "description",
								placeholder: "Official description",
								rows: 4,
								className: `${field} resize-none md:col-span-2`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									name: "published"
								}), " Publish to teams"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: `${btn} w-fit`,
								disabled: busy,
								children: busy ? "Saving…" : "Save statement"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-px border border-hairline bg-hairline",
						children: data.statements.map((statement) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-background p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-silver",
									children: statement.statement_code
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2",
									children: statement.title
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-muted-foreground",
									children: statement.published ? "Published" : "Draft"
								})
							]
						}, statement.id))
					})
				]
			})
		]
	});
}
function CheckIn({ registrations, events }) {
	const router = useRouter();
	const scan = useServerFn(checkInByCode);
	const scanSih = useServerFn(checkInHackathonTeam);
	const [result, setResult] = (0, import_react.useState)(null);
	const [eventId, setEventId] = (0, import_react.useState)(events[0]?.id ?? "");
	const rows = registrations.filter((r) => r.event_id === eventId);
	const done = rows.filter((r) => r.checked_in_at).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-wrap items-end gap-3 border border-hairline bg-card/40 p-5",
			onSubmit: async (e) => {
				e.preventDefault();
				const f = new FormData(e.currentTarget);
				const form = e.currentTarget;
				try {
					const code = String(f.get("code") ?? "").trim();
					if (code.toUpperCase().includes("VTX-SIH:")) {
						const res = await scanSih({ data: { code } });
						if (res.status === "ok") setResult(`✓ ${res.team} checked in · ${res.members.map((m) => m.name).join(", ")}`);
						else if (res.status === "already") setResult(`! ${res.team} already checked in · ${res.members.map((m) => m.name).join(", ")}`);
						else setResult("✗ Unknown SIH team code");
					} else {
						const res = await scan({ data: { code } });
						if (res.status === "ok") setResult(`✓ ${res.name} checked in · ${res.event}`);
						else if (res.status === "already") setResult(`! ${res.name} already checked in`);
						else setResult("✗ Unknown pass code");
					}
				} catch {
					setResult("✗ Check-in failed");
				}
				form.reset();
				await router.invalidate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					text: "Pass code or scanned URL",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "code",
						required: true,
						autoFocus: true,
						className: `${field} w-80`,
						placeholder: "Paste or scan…"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: btn,
					children: "Check in"
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-silver",
					children: result
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				text: "Event",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: eventId,
					onChange: (e) => setEventId(e.target.value),
					className: field,
					children: events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: e.id,
						className: "bg-background",
						children: e.title
					}, e.id))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
				children: [
					done,
					" / ",
					rows.length,
					" attended"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex flex-col gap-px border border-hairline bg-hairline",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4 bg-background p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-sm",
					children: r.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] text-muted-foreground",
					children: r.email
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] uppercase tracking-widest text-silver",
					children: r.checked_in_at ? "In" : "—"
				})]
			}, r.id))
		})] })]
	});
}
function Applications({ rows }) {
	const router = useRouter();
	const update = useServerFn(setApplicationStatus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-px border border-hairline bg-hairline",
		children: [rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-background p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-lg",
					children: a.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
					children: [
						a.email,
						" · ",
						a.team_first ?? "—",
						" / ",
						a.team_second ?? "—",
						" · ",
						a.status
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [
						"shortlisted",
						"accepted",
						"rejected"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: ghost,
						onClick: async () => {
							try {
								await update({ data: {
									id: a.id,
									status: s,
									notes: a.notes
								} });
								toast.success(`Marked ${s}.`);
								await router.invalidate();
							} catch {
								toast.error("Could not update.");
							}
						},
						children: s
					}, s))
				})]
			}), a.why && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-3xl text-sm text-muted-foreground",
				children: a.why
			})]
		}, a.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-background p-6 font-mono text-xs text-muted-foreground",
			children: "No applications yet."
		})]
	});
}
function Members({ members, teams }) {
	const router = useRouter();
	const save = useServerFn(saveMember);
	const remove = useServerFn(deleteMember);
	const award = useServerFn(awardBadge);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const open = (m) => {
		setEditing(m ?? {
			id: "",
			slug: "",
			name: "",
			role: "Member",
			team_id: teams[0]?.id ?? null,
			is_head: false,
			is_leadership: false,
			photo_url: null,
			bio: null,
			skills: [],
			links: {},
			sort_order: 0
		});
		setPhoto(m?.photo_url ?? null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: btn,
				onClick: () => open(null),
				children: "+ Add member"
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-4 border border-hairline bg-card/40 p-6 md:grid-cols-2",
				onSubmit: async (e) => {
					e.preventDefault();
					const f = new FormData(e.currentTarget);
					const name = String(f.get("name") ?? "");
					setBusy(true);
					try {
						await save({ data: {
							...editing.id ? { id: editing.id } : {},
							name,
							slug: String(f.get("slug") ?? "") || slugify(name),
							role: String(f.get("role") ?? "Member"),
							teamId: String(f.get("team") ?? "") || null,
							isHead: f.get("isHead") === "on",
							isLeadership: f.get("isLeadership") === "on",
							photoUrl: photo,
							bio: String(f.get("bio") ?? "") || null,
							skills: String(f.get("skills") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
							links: {},
							sortOrder: Number(f.get("sortOrder") ?? 0)
						} });
						toast.success("Member saved.");
						setEditing(null);
						await router.invalidate();
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Could not save.");
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoUpload, {
							value: photo,
							onChange: setPhoto,
							label: "Member photo"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "name",
							required: true,
							defaultValue: editing.name,
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Profile link name (slug)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "slug",
							defaultValue: editing.slug,
							placeholder: "auto from name",
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Role",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "role",
							required: true,
							defaultValue: editing.role,
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Team",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							name: "team",
							defaultValue: editing.team_id ?? "",
							className: field,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								className: "bg-background",
								children: "Leadership / none"
							}), teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.id,
								className: "bg-background",
								children: t.name
							}, t.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Skills (comma separated)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "skills",
							defaultValue: (editing.skills ?? []).join(", "),
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Sort order",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "sortOrder",
							type: "number",
							defaultValue: editing.sort_order,
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Bio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							name: "bio",
							rows: 3,
							defaultValue: editing.bio ?? "",
							className: `${field} md:col-span-2 resize-none`
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								name: "isHead",
								defaultChecked: editing.is_head
							}), " Team head"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									name: "isLeadership",
									defaultChecked: editing.is_leadership
								}),
								" ",
								"Leadership"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							disabled: busy,
							children: busy ? "Saving…" : "Save member"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: ghost,
							onClick: () => setEditing(null),
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-px border border-hairline bg-hairline",
				children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4 bg-background p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-base",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: [
									m.role,
									" · ",
									teams.find((t) => t.id === m.team_id)?.name ?? "Leadership",
									" · /",
									m.slug
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: ghost,
							onClick: () => open(m),
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: ghost,
							onClick: async () => {
								const badgeId = window.prompt("Badge id (founder, team-head, hackathon-win, shipper, regular, mentor)");
								if (!badgeId) return;
								try {
									await award({ data: {
										memberId: m.id,
										badgeId,
										note: null
									} });
									toast.success("Badge awarded.");
								} catch {
									toast.error("Could not award badge.");
								}
							},
							children: "Badge"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: ghost,
							onClick: async () => {
								if (!window.confirm(`Remove ${m.name}?`)) return;
								try {
									await remove({ data: { id: m.id } });
									toast.success("Member removed.");
									await router.invalidate();
								} catch {
									toast.error("Could not remove.");
								}
							},
							children: "Delete"
						})
					]
				}, m.id))
			})
		]
	});
}
function Events({ events }) {
	const router = useRouter();
	const save = useServerFn(saveEvent);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [cover, setCover] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const open = (e) => {
		setEditing(e ?? {
			id: "",
			slug: "",
			title: "",
			event_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			start_time: "",
			location: "TBA",
			tag: "Event",
			description: "",
			cover_url: null,
			capacity: null,
			published: true
		});
		setCover(e?.cover_url ?? null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: btn,
				onClick: () => open(null),
				children: "+ Add event"
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-4 border border-hairline bg-card/40 p-6 md:grid-cols-2",
				onSubmit: async (e) => {
					e.preventDefault();
					const f = new FormData(e.currentTarget);
					const title = String(f.get("title") ?? "");
					setBusy(true);
					try {
						await save({ data: {
							...editing.id ? { id: editing.id } : {},
							title,
							slug: String(f.get("slug") ?? "") || slugify(title),
							eventDate: String(f.get("date") ?? ""),
							startTime: String(f.get("time") ?? "") || null,
							location: String(f.get("location") ?? "TBA"),
							tag: String(f.get("tag") ?? "Event"),
							description: String(f.get("description") ?? "") || null,
							coverUrl: cover,
							capacity: f.get("capacity") ? Number(f.get("capacity")) : null,
							published: f.get("published") === "on"
						} });
						toast.success("Event saved.");
						setEditing(null);
						await router.invalidate();
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Could not save.");
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoUpload, {
							value: cover,
							onChange: setCover,
							folder: "events",
							label: "Cover image"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "title",
							required: true,
							defaultValue: editing.title,
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Link name (slug)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "slug",
							defaultValue: editing.slug,
							placeholder: "auto from title",
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "date",
							type: "date",
							required: true,
							defaultValue: editing.event_date ?? "",
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Start time",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "time",
							defaultValue: editing.start_time ?? "",
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Location",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "location",
							required: true,
							defaultValue: editing.location,
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Tag",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "tag",
							required: true,
							defaultValue: editing.tag,
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Capacity",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "capacity",
							type: "number",
							defaultValue: editing.capacity ?? "",
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "published",
							defaultChecked: editing.published
						}), " Published"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							name: "description",
							rows: 3,
							defaultValue: editing.description ?? "",
							className: `${field} resize-none md:col-span-2`
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							disabled: busy,
							children: busy ? "Saving…" : "Save event"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: ghost,
							onClick: () => setEditing(null),
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-px border border-hairline bg-hairline",
				children: events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 bg-background p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-base",
						children: e.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [
							e.event_date ? new Date(e.event_date).toDateString() : "Date TBA",
							" · ",
							e.location,
							" ·",
							" ",
							e.published ? "live" : "draft"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: ghost,
						onClick: () => open(e),
						children: "Edit"
					})]
				}, e.id))
			})
		]
	});
}
function Projects({ projects, members }) {
	const router = useRouter();
	const save = useServerFn(saveProject);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [cover, setCover] = (0, import_react.useState)(null);
	const [people, setPeople] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const open = (p) => {
		setEditing(p ?? {
			id: "",
			slug: "",
			title: "",
			description: "",
			tech: [],
			cover_url: null,
			link: "",
			year: (/* @__PURE__ */ new Date()).getFullYear(),
			published: true
		});
		setCover(p?.cover_url ?? null);
		setPeople([]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: btn,
				onClick: () => open(null),
				children: "+ Add project"
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-4 border border-hairline bg-card/40 p-6 md:grid-cols-2",
				onSubmit: async (e) => {
					e.preventDefault();
					const f = new FormData(e.currentTarget);
					const title = String(f.get("title") ?? "");
					setBusy(true);
					try {
						await save({ data: {
							...editing.id ? { id: editing.id } : {},
							title,
							slug: String(f.get("slug") ?? "") || slugify(title),
							description: String(f.get("description") ?? "") || null,
							tech: String(f.get("tech") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
							coverUrl: cover,
							link: String(f.get("link") ?? "") || null,
							year: f.get("year") ? Number(f.get("year")) : null,
							published: f.get("published") === "on",
							contributorIds: people
						} });
						toast.success("Project saved.");
						setEditing(null);
						await router.invalidate();
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Could not save.");
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoUpload, {
							value: cover,
							onChange: setCover,
							folder: "projects",
							label: "Cover image"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "title",
							required: true,
							defaultValue: editing.title,
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Link name (slug)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "slug",
							defaultValue: editing.slug,
							placeholder: "auto from title",
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Tech (comma separated)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "tech",
							defaultValue: editing.tech.join(", "),
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "External link",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "link",
							defaultValue: editing.link ?? "",
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Year",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "year",
							type: "number",
							defaultValue: editing.year ?? "",
							className: field
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "published",
							defaultChecked: editing.published
						}), " Published"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						text: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							name: "description",
							rows: 3,
							defaultValue: editing.description ?? "",
							className: `${field} resize-none md:col-span-2`
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Contributors"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPeople(people.includes(m.id) ? people.filter((p) => p !== m.id) : [...people, m.id]),
								className: `border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${people.includes(m.id) ? "border-silver text-foreground" : "border-hairline text-muted-foreground"}`,
								children: m.name
							}, m.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							disabled: busy,
							children: busy ? "Saving…" : "Save project"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: ghost,
							onClick: () => setEditing(null),
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-px border border-hairline bg-hairline",
				children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 bg-background p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-base",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [
							p.year ?? "—",
							" · ",
							p.published ? "live" : "draft"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: ghost,
						onClick: () => open(p),
						children: "Edit"
					})]
				}, p.id))
			})
		]
	});
}
function Announcements({ rows, teams, isAdmin, headTeams }) {
	const router = useRouter();
	const save = useServerFn(saveAnnouncement);
	const remove = useServerFn(deleteAnnouncement);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const allowed = isAdmin ? teams : teams.filter((t) => headTeams.includes(t.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-4 border border-hairline bg-card/40 p-6",
			onSubmit: async (e) => {
				e.preventDefault();
				const f = new FormData(e.currentTarget);
				const form = e.currentTarget;
				setBusy(true);
				try {
					await save({ data: {
						title: String(f.get("title") ?? ""),
						body: String(f.get("body") ?? ""),
						teamId: String(f.get("team") ?? "") || null,
						pinned: f.get("pinned") === "on",
						published: true
					} });
					toast.success("Announcement posted.");
					form.reset();
					await router.invalidate();
				} catch (err) {
					toast.error(err instanceof Error ? err.message : "Could not post.");
				} finally {
					setBusy(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					text: "Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "title",
						required: true,
						className: field
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					text: "Message",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						name: "body",
						rows: 4,
						required: true,
						className: `${field} resize-none`
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							text: "Audience",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								name: "team",
								className: field,
								defaultValue: isAdmin ? "" : allowed[0]?.id ?? "",
								children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									className: "bg-background",
									children: "Club-wide"
								}), allowed.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t.id,
									className: "bg-background",
									children: t.name
								}, t.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								name: "pinned"
							}), " Pin to top"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							disabled: busy,
							children: busy ? "Posting…" : "Post announcement"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-px border border-hairline bg-hairline",
			children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 bg-background p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-base",
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: [
								a.team_id ? teams.find((t) => t.id === a.team_id)?.name ?? a.team_id : "Club-wide",
								" ",
								"· ",
								new Date(a.created_at).toDateString()
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-line text-sm text-muted-foreground",
							children: a.body
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: ghost,
					onClick: async () => {
						try {
							await remove({ data: { id: a.id } });
							toast.success("Deleted.");
							await router.invalidate();
						} catch {
							toast.error("Could not delete.");
						}
					},
					children: "Delete"
				})]
			}, a.id))
		})]
	});
}
//#endregion
export { AdminPage as component };
