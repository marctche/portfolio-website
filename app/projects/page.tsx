import Link from "next/link";
import BackLink from "@/components/BackLink";
import IndexTable from "@/components/IndexTable";
import SectionHead from "@/components/SectionHead";
import StackIcons from "@/components/StackIcons";
import { pages, projects } from "@/lib/content";

export const metadata = { title: "projects" };

const columns = [
  { key: "n", label: "#" },
  { key: "thing", label: "THING" },
  { key: "stack", label: "STACK" },
  { key: "year", label: "YEAR" },
  { key: "line", label: "IN ONE SENTENCE" },
];

export default function Projects() {
  const rows = projects
    .filter((p) => p.status === "public")
    .map((p) => ({
      cells: {
        thing: (
          <Link className="display-name" href={`/projects/${p.slug}`}>
            {p.name}{"\u00a0"}↗︎
          </Link>
        ),
        stack: <StackIcons items={p.stack} size="sm" />,
        year: p.year,
        line: p.oneLiner,
      },
    }));

  return (
    <>
      <main id="content">
        <section className="section">
          <BackLink href="/" label="home" />
          <SectionHead {...pages.projects} />
          <IndexTable ariaLabel="projects" columns={columns} rows={rows} />
        </section>
      </main>
    </>
  );
}
