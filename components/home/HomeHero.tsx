"use client";

import Image from "next/image";
import type { EntryType } from "@/lib/types";

// ── Icons ────────────────────────────────────────────────────────────────────

function IconPin() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
}
function IconPhoto() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function IconSparkle() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
}

function NavHome()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>; }
function NavMap()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/><line x1="9" y1="4" x2="9" y2="17"/><line x1="15" y1="7" x2="15" y2="20"/></svg>; }
function NavCards()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="16" height="13" rx="2"/><path d="M6 3h14a2 2 0 0 1 2 2v13"/></svg>; }
function NavConnect() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/><path d="M8 10v4a4 4 0 0 0 4 4h.5"/></svg>; }
function NavProfile() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>; }

// ── Data ─────────────────────────────────────────────────────────────────────

type Entry = { type: EntryType; title: string; sub: string; icon: React.ReactNode };

const ENTRIES: Entry[] = [
  { type: "uncaptured",   title: "A moment I never captured",  sub: "For a memory that stayed, even without a photo.",               icon: <IconPin /> },
  { type: "photo-object", title: "A photo or object I kept",   sub: "For something you kept, even if others may not understand why.", icon: <IconPhoto /> },
  { type: "guided",       title: "Let HALO guide me",          sub: "For when you don't know where to start.",                        icon: <IconSparkle /> },
];

const NAV_TABS = [
  { label: "Home",        Icon: NavHome,    active: true  },
  { label: "Map",         Icon: NavMap,     active: false },
  { label: "Cards",       Icon: NavCards,   active: false },
  { label: "Connections", Icon: NavConnect, active: false },
  { label: "Profile",     Icon: NavProfile, active: false },
];

// ── Map teaser + tiny card hint ──────────────────────────────────────────────

function MapTeaser() {
  const A = "#c9a05a";
  return (
    <div className="hs-teaser">
      <p className="hs-teaser-label">YOUR MAP IS WAITING TO BE LIT</p>

      {/* Map constellation — 5 nodes, 4 connecting curves */}
      <div className="hs-teaser-visual" aria-hidden>
        <svg viewBox="0 0 280 36" preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", maxWidth: 280, height: 36, display: "block", margin: "0 auto" }}>
          {/* curves */}
          <path d="M 22,18 Q 60,6  100,20" fill="none" stroke={A} strokeWidth="1" opacity="0.55"/>
          <path d="M 100,20 Q 130,28 158,18" fill="none" stroke={A} strokeWidth="1" opacity="0.55"/>
          <path d="M 158,18 Q 188,8  218,22" fill="none" stroke={A} strokeWidth="1" opacity="0.55"/>
          <path d="M 218,22 Q 244,30 258,18" fill="none" stroke={A} strokeWidth="1" opacity="0.45"/>
          {/* filled nodes */}
          <circle cx="22"  cy="18" r="4"   fill={A} opacity="0.85"/>
          <circle cx="100" cy="20" r="3.5" fill={A} opacity="0.75"/>
          <circle cx="158" cy="18" r="5"   fill={A} opacity="0.90"/>
          <circle cx="218" cy="22" r="3"   fill={A} opacity="0.65"/>
          {/* hollow node — unlit future memory */}
          <circle cx="258" cy="18" r="3" fill="none" stroke={A} strokeWidth="1.2" opacity="0.5"/>
        </svg>
      </div>

      {/* Tiny moment card hint */}
      <div className="hs-card-hint" aria-hidden>
        <span className="hs-card-hint-label">MOMENT CARD</span>
        <p className="hs-card-hint-quote">&ldquo;I kept this longer than I needed to.&rdquo;</p>
      </div>

      <p className="hs-teaser-caption">One kept moment can begin a quiet map.</p>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function HomeHero({ onPick }: { onPick: (type: EntryType) => void }) {
  return (
    <>
      <div className="hs-screen">

        {/* LAYER 0 — full-screen background, pointer-events-none */}
        <div aria-hidden className="hs-bg">
          <Image
            src="/assets/home-hero-bg.png"
            alt=""
            fill
            sizes="430px"
            className="object-cover object-right-top"
            priority
            unoptimized
          />
          <div className="hs-bg-grad" />
        </div>

        {/* LAYER 1 — flex column, all UI content */}
        <div className="hs-content">

          {/* Top bar */}
          <div className="hs-topbar">
            <span className="hs-wordmark">HALO</span>
            <button type="button" aria-label="Menu" className="hs-menu-btn">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect width="17" height="2" rx="1" fill="currentColor"/>
                <rect y="5" width="17" height="2" rx="1" fill="currentColor"/>
                <rect y="10" width="17" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Hero copy — left column, right half is background visual */}
          <div className="hs-copy">
            <h1 className="hs-h1">Hello.<br />I see your<br />halo.</h1>
            <p className="hs-sub">Map the moments that made you.</p>
          </div>

          {/* Controlled spacer — lets hero breathe without leaving huge gap */}
          <div className="hs-spacer" />

          {/* Three entry cards — fixed height, uniform */}
          <div className="hs-cards">
            {ENTRIES.map((e) => (
              <button
                key={e.type}
                type="button"
                onClick={() => onPick(e.type)}
                className="hs-card"
              >
                <span className="hs-card-icon">{e.icon}</span>
                <span className="hs-card-body">
                  <span className="hs-card-title">{e.title}</span>
                  <span className="hs-card-sub">{e.sub}</span>
                </span>
                <span className="hs-card-arrow">→</span>
              </button>
            ))}
          </div>

          {/* Ultra-light map teaser — just a hint, not a section */}
          <MapTeaser />

        </div>
      </div>

      {/* LAYER 2 — fixed bottom nav */}
      <nav className="hs-nav" aria-label="Main navigation">
        {NAV_TABS.map(({ label, Icon, active }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`hs-nav-tab${active ? " hs-nav-tab--active" : ""}`}
          >
            <Icon />
            <span className="hs-nav-label">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
