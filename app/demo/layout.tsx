import type { ReactNode } from "react";

// The interactive demo keeps the tight 430px mobile shell + paper grain.
// The marketing site (app/page.tsx) renders full-bleed instead.
export default function DemoLayout({ children }: { children: ReactNode }) {
  return <div className="halo-shell">{children}</div>;
}
