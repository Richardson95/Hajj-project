export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <article
        className="
          [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:text-ink sm:[&_h1]:text-4xl
          [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink
          [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-ink
          [&_p]:mt-4 [&_p]:text-[0.9375rem] [&_p]:leading-relaxed [&_p]:text-muted
          [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5
          [&_li]:list-disc [&_li]:text-[0.9375rem] [&_li]:leading-relaxed [&_li]:text-muted
          [&_li::marker]:text-forest-700 dark:[&_li::marker]:text-gold-400
          [&_strong]:font-semibold [&_strong]:text-ink
          [&_a]:font-medium [&_a]:text-forest-800 [&_a]:underline [&_a]:underline-offset-2 dark:[&_a]:text-gold-300
        "
      >
        {children}
      </article>
    </div>
  );
}
