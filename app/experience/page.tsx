import BackLink from "@/components/BackLink";
import ExperienceIndex from "@/components/ExperienceIndex";
import SectionHead from "@/components/SectionHead";
import { experience, pages } from "@/lib/content";

export const metadata = { title: "experience" };

// Three groups. The Accenture pro bono engagement leads Involvement (its write-up says it
// was pro bono), so there's no separate pro bono heading.
const groups = [
  { label: "WORK", entries: experience.work },
  { label: "INVOLVEMENT", entries: [...experience.proBono, ...experience.involvement] },
  { label: "HACKATHONS", entries: experience.hacks },
];

export default function Experience() {
  return (
    <>
      <main id="content">
        <section className="section">
          <BackLink href="/" label="home" />
          <SectionHead {...pages.experience} />
          {/* Opens on the Accenture pro bono work, so it's on screen as soon as the page loads. */}
          <ExperienceIndex groups={groups} initial={experience.proBono[0].name} />
        </section>
      </main>
    </>
  );
}
