import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Photo-backed header used at the top of every marketing page.
 * Keep `title` to one line and `description` to one sentence.
 */
export function PageHero({
  title,
  description,
  image,
  imageAlt,
  imagePosition = "center",
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-neutral-950 text-white", className)}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/50 to-black/20" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <h1 className="max-w-2xl text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div> : null}
      </div>
    </section>
  );
}
