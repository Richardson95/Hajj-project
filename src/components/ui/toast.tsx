"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useHydrated } from "@/lib/client-hooks";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (input: { title: string; description?: string; tone?: ToastTone }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_META: Record<
  ToastTone,
  { icon: React.ComponentType<{ className?: string }>; accent: string; ring: string }
> = {
  success: {
    icon: CircleCheck,
    accent: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-600/20",
  },
  error: {
    icon: CircleAlert,
    accent: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-600/20",
  },
  warning: {
    icon: TriangleAlert,
    accent: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-600/20",
  },
  info: {
    icon: Info,
    accent: "text-forest-700 dark:text-forest-300",
    ring: "ring-forest-700/20",
  },
};

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const mounted = useHydrated();

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>(
    ({ title, description, tone = "success" }) => {
      nextId += 1;
      const id = nextId;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, tone }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <div
              className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-200 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end"
              role="status"
              aria-live="polite"
            >
              {toasts.map((t) => {
                const meta = TONE_META[t.tone];
                const ToneIcon = meta.icon;
                return (
                  <div
                    key={t.id}
                    className={cn(
                      "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-lg ring-1",
                      meta.ring,
                      "animate-[fade-up_0.28s_cubic-bezier(0.22,1,0.36,1)]",
                    )}
                  >
                    <ToneIcon className={cn("mt-0.5 size-5 shrink-0", meta.accent)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{t.title}</p>
                      {t.description ? (
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">
                          {t.description}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => dismiss(t.id)}
                      aria-label="Dismiss notification"
                      className="-mt-0.5 -mr-0.5 rounded-lg p-1 text-muted transition hover:bg-surface-muted hover:text-ink"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
