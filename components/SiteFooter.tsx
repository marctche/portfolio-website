import { profile } from "@/lib/content";

/** Plain footer for inner pages that don't end in a BlueFooter. Not on the home page. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© {profile.name}</span>
      <a href="#content">back to top ↑</a>
    </footer>
  );
}
