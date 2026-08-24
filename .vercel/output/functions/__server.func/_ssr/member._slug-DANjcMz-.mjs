import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/member._slug-DANjcMz-.js
var import_jsx_runtime = require_jsx_runtime();
function MemberNotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground",
					children: "404 · Member"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl",
					children: "Not on the roster."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-8 inline-block border border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-silver",
					children: "← Back to Vertex"
				})
			]
		})
	});
}
//#endregion
export { MemberNotFound as t };
