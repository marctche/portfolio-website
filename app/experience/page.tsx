import BackLink from "@/components/BackLink";
import ExperienceBlock from "@/components/ExperienceBlock";
import SectionHead from "@/components/SectionHead";
import SiteFooter from "@/components/SiteFooter";
import { experience, pages } from "@/lib/content";

export const metadata = { title: "experience" };

export default function Experience() {
  return (
    <>
      <main id="content">
        <section className="section">
          <BackLink href="/" label="home" />
          <SectionHead {...pages.experience} />
          <ExperienceBlock label="WORK" entries={experience.work} />
          <ExperienceBlock label="PRO BONO" entries={experience.proBono} />
          <ExperienceBlock label="INVOLVEMENT" entries={experience.involvement} />
          <ExperienceBlock label="HACKS" entries={experience.hacks} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
