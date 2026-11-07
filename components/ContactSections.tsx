import ScrollVideo from "./ScrollVideo";
import ContainerScroll from "./ui/container-scroll";
import { welcome } from "../data/welcome";
import { contacts } from "../data/contacts";
import { contactPage } from "../data/contact-page";
import { whatsapp } from "../lib/site";
import ContactEnquiry from "./ContactEnquiry";
import "../app/contact-cards.css";

function ContactIcon({
  type,
}: {
  type: "location" | "hours" | "message" | "phone";
}) {
  return (
    <svg
      className="contact-card-icon"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === "location" ? (
        <>
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      ) : type === "hours" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ) : type === "message" ? (
        <>
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z" />
          <path d="M7 9h10M7 13h7" />
        </>
      ) : (
        <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z" />
      )}
    </svg>
  );
}

export default function ContactSections() {
  return (
    <>
      <div className="contact-details-grid">
        <section className="contact-detail-card" data-page-reveal>
          <ContactIcon type="location" />
          <h2>Our Location</h2>
          <address>{contactPage.address}</address>
          <a className="text-link" href={contacts.maps}>
            View on Google Maps
          </a>
        </section>
        <section className="contact-detail-card" data-page-reveal>
          <ContactIcon type="hours" />
          <h2>Opening Hours</h2>
          {contactPage.hours.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>
        <section className="contact-detail-card" data-page-reveal>
          <ContactIcon type="message" />
          <h2>WhatsApp Us</h2>
          <a href={whatsapp()}>WhatsApp {contacts.whatsapp}</a>
        </section>
        <section className="contact-detail-card" data-page-reveal>
          <ContactIcon type="phone" />
          <h2>Call Us</h2>
          <a href={contacts.telephoneHref}>{contacts.telephone}</a>
        </section>
      </div>
      <div className="contact-enquiry-row">
        <section
          className="contact-video contact-panel"
          data-page-reveal
          aria-labelledby="contact-video-heading"
        >
          <div className="contact-panel-heading">
            <p className="eyebrow">INSIDE YAYBMT</p>
            <h2 id="contact-video-heading">See our showroom and brands</h2>
            <p>
              Marine locks, sanitary ware and building materials, all in one
              place in Deira, Dubai.
            </p>
          </div>
          <ContainerScroll className="contact-video-scroll">
            <figure data-video-card className="home-video-card">
              <div className="home-video-bar">
                <span className="home-video-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span>YUSUF AL YOUSFI / DUBAI</span>
                <span className="home-video-badge">Since 2004</span>
              </div>
              <div className="home-video-frame">
                <ScrollVideo src={welcome.video} poster={welcome.poster} />
              </div>
            </figure>
          </ContainerScroll>
        </section>
        <ContactEnquiry />
      </div>
    </>
  );
}
