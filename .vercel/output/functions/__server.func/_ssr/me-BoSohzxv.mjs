import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as useRouter, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Route$5, o as respondMentorship, s as updateMyProfile } from "./router-BgH94mqf.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
import { t as PhotoUpload } from "./PhotoUpload-BwKCY1_o.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-BoSohzxv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MePage() {
	const { dashboard, mentorships } = Route$5.useLoaderData();
	const router = useRouter();
	const save = useServerFn(updateMyProfile);
	const respond = useServerFn(respondMentorship);
	const member = dashboard.viewer.member;
	const [photo, setPhoto] = (0, import_react.useState)(member?.photoUrl ?? null);
	const [bio, setBio] = (0, import_react.useState)(member?.bio ?? "");
	const [skills, setSkills] = (0, import_react.useState)((member?.skills ?? []).join(", "));
	const [links, setLinks] = (0, import_react.useState)(() => ({
		github: member?.links["github"] ?? "",
		linkedin: member?.links["linkedin"] ?? "",
		instagram: member?.links["instagram"] ?? "",
		website: member?.links["website"] ?? ""
	}));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const attended = dashboard.attendance.filter((a) => a.checkedInAt).length;
	const badgeName = new Map(dashboard.badgeCatalog.map((b) => [b.id, b.name]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-4xl px-6 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-px w-8 bg-silver" }), "Member dashboard"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 font-display text-4xl font-semibold tracking-tight md:text-6xl",
						children: member ? member.name : dashboard.email
					}),
					dashboard.viewer.isAdmin || dashboard.viewer.isHead ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "mt-6 inline-block border border-silver px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:opacity-80",
						children: "Open admin console →"
					}) : null,
					!member && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 border border-hairline bg-card/40 p-5 text-sm text-muted-foreground",
						children: "Your account isn't linked to a roster entry yet. Ask an admin to link it from the admin console, then reload this page."
					}),
					member && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-semibold",
								children: "Profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-6 grid gap-5 border border-hairline bg-card/40 p-6",
								onSubmit: async (e) => {
									e.preventDefault();
									setBusy(true);
									try {
										await save({ data: {
											photoUrl: photo,
											bio: bio.trim() || null,
											skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
											links: Object.fromEntries(Object.entries(links).filter(([, v]) => v.trim() !== ""))
										} });
										toast.success("Profile updated.");
										await router.invalidate();
									} catch {
										toast.error("Could not save your profile.");
									} finally {
										setBusy(false);
									}
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoUpload, {
										value: photo,
										onChange: setPhoto,
										label: "Profile photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
											children: "Bio"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 4,
											value: bio,
											onChange: (e) => setBio(e.target.value),
											className: "resize-none border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
											children: "Skills (comma separated)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: skills,
											onChange: (e) => setSkills(e.target.value),
											className: "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-4 md:grid-cols-2",
										children: [
											"github",
											"linkedin",
											"instagram",
											"website"
										].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex flex-col gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
												children: k
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: links[k],
												onChange: (e) => setLinks({
													...links,
													[k]: e.target.value
												}),
												className: "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
											})]
										}, k))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: busy,
										className: "w-fit border border-silver bg-foreground px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-background disabled:opacity-50",
										children: busy ? "Saving…" : "Save profile"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-14 grid gap-6 md:grid-cols-[auto_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-fit bg-white p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
									value: typeof window !== "undefined" ? `${window.location.origin}/member/${member.slug}` : `/member/${member.slug}`,
									size: 148,
									bgColor: "#ffffff",
									fgColor: "#000000",
									level: "M"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-semibold",
									children: "Your profile QR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-md text-sm text-muted-foreground",
									children: "Any phone camera opens your public profile directly from this code. Print it, stick it on a laptop, drop it in a slide."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/member/$slug",
									params: { slug: member.slug },
									className: "mt-5 inline-block border border-hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-silver",
									children: "View public profile →"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-14",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-semibold",
									children: "Attendance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid grid-cols-3 gap-px border border-hairline bg-hairline",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "Registered",
											value: String(dashboard.attendance.length)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "Checked in",
											value: String(attended)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
											label: "Badges",
											value: String(dashboard.badges.length)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-col gap-px border border-hairline bg-hairline",
									children: [dashboard.attendance.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-4 bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display text-base",
											children: a.event
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
											children: a.date ? new Date(a.date).toDateString() : ""
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-mono text-[10px] uppercase tracking-widest ${a.checkedInAt ? "text-silver" : "text-muted-foreground"}`,
											children: a.checkedInAt ? "Attended" : "Registered"
										})]
									}, a.code)), dashboard.attendance.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-background p-4 font-mono text-xs text-muted-foreground",
										children: [
											"No event registrations under ",
											dashboard.email || "your email",
											" yet."
										]
									})]
								})
							]
						}),
						dashboard.badges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-14",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-semibold",
								children: "Badges"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: dashboard.badges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "border border-silver/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-silver",
									children: badgeName.get(b.badge_id) ?? b.badge_id
								}, b.badge_id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-14",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-semibold",
								children: "Mentorship"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-col gap-px border border-hairline bg-hairline",
								children: [mentorships.map((r) => {
									const incoming = r.mentor_id === member.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-4 bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display text-base",
													children: r.topic
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
													children: [
														incoming ? "Incoming request" : "You requested",
														" · ",
														r.status
													]
												}),
												r.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-sm text-muted-foreground",
													children: r.message
												})
											]
										}), incoming && r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-2",
											children: ["accepted", "declined"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: async () => {
													await respond({ data: {
														id: r.id,
														status: s
													} });
													toast.success(`Request ${s}.`);
													await router.invalidate();
												},
												className: "border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-silver",
												children: s === "accepted" ? "Accept" : "Decline"
											}, s))
										})]
									}, r.id);
								}), mentorships.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-background p-4 font-mono text-xs text-muted-foreground",
									children: [
										"No mentorship requests yet.",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/mentors",
											className: "text-silver",
											children: "Find a mentor →"
										})
									]
								})]
							})]
						})
					] })
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
//#endregion
export { MePage as component };
