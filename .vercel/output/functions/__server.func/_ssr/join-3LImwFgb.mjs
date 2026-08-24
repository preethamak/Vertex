import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Route$9, h as submitApplication } from "./router-BgH94mqf.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join-3LImwFgb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JoinPage() {
	const { teams } = Route$9.useLoaderData();
	const apply = useServerFn(submitApplication);
	const [sending, setSending] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl px-6 py-32 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] uppercase tracking-[0.3em] text-silver",
						children: "Application received"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 font-display text-5xl font-semibold tracking-tight",
						children: "You're in the pile."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "A team head will review your application and reach out over email. Keep an eye on your inbox."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mt-10 inline-block border border-hairline px-5 py-3 font-mono text-[11px] uppercase tracking-widest hover:border-silver",
						children: "← Back to the roster"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-backdrop opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-3xl px-6 py-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-px w-8 bg-silver" }), "Recruitment · 2026 intake"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl",
							children: "Apply to Vertex."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-muted-foreground",
							children: "Five teams, one club. Tell us where you fit and what you want to work on. No prior experience required — just show up and build."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-12 grid gap-5 border border-hairline bg-card/40 p-6 md:grid-cols-2",
							onSubmit: async (e) => {
								e.preventDefault();
								const f = new FormData(e.currentTarget);
								setSending(true);
								try {
									await apply({ data: {
										name: String(f.get("name") ?? ""),
										usn: String(f.get("usn") ?? ""),
										year: String(f.get("year") ?? ""),
										branch: String(f.get("branch") ?? ""),
										email: String(f.get("email") ?? ""),
										phone: String(f.get("phone") ?? ""),
										teamFirst: String(f.get("teamFirst") ?? ""),
										teamSecond: String(f.get("teamSecond") ?? ""),
										why: String(f.get("why") ?? ""),
										links: String(f.get("links") ?? "")
									} });
									setDone(true);
								} catch {
									toast.error("Something went wrong. Check your details and try again.");
								} finally {
									setSending(false);
								}
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "name",
									label: "Full name",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "usn",
									label: "USN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "year",
									label: "Year",
									placeholder: "1st / 2nd / 3rd / 4th"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "branch",
									label: "Branch"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "email",
									label: "Email",
									type: "email",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "phone",
									label: "Phone"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
									name: "teamFirst",
									label: "First preference",
									teams,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
									name: "teamSecond",
									label: "Second preference",
									teams
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col gap-2 md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
										children: "Why Vertex — and what do you want to build?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										name: "why",
										rows: 5,
										minLength: 10,
										className: "resize-none border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col gap-2 md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
										children: "Links (portfolio, GitHub, Instagram — optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "links",
										className: "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: sending,
										className: "border border-silver bg-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50",
										children: sending ? "Sending…" : "Submit application →"
									})
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Field({ name, label, type = "text", required, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			type,
			required,
			placeholder,
			className: "border border-hairline bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground/60 focus:border-silver focus:outline-none"
		})]
	});
}
function SelectField({ name, label, teams, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			name,
			required,
			defaultValue: "",
			className: "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: "—"
			}), teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: t.id,
				children: t.name
			}, t.id))]
		})]
	});
}
//#endregion
export { JoinPage as component };
