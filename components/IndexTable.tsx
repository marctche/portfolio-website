import type { ReactNode } from "react";

export type IndexColumn = { key: string; label: string; width?: string };
export type IndexRow = { cells: Record<string, ReactNode> };

export default function IndexTable({
  columns,
  rows,
  ariaLabel,
}: {
  columns: IndexColumn[];
  rows: IndexRow[];
  ariaLabel: string;
}) {
  return (
    // Bleeds out of .section so the rules run edge to edge; the outer cells hold the gutter.
    <div className="bleed overflow-x-auto">
      <table className="index" aria-label={ariaLabel}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" style={c.width ? { width: c.width } : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c, ci) => (
                <td key={c.key}>
                  {ci === 0 ? (row.cells[c.key] ?? String(i + 1).padStart(2, "0")) : row.cells[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
