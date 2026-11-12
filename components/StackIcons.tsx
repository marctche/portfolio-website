import { siBluetooth, siClaude, siGooglegemini, siThymeleaf, type SimpleIcon } from "simple-icons";

/**
 * Stack names as written in lib/content.ts → their logo, in the brand's own colours.
 * Strings are full-colour devicon SVGs in public/stack/; SimpleIcon entries are logos devicon
 * doesn't have, drawn from simple-icons in their brand colour. Names in neither (AWS Lambda,
 * Recharts, API-Football) render as small text.
 */
const ICONS: Record<string, string | SimpleIcon> = {
  Arduino: "arduino",
  Bluetooth: siBluetooth,
  C: "c",
  Claude: siClaude,
  Flask: "flask",
  Gemini: siGooglegemini,
  Gradle: "gradle",
  JUnit: "junit",
  Kotlin: "kotlin",
  "Next.js": "nextjs",
  PostgreSQL: "postgresql",
  pytest: "pytest",
  Python: "python",
  React: "react",
  "Spring Boot": "spring",
  Supabase: "supabase",
  Tailwind: "tailwindcss",
  Terraform: "terraform",
  Thymeleaf: siThymeleaf,
  TypeScript: "typescript",
  Vite: "vite",
};

/** A project's stack as a row of colour logos. Hover shows the name. */
export default function StackIcons({ items, size = "md" }: { items: string[]; size?: "sm" | "md" }) {
  return (
    <ul className={`stack-icons stack-icons-${size}`} aria-label="stack">
      {items.map((name) => {
        const icon = ICONS[name];
        return (
          <li key={name} title={name}>
            {typeof icon === "string" ? (
              // Plain <img>: tiny static SVGs, nothing for next/image to optimise.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/stack/${icon}.svg`} alt={name} />
            ) : icon ? (
              <svg role="img" aria-label={name} viewBox="0 0 24 24" fill={`#${icon.hex}`}>
                <path d={icon.path} />
              </svg>
            ) : (
              <span className="stack-text">{name}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
