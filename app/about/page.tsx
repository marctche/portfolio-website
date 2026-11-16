import BackLink from "@/components/BackLink";
import BlueFooter, { type FooterLink } from "@/components/BlueFooter";
import SectionHead from "@/components/SectionHead";
import { about, pages, profile } from "@/lib/content";

export const metadata = { title: "about" };

const links: FooterLink[] = [
  { label: "email", href: `mailto:${profile.email}` },
  { label: "github", href: profile.github, external: true },
  { label: "linkedin", href: profile.linkedin, external: true },
];

export default function About() {
  return (
    <>
      <main id="content">
        <section className="section">
          <BackLink href="/" label="home" />
          <SectionHead {...pages.about} intro={undefined} />
          <div className="about-body">
            <span className="label">THE SHORT VERSION</span>
            <div className="about-copy">
              {about.lead.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      </main>
      <BlueFooter
        eyebrow="SAY HI"
        heading={about.contactHeading}
        line={about.contactLine}
        links={links}
      />
    </>
  );
}
