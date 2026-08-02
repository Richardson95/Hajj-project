"use client";

import { useId, useRef, useState } from "react";
import { CircleCheck, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/cn";

export interface UploadedFile {
  name: string;
  sizeKb: number;
}

export function UploadField({
  label,
  description,
  accept = "image/png,image/jpeg,application/pdf",
  value,
  onChange,
  error,
}: {
  label: string;
  description: string;
  accept?: string;
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  error?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function accept_(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    onChange({ name: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)) });
  }

  if (value) {
    return (
      <div className="space-y-1.5">
        <p className="text-[0.8125rem] font-medium text-ink">{label}</p>
        <div className="flex items-center gap-3 rounded-xl border border-forest-700/40 bg-forest-50 p-3.5 dark:bg-forest-950/60">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-forest-800 text-white">
            <CircleCheck className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{value.name}</p>
            <p className="tabular text-xs text-muted">
              {value.sizeKb.toLocaleString("en-NG")} KB · ready for verification
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label={`Remove ${label}`}
            className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-rose-600"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[0.8125rem] font-medium text-ink">
        {label} <span className="text-rose-600">*</span>
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept_(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-xl border border-dashed p-5 text-center transition",
          dragging
            ? "border-forest-700 bg-forest-50 dark:bg-forest-950/60"
            : error
              ? "border-rose-400 bg-rose-50/40 dark:bg-rose-950/20"
              : "border-line-strong bg-surface-muted/40 hover:border-forest-800/40",
        )}
      >
        <span className="mx-auto grid size-11 place-items-center rounded-xl bg-surface text-muted shadow-sm">
          <Upload className="size-5" />
        </span>
        <p className="mt-3 text-sm font-medium text-ink">
          Drag a file here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-semibold text-forest-800 underline underline-offset-2 dark:text-gold-300"
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => accept_(e.target.files)}
        />
      </div>
      {error ? (
        <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
    </div>
  );
}
