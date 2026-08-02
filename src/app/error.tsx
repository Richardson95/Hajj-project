"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("HajjPath error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-4 py-6 sm:px-8">
        <Logo href="/" />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-20">
        <div className="max-w-lg text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <TriangleAlert className="size-8" />
          </span>

          <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-ink">
            Something went wrong
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            An unexpected error interrupted this page. Your savings and your data are
            unaffected — nothing was lost.
          </p>

          {error.digest ? (
            <p className="tabular mt-4 inline-block rounded-lg bg-surface-muted px-3 py-1.5 text-xs text-muted">
              Reference {error.digest}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={reset}>
              <RotateCcw className="size-4" />
              Try again
            </Button>
            <ButtonLink href="/" variant="outline" size="lg">
              Back to the homepage
            </ButtonLink>
          </div>

          <p className="mt-8 text-sm text-muted">
            If this keeps happening,{" "}
            <a
              href="mailto:salam@hajjpath.ng"
              className="font-semibold text-forest-800 hover:underline dark:text-gold-300"
            >
              tell us about it
            </a>{" "}
            and we will look into it.
          </p>
        </div>
      </main>
    </div>
  );
}
