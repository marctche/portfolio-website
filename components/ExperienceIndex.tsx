"use client";

import Link from "next/link";
import { useState } from "react";
import Scramble from "@/components/Scramble";
import type { Entry } from "@/lib/content";

export type ExperienceGroup = { label: string; entries: Entry[] };

function Name({ entry }: { entry: Entry }) {
  const { name, href } = entry;
  const text = <Scramble text={name} />;
  if (!href) return text;
  if (href.startsWith("/")) return <Link href={href}>{text} ↗</Link>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {text} ↗
    </a>
  );
}

/**
 * The selected entry in full: group and year, name, role, one-liner, then its paragraphs.
 * On a switch, the short lines glitch into place (Scramble) and the paragraphs fade up.
 */
function Detail({ group, entry }: { group: string; entry: Entry }) {
  return (
    <>
      <span className="xp-kicker">
        <Scramble text={`${group} · ${entry.when.toUpperCase()}`} />
      </span>
      <h2 className="xp-name">
        <Name entry={entry} />
      </h2>
      <span className="xp-role">
        <Scramble text={entry.role.toUpperCase()} />
      </span>
      <p className="xp-line">
        <Scramble text={entry.line} />
      </p>
      {entry.body?.length ? (
        // Keyed by entry, so it remounts on a switch and its fade-up plays again.
        <div className="xp-body" key={entry.name}>
          {entry.body.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div>
      ) : null}
    </>
  );
}

/**
 * Experience as an index and a panel, on the project pages' 1fr / 2fr grid. Left: every
 * entry, grouped, as name + role · year. Right: the selected entry in full. It opens on
 * `initial` (the pro bono work), so that is on screen the moment the page loads. Under
 * 800px the panel moves inline, under the selected row.
 */
export default function ExperienceIndex({ groups, initial }: { groups: ExperienceGroup[]; initial: string }) {
  const [selected, setSelected] = useState(initial);
  const all = groups.flatMap((g) => g.entries.map((e) => ({ group: g.label, entry: e })));
  const current = all.find((x) => x.entry.name === selected) ?? all[0];

  return (
    <div className="xp bleed">
      <div className="xp-list">
        {groups.map((g) => (
          <div className="xp-group" key={g.label}>
            <p className="xp-label">{g.label}</p>
            <ul>
              {g.entries.map((e) => {
                const on = e.name === current.entry.name;
                return (
                  <li key={e.name}>
                    <button
                      type="button"
                      className="xp-item"
                      aria-current={on ? "true" : undefined}
                      aria-controls="xp-panel"
                      onClick={() => setSelected(e.name)}
                    >
                      <span className="xp-item-name">{e.name}</span>
                      <span className="xp-item-meta">
                        {e.role} · {e.when}
                      </span>
                    </button>
                    {on ? (
                      <div className="xp-inline">
                        <Detail group={g.label} entry={e} />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <article className="xp-panel" id="xp-panel" aria-live="polite">
        <Detail group={current.group} entry={current.entry} />
      </article>
    </div>
  );
}
