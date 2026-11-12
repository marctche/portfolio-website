import Link from "next/link";

export default function Tile({
  n,
  title,
  line,
  href,
}: {
  n: string;
  title: string;
  line: string;
  href: string;
}) {
  return (
    <Link href={href} className="tile">
      <span className="tile-num">{n}</span>
      <span>
        <span className="tile-title block">{title}</span>
        <span className="block">{line}</span>
      </span>
    </Link>
  );
}
