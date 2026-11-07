import ParagraphMotion from "./ParagraphMotion";
import { contactPage } from "../data/contact-page";
import { contacts } from "../data/contacts";
import { whatsapp } from "../lib/site";

const stocked = [
  "Staco marine locks",
  "Kopat marine locks",
  "Horse marine locks",
  "Royal Co marine locks",
  "Daelim sanitary ware",
  "PPR & uPVC fittings",
  "Fasteners & abrasives",
];

export default function ContactIntroCard({
  paragraphs,
}: {
  paragraphs: string[];
}) {
  const copy = paragraphs.filter(
    (text) => text.trim() !== contactPage.introHeading,
  );
  const action = copy.length > 1 ? copy[copy.length - 1] : undefined;
  const body = action ? copy.slice(0, -1) : copy;
  return (
    <section
      className="contact-intro-card"
      data-page-reveal
      aria-labelledby="contact-intro-heading"
    >
      <p className="eyebrow">LET’S CONNECT</p>
      <h2 id="contact-intro-heading">{contactPage.introHeading}</h2>
      <div className="contact-intro-copy">
        <div className="contact-intro-text">
          {body.map((text) => (
            <p key={text}>
              <ParagraphMotion text={text} />
            </p>
          ))}
          <ul className="contact-intro-tags" aria-label="Ranges we stock">
            {stocked.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {action && (
          <aside className="contact-intro-action">
            <p>
              <ParagraphMotion text={action} />
            </p>
            <a className="button button-whatsapp" href={whatsapp()}>
              <img
                src="/images/icons/whatsapp.svg"
                alt=""
                width="20"
                height="20"
              />
              Chat on WhatsApp
            </a>
            <a className="button outline" href={contacts.telephoneHref}>
              Call {contacts.telephone}
            </a>
          </aside>
        )}
      </div>
    </section>
  );
}
