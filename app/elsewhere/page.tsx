import BackLink from "@/components/BackLink";
import SectionHead from "@/components/SectionHead";
import { pages } from "@/lib/content";

export const metadata = { title: "elsewhere" };

export default function Elsewhere() {
  return (
    <>
      <main id="content">
        <div className="section">
          <BackLink href="/" label="home" />
          <SectionHead {...pages.elsewhere} />
        </div>
      </main>
    </>
  );
}
