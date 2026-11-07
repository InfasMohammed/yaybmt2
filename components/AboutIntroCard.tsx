import ParagraphMotion from "./ParagraphMotion";
import "../app/about-intro-card.css";

// Short scannable titles for the original supporting paragraphs (copy itself is unchanged).
const pointTitles = [
  "Competitive pricing, premium quality",
  "Long-term partnerships",
  "A quick, dependable quote",
];
const ranges = [
  "Marine locks",
  "Sanitary ware",
  "Ship chandlery & deck hardware",
  "Oilfield equipment",
  "Building materials",
  "Plumbing accessories",
  "Tools & fasteners",
];

export default function AboutIntroCard({
  paragraphs,
}: {
  paragraphs: string[];
}) {
  const [lead, ...points] = paragraphs;
  return (
    <div
      className="about-intro-card"
      role="region"
      aria-label="About YAYBMT"
      tabIndex={0}
    >
      <div className="about-intro-lead">
        <p>
          <ParagraphMotion text={lead} />
        </p>
        <ul className="about-intro-tags" aria-label="What we supply">
          {ranges.map((range) => (
            <li key={range}>{range}</li>
          ))}
        </ul>
      </div>
      <div className="about-intro-points">
        {points.map((text, i) => (
          <article className="about-intro-point" key={text}>
            <span className="about-intro-number" aria-hidden="true">
              0{i + 1}
            </span>
            <h2>{pointTitles[i] ?? "Why YAYBMT"}</h2>
            <p>
              <ParagraphMotion text={text} />
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
