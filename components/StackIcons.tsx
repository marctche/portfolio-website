import {
  siArduino,
  siBluetooth,
  siC,
  siClaude,
  siFlask,
  siGooglegemini,
  siGradle,
  siJunit5,
  siKotlin,
  siNextdotjs,
  siPostgresql,
  siPytest,
  siPython,
  siReact,
  siSpringboot,
  siSupabase,
  siTailwindcss,
  siTerraform,
  siThymeleaf,
  siTypescript,
  siVite,
  type SimpleIcon,
} from "simple-icons";

/** Stack names as written in lib/content.ts → their logo. Names without one render as text. */
const ICONS: Record<string, SimpleIcon> = {
  Arduino: siArduino,
  Bluetooth: siBluetooth,
  C: siC,
  Claude: siClaude,
  Flask: siFlask,
  Gemini: siGooglegemini,
  Gradle: siGradle,
  JUnit: siJunit5,
  Kotlin: siKotlin,
  "Next.js": siNextdotjs,
  PostgreSQL: siPostgresql,
  pytest: siPytest,
  Python: siPython,
  React: siReact,
  "Spring Boot": siSpringboot,
  Supabase: siSupabase,
  Tailwind: siTailwindcss,
  Terraform: siTerraform,
  Thymeleaf: siThymeleaf,
  TypeScript: siTypescript,
  Vite: siVite,
};

/** A project's stack as a row of monochrome logos, in ink. Hover shows the name. */
export default function StackIcons({ items, size = "md" }: { items: string[]; size?: "sm" | "md" }) {
  return (
    <ul className={`stack-icons stack-icons-${size}`} aria-label="stack">
      {items.map((name) => {
        const icon = ICONS[name];
        return (
          <li key={name} title={name}>
            {icon ? (
              <svg role="img" aria-label={name} viewBox="0 0 24 24" fill="currentColor">
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
