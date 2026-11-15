import Link from "next/link";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import type { FooterLink } from "@/components/BlueFooter";
import FeatureLayout from "@/components/FeatureLayout";
import StackIcons from "@/components/StackIcons";
import { projectLinks, projects } from "@/lib/content";

/** Every public project has a page, in table order. */
const list = projects.filter((p) => p.status === "public");

export function generateStaticParams() {
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = list.find((p) => p.slug === slug);
  if (!project) return { title: "projects" };
  return { title: project.keepCase ? project.name : project.name.toLowerCase() };
}

function Beat({ label, paras }: { label: string; paras?: string[] }) {
  if (!paras?.length) return null;
  return (
    <div className="beat">
      <span className="beat-label">{label}</span>
      {paras.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = list.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const { name, keepCase, team, year, stack, links, detail } = list[i];
  const prev = i > 0 ? list[i - 1] : null;
  const next = i < list.length - 1 ? list[i + 1] : null;
  const kicker = [String(i + 1).padStart(3, "0"), team, year]
    .filter(Boolean)
    .join(" / ")
    .toUpperCase();
  const footerLinks: FooterLink[] = [];
  if (links.repo) footerLinks.push({ label: projectLinks.repo, href: links.repo, external: true });
  if (links.live) footerLinks.push({ label: projectLinks.live, href: links.live, external: true });
  const hasAside = Boolean(detail.interesting?.length || detail.next?.length);
  const story = (
    <div className="beats">
      <Beat label="WHAT IT IS" paras={detail.what} />
      <Beat label="WHY IT EXISTS" paras={detail.why} />
      <Beat label="MY PART" paras={detail.mine} />
      {hasAside ? (
        <div className="tiny-grid">
          <Beat label="THE INTERESTING PART" paras={detail.interesting} />
          <Beat label="WHAT I'D CHANGE" paras={detail.next} />
        </div>
      ) : null}
    </div>
  );
  const linksBox = (
    <div className="proj-links">
      <span className="eyebrow">{projectLinks.eyebrow}</span>
      {footerLinks.length > 0 ? (
        <div className="contact-links">
          {footerLinks.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      ) : (
        <p className="contact-empty">{projectLinks.empty}</p>
      )}
    </div>
  );

  return (
    <>
      <main id="content">
        <section className="section section-flush">
          <BackLink href="/projects" label="projects" />
          <FeatureLayout
            kicker={kicker}
            name={keepCase ? name : name.toLowerCase()}
            stackLine={<StackIcons items={stack} />}
            side={linksBox}
            foot={
              <nav className="proj-nav" aria-label="more projects">
                {prev ? <Link href={`/projects/${prev.slug}`}>←︎ previous: {prev.name}</Link> : <span />}
                {next ? <Link href={`/projects/${next.slug}`}>next: {next.name} →︎</Link> : <span />}
              </nav>
            }
          >
            <p className="lead">{detail.lead}</p>
            {story}
          </FeatureLayout>
        </section>
      </main>
    </>
  );
}
