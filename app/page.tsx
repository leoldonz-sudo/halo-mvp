import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";

export default function SitePage() {
  return (
    <>
      <SiteNav />

      {/* S1 — HERO */}
      <section className="site-section" aria-labelledby="hero-heading">
        <Image
          src="/site/hero.png"
          fill
          sizes="100vw"
          className="site-section__bg"
          alt=""
          priority
        />
        <div className="site-hero-overlay" aria-hidden="true" />
        <div className="site-hero-content">
          <h1 id="hero-heading" className="site-h1">
            Turn ordinary moments into memory cards someone you care about can answer.
          </h1>
          <p className="site-sub">
            HALO helps you save a small personal moment, turn it into a keepsake card, and share it with a question that invites someone you care about to tell their side of the story.
          </p>
          <div className="site-hero-ctas">
            <Link href="/demo" className="site-btn-primary">
              Try the demo
            </Link>
            <a href="#how-it-works" className="site-btn-ghost">
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* S2 — HOW IT WORKS */}
      <section id="how-it-works" className="site-how" aria-labelledby="how-heading">
        <div className="site-how__header">
          <h2 id="how-heading" className="site-h2">How HALO works</h2>
          <p className="site-lead">
            A small moment becomes a card, a question, and eventually a map of shared memory.
          </p>
        </div>
        <ol className="site-steps" aria-label="Three steps">
          <li className="site-step">
            <span className="site-step__num" aria-hidden="true">01</span>
            <h3 className="site-step__title">Save a moment</h3>
            <p className="site-step__body">
              Write, speak, or capture a small moment that stayed with you.
            </p>
          </li>
          <li className="site-step">
            <span className="site-step__num" aria-hidden="true">02</span>
            <h3 className="site-step__title">HALO makes a card</h3>
            <p className="site-step__body">
              HALO turns that memory into a calm, shareable keepsake card.
            </p>
          </li>
          <li className="site-step">
            <span className="site-step__num" aria-hidden="true">03</span>
            <h3 className="site-step__title">Share with a question</h3>
            <p className="site-step__body">
              Send it to someone you care about, with a question only they can answer.
            </p>
          </li>
        </ol>
      </section>

      {/* S3 — MEMORY BECOMES CONVERSATION */}
      <section
        className="site-section site-section--conv"
        aria-labelledby="conv-heading"
      >
        <Image
          src="/site/share.png"
          fill
          sizes="100vw"
          className="site-section__bg"
          alt="A daughter shares a memory card with her mother"
        />
        <div className="site-conv-overlay" aria-hidden="true" />
        <div className="site-conv-content">
          <div className="site-conv-text">
            <h2 id="conv-heading" className="site-h2 site-h2--light">
              A memory can become a question only someone close to you can answer.
            </h2>
            <p className="site-lead site-lead--light">
              What begins as your own moment can open a deeper conversation — with a parent, partner, friend, or someone who quietly shaped your life.
            </p>
          </div>
          <div className="site-card" role="img" aria-label="Example HALO memory card: The First Morning in Singapore">
            <div className="site-card__meta">
              <span className="site-card__brand">HALO Moment</span>
            </div>
            <h3 className="site-card__title">The First Morning in Singapore</h3>
            <p className="site-card__body">
              I arrived exhausted and didn&rsquo;t know what to do first. I sat alone at the airport and slept on the seats until morning. I felt nervous, lonely, and very far from home.
            </p>
            <p className="site-card__reflection">
              That was the night I learned I could carry myself through uncertainty.
            </p>
            <div className="site-card__prompt">
              <span className="site-card__prompt-label">A question for Mom</span>
              <p className="site-card__prompt-text">
                Mom, how did you feel when you first left home?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S4 — MEMORY MAP */}
      <section
        className="site-section site-section--map"
        aria-labelledby="map-heading"
      >
        <Image
          src="/site/map.png"
          fill
          sizes="100vw"
          className="site-section__bg"
          alt="Two people connected through a shared memory map"
        />
        <div className="site-map-overlay" aria-hidden="true" />
        <div className="site-map-content">
          <h2 id="map-heading" className="site-h2 site-h2--light">
            Over time, these answered moments become a map of shared memory.
          </h2>
          <p className="site-lead site-lead--light site-map-lead">
            HALO connects saved moments across people, themes, and life stages — so you can begin to see not just isolated memories, but the hidden shape of how you and the people you care about became who you are.
          </p>
          <div className="site-themes" aria-label="Example memory themes">
            <span className="site-theme">Leaving Home</span>
            <span className="site-theme">First Times</span>
            <span className="site-theme">People Who Stayed</span>
            <span className="site-theme">Things We Never Asked</span>
          </div>
        </div>
      </section>

      {/* S5 — FINAL CTA */}
      <section className="site-cta-section" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="site-cta-section__heading">
          Start with one moment.<br />Let HALO open the rest.
        </h2>
        <p className="site-cta-section__sub">
          Create your first memory card and see how a small moment can begin a larger conversation with someone who matters.
        </p>
        <div className="site-cta-section__actions">
          <Link href="/demo" className="site-btn-primary site-btn-primary--ink">
            Try HALO
          </Link>
          <Link href="/demo" className="site-btn-outline">
            Open demo →
          </Link>
        </div>
        <p className="site-cta-section__note">No sign-in needed</p>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <span>HALO</span>
        <span className="site-footer__dot">·</span>
        <span>made at NTU Hackathon 2026</span>
      </footer>
    </>
  );
}
