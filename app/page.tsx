import Link from "next/link";
import Image from "next/image";

// Shared debug classname — remove bg-red-500/20 and border-red-500 after confirming positions
const HIT = "absolute z-50 cursor-pointer pointer-events-auto bg-red-500/20 border border-red-500";

export default function SitePage() {
  return (
    <main className="official-site" id="top">

      {/* ── Section 1: Hero — image is the only visible UI, hit areas scale with img ── */}
      <section
        className="official-panel official-panel--top"
        aria-label="Every unseen moment carries its own halo."
      >
        {/*
          Relative wrapper = positioning context for all hit areas.
          img width:100% height:auto ensures the container height exactly
          matches the rendered image height at every viewport width.
        */}
        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/site/hero.png"
            alt="HALO hero"
            style={{ display: "block", width: "100%", height: "auto" }}
          />

          {/* ── Baked-in TOP NAV hit areas ── */}
          <a
            href="#how-it-works"
            aria-label="How it works"
            className={HIT}
            style={{ left: "61%", top: "4%", width: "9%", height: "5%" }}
          />
          <a
            href="#memory-map"
            aria-label="Memory Map"
            className={HIT}
            style={{ left: "72%", top: "4%", width: "10%", height: "5%" }}
          />
          <a
            href="#share-a-moment"
            aria-label="Share a moment"
            className={HIT}
            style={{ left: "82%", top: "4%", width: "10%", height: "5%" }}
          />
          <Link
            href="/demo"
            aria-label="Try HALO"
            className={HIT}
            style={{ left: "91%", top: "3.5%", width: "8%", height: "6%" }}
          />

          {/* ── Baked-in HERO CTA hit areas ── */}
          <Link
            href="/demo"
            aria-label="Map the Moments That Made Me"
            className={HIT}
            style={{ left: "2.2%", top: "74%", width: "24%", height: "7%" }}
          />
          <a
            href="#how-it-works"
            aria-label="See How HALO Works"
            className={HIT}
            style={{ left: "29%", top: "75%", width: "16%", height: "6%" }}
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
          alt="HALO memory map showing moment cards becoming nodes and arcs."
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
          alt="A HALO memory card shared between a daughter and her mother."
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
          alt="Two loved ones sitting together in warm morning light."
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
