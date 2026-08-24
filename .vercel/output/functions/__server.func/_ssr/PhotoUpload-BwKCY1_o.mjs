import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as uploadMedia } from "./router-BgH94mqf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PhotoUpload-BwKCY1_o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PhotoUpload({ value, onChange, folder = "members", label = "Photo" }) {
	const upload = useServerFn(uploadMedia);
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const compress = async (file) => {
		try {
			const bitmap = await createImageBitmap(file);
			const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
			const w = Math.round(bitmap.width * scale);
			const h = Math.round(bitmap.height * scale);
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) return file;
			ctx.drawImage(bitmap, 0, 0, w, h);
			const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", .86));
			return blob && blob.size < file.size ? blob : file;
		} catch {
			return file;
		}
	};
	const pick = async (file) => {
		if (file.size > 15728640) {
			toast.error("Keep images under 15 MB.");
			return;
		}
		setBusy(true);
		try {
			const body = await compress(file);
			const type = body.type || file.type || "image/jpeg";
			const ext = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
			const buf = new Uint8Array(await body.arrayBuffer());
			let bin = "";
			for (let i = 0; i < buf.length; i += 32768) bin += String.fromCharCode(...buf.subarray(i, i + 32768));
			const { url } = await upload({ data: {
				folder,
				ext,
				contentType: type,
				base64: btoa(bin)
			} });
			onChange(url);
			toast.success("Photo uploaded.");
		} catch {
			toast.error("Upload failed. Try a different image.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-20 w-20 shrink-0 overflow-hidden border border-hairline bg-secondary",
			children: value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: value,
				alt: label,
				className: "h-full w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
				children: "None"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => inputRef.current?.click(),
						className: "border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-silver disabled:opacity-50",
						children: busy ? "Uploading…" : value ? "Replace" : "Upload"
					}), value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onChange(null),
						className: "border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-silver",
						children: "Clear"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					accept: "image/*",
					className: "hidden",
					onChange: (e) => {
						const file = e.target.files?.[0];
						e.target.value = "";
						if (file) pick(file);
					}
				})
			]
		})]
	});
}
//#endregion
export { PhotoUpload as t };
