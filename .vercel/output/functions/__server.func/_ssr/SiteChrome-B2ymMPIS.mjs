import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as VertexLogo } from "./VertexLogo-0I7ekk9v.mjs";
import { i as useScroll, o as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { s as Menu, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteChrome-B2ymMPIS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { scrollY } = useScroll();
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => scrollY.on("change", (value) => setScrolled(value > 18)), [scrollY]);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);
	const nav = [
		{
			label: "Members",
			to: "/members"
		},
		{
			label: "Events",
			to: "/events"
		},
		{
			label: "Projects",
			to: "/projects"
		},
		{
			label: "Feed",
			to: "/announcements"
		},
		{
			label: "Dashboard",
			to: "/me"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 px-3 pt-3 sm:px-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5 ${scrolled ? "glass-strong shadow-[var(--shadow-glow)]" : "border border-transparent"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VertexLogo, { className: "h-6 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: "Vertex"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground lg:flex",
					children: [
						nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: "transition-colors hover:text-foreground",
							children: item.label
						}, item.label)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/join",
							className: "hover:text-foreground",
							children: "Join"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "btn-ghost rounded-lg px-3 py-1.5 hover:text-foreground",
							children: "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen(!open),
					className: "glass-panel rounded-lg p-2 lg:hidden",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 18 })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: {
				opacity: 0,
				y: -12
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				y: -12
			},
			className: "glass-strong absolute inset-x-3 top-[4.8rem] rounded-2xl p-4 sm:inset-x-5 lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "grid gap-1 font-display text-2xl",
				children: [nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: "rounded-xl px-4 py-3 hover:bg-black/[0.04]",
					children: item.label
				}, item.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/join",
					onClick: () => setOpen(false),
					className: "mt-2 rounded-xl bg-foreground px-4 py-3 text-background",
					children: "Join Vertex →"
				})]
			})
		}) })]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "relative border-t border-hairline",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VertexLogo, { className: "h-8 w-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-xl font-semibold",
					children: "Vertex"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
					children: "Technical Club · Est. 2026"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Vertex"
				]
			})]
		})
	});
}
//#endregion
export { SiteHeader as n, SiteFooter as t };
