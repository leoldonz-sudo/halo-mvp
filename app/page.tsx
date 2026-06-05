import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";

const panels = [
  {
    id: "top",
    src: "/site/hero.png",
    alt: "HALO landing page hero showing a person stepping into warm light, with the message that every unseen moment carries its own halo.",
    label: "Every unseen moment carries its own halo.",
  },
  {
    id: "how-it-works",
    src: "/site/how.png",
    alt: "How HALO works: a small moment becomes a card, a question, and eventually a map.",
    label: "How HALO works",
  },
  {
    id: "memory-map",
    src: "/site/map.png",
    alt: "HALO memory map showing moment cards becoming nodes and arcs across a personal memory map.",
    label: "Map the moments that made you",
  },
] as const;

export default function SitePage() {
  return (
    <main className="official-site" id="top">
      <SiteNav />
      {panels.map((panel) => (
        <section
          key={panel.id}
          id={panel.id}
          className={`official-panel official-panel--${panel.id}`}
          aria-label={panel.label}
        >
          <Image
            src={panel.src}
            alt={panel.alt}
            width={1672}
            height={941}
            sizes="100vw"
            className="official-panel__image"
            priority={panel.id === "top"}
            unoptimized
          />
          {panel.id === "top" ? (
            <div className="official-hero-links" aria-label="Hero actions">
              <Link className="official-hotspot official-hotspot--primary" href="/demo">
                Map the Moments That Made Me
              </Link>
              <a className="official-hotspot official-hotspot--secondary" href="#how-it-works">
                See How HALO Works
              </a>
              <Link className="official-hotspot official-hotspot--try" href="/demo">
                Try HALO
              </Link>
            </div>
          ) : null}
        </section>
      ))}

      <section
        id="share-a-moment"
        className="official-panel official-panel--share"
        aria-label="Share a Moment"
      >
        <Image
          src="/site/share.png"
          alt="A HALO memory card shared between a daughter and her mother, surrounded by related memory fragments."
          width={1672}
          height={941}
          sizes="100vw"
          className="official-panel__image official-panel__image--cover"
          unoptimized
        />
      </section>

      <section
        id="closing"
        className="official-panel official-panel--closing"
        aria-label="Begin with One Moment"
      >
        <Image
          src="/site/closing.png"
          alt="Two loved ones sitting together in warm morning light, connected by glowing HALO memory cards."
          width={1672}
          height={941}
          sizes="100vw"
          className="official-panel__image official-panel__image--cover"
          unoptimized
        />
        <div className="official-closing-cta">
          <Link className="official-button" href="/demo">
            Try HALO
          </Link>
        </div>
      </section>
    </main>
  );
}
