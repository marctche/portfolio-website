import Link from "next/link";
import type { Entry } from "@/lib/content";

function Name({ entry }: { entry: Entry }) {
  const { name, href } = entry;
  if (!href) return <>{name}</>;
  if (href.startsWith("/")) {
    return <Link href={href}>{name} ↗</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {name} ↗
    </a>
  );
}

export default function ExperienceBlock({
  label,
  entries,
}: {
  label: string;
  entries: Entry[];
}) {
  return (
    <div className="exp-block">
      <p className="exp-label">{label}</p>
      <div className="exp-list bleed">
        {entries.map((e) => (
          <div className="exp" key={e.name}>
            <span className="when">{e.when.toUpperCase()}</span>
            <div>
              <h3>
                <Name entry={e} />
              </h3>
              <span className="role">{e.role.toUpperCase()}</span>
            </div>
            <div>
              <p>{e.line}</p>
              {e.body?.map((b, i) => (
                <p className="body" key={i}>
                  {b}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
