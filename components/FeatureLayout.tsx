import type { CSSProperties, ReactNode } from "react";

export default function FeatureLayout({
  kicker,
  name,
  stackLine,
  side,
  foot,
  children,
}: {
  kicker: string;
  name: string;
  /** The stack row under the name (StackIcons). */
  stackLine: ReactNode;
  /** Sits in the left column, straight under the name (the project links box). */
  side?: ReactNode;
  /** Sits under the body in the right column (the previous / next nav). */
  foot?: ReactNode;
  children: ReactNode;
}) {
  // The longest word sets a size cap so no word is ever broken across lines (globals.css).
  const words = name.split(/\s+/);
  const longest = Math.max(...words.map((w) => w.length));
  return (
    <article className="feature bleed">
      <div className="feature-side">
        <div className="feature-name">
          <span className="kicker">{kicker}</span>
          <h1 style={{ "--longest": longest, "--words": words.length } as CSSProperties}>{name}</h1>
          {stackLine}
        </div>
        {side}
      </div>
      <div className="feature-main">
        <div className="feature-body">
          <div>{children}</div>
        </div>
        {foot}
      </div>
    </article>
  );
}
