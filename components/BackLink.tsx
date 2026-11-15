import Link from "next/link";

/** The only chrome on inner pages: one link up a level. */
export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="back-link" href={href}>
      ←︎ {label}
    </Link>
  );
}
