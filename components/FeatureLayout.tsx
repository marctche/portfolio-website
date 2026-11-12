import type { ReactNode } from "react";

export default function FeatureLayout({
  kicker,
  name,
  stackLine,
  side,
  children,
}: {
  kicker: string;
  name: string;
  stackLine: string;
  /** Sits in the left column, straight under the name (the project links box). */
  side?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="feature bleed">
      <div className="feature-side">
        <div className="feature-name">
          <span className="kicker">{kicker}</span>
          <h1>{name.toLowerCase()}</h1>
          <span className="kicker">{stackLine}</span>
        </div>
        {side}
      </div>
      <div className="feature-body">
        <div>{children}</div>
      </div>
    </article>
  );
}
