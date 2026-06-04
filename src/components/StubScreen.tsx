import type { ReactNode } from "react";

/**
 * Visual placeholder for screens not yet implemented.
 * Shows what state would render here so reviewers know what's coming.
 */
export function StubScreen({
  title,
  notes,
  children,
}: {
  title: string;
  notes?: string;
  children?: ReactNode;
}) {
  return (
    <section className="p-4">
      <div className="rounded-card border border-dashed border-outline bg-surface-muted p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-blue">
          Stub screen
        </p>
        <h2 className="mt-1 text-lg font-bold text-emphasis">{title}</h2>
        {notes && <p className="mt-1 text-sm text-text-secondary">{notes}</p>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}
