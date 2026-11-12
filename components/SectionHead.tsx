export default function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="section-top">
      <p className="eyebrow m-0">{eyebrow}</p>
      <div>
        <h1 className="display-title">{title}</h1>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
    </div>
  );
}
