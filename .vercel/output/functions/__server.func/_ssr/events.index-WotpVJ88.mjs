import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$4, m as registerForEvent } from "./router-BgH94mqf.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events.index-WotpVJ88.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EventsPage() {
	const events = Route$4.useLoaderData();
	const [openSlug, setOpenSlug] = (0, import_react.useState)(null);
	const [pass, setPass] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-backdrop opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-5xl px-6 py-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-px w-8 bg-silver" }), "Calendar · 2026"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl",
							children: "Events."
						}),
						pass && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PassCard, {
							pass,
							onClose: () => setPass(null)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-14 flex flex-col gap-px border border-hairline bg-hairline",
							children: events.map((e) => {
								const d = e.event_date ? new Date(e.event_date) : null;
								const day = d ? d.toLocaleDateString("en-US", { day: "2-digit" }) : "--";
								const mon = d ? d.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "TBA";
								const open = openSlug === e.slug;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "bg-background p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start gap-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex w-20 shrink-0 flex-col items-center border border-hairline p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-display text-3xl leading-none",
														children: day
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 font-mono text-[10px] tracking-widest text-silver",
														children: mon
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-2 font-mono text-[10px] text-muted-foreground",
														children: d ? d.getFullYear() : ""
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "border border-hairline px-2 py-0.5 text-silver",
																children: e.tag
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", e.location] }),
															e.start_time && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", e.start_time] })
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
														className: "mt-2 font-display text-2xl font-semibold leading-tight",
														children: e.title
													}),
													e.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-2 max-w-2xl text-sm text-muted-foreground",
														children: e.description
													})
												]
											}),
											e.slug === "sih-internal-hackathon" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/events/sih-internal-hackathon",
												className: "btn-primary rounded-lg px-4 py-2 font-mono text-[11px] uppercase tracking-widest",
												children: "Open SIH workspace →"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setOpenSlug(open ? null : e.slug),
												className: "border border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-silver",
												children: open ? "Close" : "Register →"
											})
										]
									}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterForm, {
										slug: e.slug,
										onDone: (p) => {
											setPass(p);
											setOpenSlug(null);
											window.scrollTo({
												top: 0,
												behavior: "smooth"
											});
										}
									})]
								}, e.id);
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function RegisterForm({ slug, onDone }) {
	const register = useServerFn(registerForEvent);
	const [sending, setSending] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-6 grid gap-4 border border-hairline bg-card/40 p-5 md:grid-cols-2",
		onSubmit: async (e) => {
			e.preventDefault();
			const f = new FormData(e.currentTarget);
			setSending(true);
			try {
				onDone(await register({ data: {
					eventSlug: slug,
					name: String(f.get("name") ?? ""),
					email: String(f.get("email") ?? ""),
					phone: String(f.get("phone") ?? ""),
					usn: String(f.get("usn") ?? "")
				} }));
			} catch {
				toast.error("Registration failed. Check your details and try again.");
			} finally {
				setSending(false);
			}
		},
		children: [[
			{
				name: "name",
				label: "Full name",
				required: true,
				type: "text"
			},
			{
				name: "email",
				label: "Email",
				required: true,
				type: "email"
			},
			{
				name: "phone",
				label: "Phone",
				required: false,
				type: "text"
			},
			{
				name: "usn",
				label: "USN",
				required: false,
				type: "text"
			}
		].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
				children: f.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				name: f.name,
				type: f.type,
				required: f.required,
				className: "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
			})]
		}, f.name)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:col-span-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: sending,
				className: "border border-silver bg-foreground px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-background disabled:opacity-50",
				children: sending ? "Reserving…" : "Get my pass →"
			})
		})]
	});
}
function PassCard({ pass, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-12 grid gap-6 border border-silver/40 bg-card/60 p-6 md:grid-cols-[auto_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
				value: pass.code,
				size: 168,
				bgColor: "#ffffff",
				fgColor: "#000000",
				level: "M"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[10px] uppercase tracking-[0.3em] text-silver",
				children: "Entry pass · confirmed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-3xl font-semibold tracking-tight",
				children: pass.event.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
				children: [
					pass.event.date ? new Date(pass.event.date).toDateString() : "Date TBA",
					" ·",
					" ",
					pass.event.location
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 break-all border border-hairline bg-background px-4 py-3 font-mono text-sm text-foreground",
				children: pass.code
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Screenshot this. Show the code at the door and a team head scans you in."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "mt-5 border border-hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-silver",
				children: "Dismiss"
			})
		] })]
	});
}
//#endregion
export { EventsPage as component };
