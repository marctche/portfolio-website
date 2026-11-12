export default function SectionHead({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="section-top">
      <div>
        <h1 className="display-title">{title}</h1>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
    </div>
  );
}
