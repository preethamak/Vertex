import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useMotionTemplate, r as useMotionValue, t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SpotlightCard-Bbmix81R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function initials(name) {
	const parts = name.replace(/\./g, "").split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function Avatar({ name, size = 72, photo }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setFailed(false);
		setLoaded(false);
	}, [photo]);
	const showPhoto = Boolean(photo) && !failed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative shrink-0 overflow-hidden rounded-full border border-hairline bg-secondary",
		style: {
			width: size,
			height: size
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-40",
				style: { background: "radial-gradient(circle at 30% 25%, oklch(0.35 0 0) 0%, transparent 55%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center font-mono text-sm tracking-widest text-silver",
				children: initials(name)
			}),
			showPhoto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: photo,
				alt: "",
				"aria-hidden": "true",
				onError: () => setFailed(true),
				onLoad: () => setLoaded(true),
				className: `absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`,
				loading: "lazy",
				decoding: "async"
			})
		]
	});
}
function MemberCard({ member, index, isHead = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/member/$slug",
		params: { slug: member.slug },
		className: "group relative flex items-center gap-4 border border-hairline bg-card/40 p-4 transition-colors hover:border-silver/50 hover:bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				name: member.name,
				size: 56,
				photo: member.photo
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted-foreground",
							children: String(index).padStart(2, "0")
						}), isHead && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest text-silver",
							children: "Head"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg leading-tight text-foreground",
						children: member.name
					}),
					member.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
						children: member.role
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
				children: "View →"
			})
		]
	});
}
function SpotlightCard({ children, className = "" }) {
	const reduceMotion = useReducedMotion();
	const x = useMotionValue("50%");
	const y = useMotionValue("50%");
	const spotlight = useMotionTemplate`radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,.11), transparent 42%)`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: `group relative overflow-hidden rounded-2xl border border-hairline bg-card/50 ${className}`,
		whileHover: reduceMotion ? void 0 : {
			y: -5,
			transition: { duration: .25 }
		},
		onPointerMove: (event) => {
			if (reduceMotion) return;
			const bounds = event.currentTarget.getBoundingClientRect();
			x.set(`${event.clientX - bounds.left}px`);
			y.set(`${event.clientY - bounds.top}px`);
		},
		onPointerLeave: () => {
			x.set("50%");
			y.set("50%");
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
			style: { background: spotlight }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative",
			children
		})]
	});
}
//#endregion
export { MemberCard as n, SpotlightCard as r, Avatar as t };
