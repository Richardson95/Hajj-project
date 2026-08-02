"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "./button";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(
          'input,textarea,select,button:not([data-close]),a[href]',
        )
        ?.focus();
    }, 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const width = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" }[size];

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 animate-[fade-in_0.2s_ease-out] bg-forest-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        className={cn(
          "safe-bottom relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl sm:rounded-3xl",
          "animate-[slide-up_0.28s_cubic-bezier(0.22,1,0.36,1)] sm:animate-[scale-in_0.22s_cubic-bezier(0.22,1,0.36,1)]",
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {description ? (
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton label="Close" onClick={onClose} data-close className="-mt-1 -mr-1">
            <X className="size-5" />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-surface-muted/50 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
