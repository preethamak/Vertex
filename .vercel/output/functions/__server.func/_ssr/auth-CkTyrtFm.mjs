import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-BqAKV5t-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CkTyrtFm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const google = async () => {
		setBusy(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		if (error) {
			setBusy(false);
			toast.error("Google sign-in failed.");
			return;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-md px-6 py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground",
						children: "Member access"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 font-display text-4xl font-semibold tracking-tight",
						children: mode === "signin" ? "Sign in." : "Create account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: google,
						disabled: busy,
						className: "mt-8 w-full border border-silver bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-background disabled:opacity-50",
						children: "Continue with Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-hairline" }),
							" or email",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-hairline" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-4",
						onSubmit: async (e) => {
							e.preventDefault();
							const f = new FormData(e.currentTarget);
							const email = String(f.get("email") ?? "");
							const password = String(f.get("password") ?? "");
							setBusy(true);
							try {
								if (mode === "signup") {
									const { error } = await supabase.auth.signUp({
										email,
										password,
										options: { emailRedirectTo: window.location.origin }
									});
									if (error) throw error;
									toast.success("Account created. Check your email if confirmation is required.");
								} else {
									const { error } = await supabase.auth.signInWithPassword({
										email,
										password
									});
									if (error) throw error;
								}
								navigate({ to: "/" });
							} catch (err) {
								toast.error(err instanceof Error ? err.message : "Authentication failed.");
							} finally {
								setBusy(false);
							}
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "email",
									type: "email",
									required: true,
									className: "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "password",
									type: "password",
									required: true,
									minLength: 6,
									className: "border border-hairline bg-background px-3 py-2 font-mono text-sm focus:border-silver focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "border border-hairline px-5 py-3 font-mono text-[11px] uppercase tracking-widest hover:border-silver disabled:opacity-50",
								children: mode === "signin" ? "Sign in →" : "Create account →"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
						className: "mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground",
						children: mode === "signin" ? "No account? Sign up" : "Already a member? Sign in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { AuthPage as component };
