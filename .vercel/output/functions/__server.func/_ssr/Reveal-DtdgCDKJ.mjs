import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-DtdgCDKJ.js
var import_jsx_runtime = require_jsx_runtime();
/** Decorative layer shared by every public page. It deliberately never captures input. */
function Atmosphere({ className = "" }) {
	const reduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": "true",
		className: `pointer-events-none absolute inset-0 overflow-hidden ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "noise-overlay absolute inset-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid-backdrop absolute inset-0 opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute -left-40 -top-56 h-[38rem] w-[38rem] rounded-full bg-[oklch(0.82_0.06_50)]/25 blur-3xl",
				animate: reduceMotion ? void 0 : {
					x: [
						0,
						70,
						0
					],
					y: [
						0,
						40,
						0
					],
					scale: [
						1,
						1.12,
						1
					]
				},
				transition: {
					duration: 18,
					repeat: Infinity,
					ease: "easeInOut"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute -right-48 top-40 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.88_0.04_120)]/25 blur-3xl",
				animate: reduceMotion ? void 0 : {
					x: [
						0,
						-75,
						0
					],
					y: [
						0,
						-35,
						0
					]
				},
				transition: {
					duration: 22,
					repeat: Infinity,
					ease: "easeInOut"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette absolute inset-0" })
		]
	});
}
function Reveal({ children, delay = 0, className = "" }) {
	const reduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className,
		initial: reduceMotion ? false : {
			opacity: 0,
			y: 20
		},
		whileInView: reduceMotion ? void 0 : {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			amount: .14
		},
		transition: {
			duration: .6,
			delay,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children
	});
}
//#endregion
export { Reveal as n, Atmosphere as t };
