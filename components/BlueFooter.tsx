export type FooterLink = { label: string; href: string; external?: boolean };

/**
 * The blue block that ends the about page: big links, and nothing under them.
 */
export default function BlueFooter({
  eyebrow,
  heading,
  line,
  links,
  empty,
}: {
  eyebrow: string;
  heading?: string;
  line?: string;
  links: FooterLink[];
  /** Shown in place of the links when there are none. */
  empty?: string;
}) {
  return (
    <footer className="contact">
      <div className="section-top">
        <span className="eyebrow">{eyebrow}</span>
        {heading ? <h2 className="display-title">{heading}</h2> : null}
      </div>
      {line ? <p>{line}</p> : null}
      {links.length > 0 ? (
        <div className="contact-links">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </a>
          ))}
        </div>
      ) : empty ? (
        <p className="contact-empty">{empty}</p>
      ) : null}
    </footer>
  );
}
