import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";

export default function SitePage() {
  return (
    <main className="official-site" id="top">
      <SiteNav />

      {/* ── Section 1: Hero ── */}
      <section
        className="official-panel official-panel--top"
        aria-label="Every unseen moment carries its own halo."
      >
        <div className="official-hero-wrap">
          <Image
            src="/site/hero.png"
            alt="HALO landing page hero — every unseen moment carries its own halo."
            width={1672}
            height={941}
            sizes="100vw"
            className="official-hero-img"
            priority
            unoptimized
          />
          {/* Invisible hit areas over baked-in image buttons */}
          <Link
            href="/demo"
            aria-label="Map the Moments That Made Me"
            className="official-hit official-hit--primary"
          />
          <a
            href="#how-it-works"
            aria-label="See How HALO Works"
            className="official-hit official-hit--secondary"
          />
        </div>
      </section>

      {/* ── Section 2: How it works ── */}
      <section
        id="how-it-works"
        className="official-panel official-panel--how-it-works"
        aria-label="How HALO works"
      >
        <Image
          src="/site/how.png"
          alt="How HALO works: a small moment becomes a card, a question, and eventually a map."
          width={1672}
          height={941}
          sizes="100vw"
          className="official-panel__image official-panel__image--cover"
          unoptimized
        />
      </section>

      {/* ── Section 3: Memory Map ── */}
      <section
        id="memory-map"
        className="official-panel official-panel--memory-map"
        aria-label="Map the moments that made you"
      >
        <Image
          src="/site/map.png"
          alt="HALO memory map showing moment cards becoming nodes and arcs across a personal memory map."
          width={1672}
          height={941}
          sizes="100vw"
          className="official-panel__image"
          unoptimized
        />
      </section>

      {/* ── Section 4: Share a Moment ── */}
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

      {/* ── Section 5: Closing ── */}
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
