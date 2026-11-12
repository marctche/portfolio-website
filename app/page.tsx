import Tile from "@/components/Tile";
import TypedLine from "@/components/TypedLine";
import { home } from "@/lib/content";

export default function Home() {
  return (
    <main id="content">
      <section className="hero">
        <div className="hero-core">
          <div className="hero-copy">
            <h1 className="display-hero">{home.greeting}</h1>
            <TypedLine className="display-hero" lines={home.lines} />
          </div>
        </div>
        <div className="tiles">
          {home.tiles.map((t) => (
            <Tile key={t.href} {...t} />
          ))}
        </div>
      </section>
    </main>
  );
}
