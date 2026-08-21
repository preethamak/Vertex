import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/admin.functions";

export function PhotoUpload({
  value,
  onChange,
  folder = "members",
  label = "Photo",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
}) {
  const upload = useServerFn(uploadMedia);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const compress = async (file: File): Promise<Blob> => {
    try {
      const bitmap = await createImageBitmap(file);
      const max = 900;
      const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(bitmap, 0, 0, w, h);
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.86));
      return blob && blob.size < file.size ? blob : file;
    } catch {
      return file;
    }
  };

  const pick = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
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
      for (let i = 0; i < buf.length; i += 0x8000) {
        bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      }
      const { url } = await upload({
        data: { folder, ext, contentType: type, base64: btoa(bin) },
      });
      onChange(url);
      toast.success("Photo uploaded.");
    } catch {
      toast.error("Upload failed. Try a different image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden border border-hairline bg-secondary">
        {value ? (
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            None
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-silver disabled:opacity-50"
          >
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="border border-hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-silver"
            >
              Clear
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void pick(file);
          }}
        />
      </div>
    </div>
  );
}
