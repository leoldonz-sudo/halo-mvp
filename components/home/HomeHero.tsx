"use client";

import Image from "next/image";
import type { EntryType } from "@/lib/types";
import { XiaomanAvatar } from "@/components/XiaomanAvatar";

// ── Entry card icons ─────────────────────────────────────────────────────────

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

function IconPhoto() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
}

// ── Bottom nav icons ─────────────────────────────────────────────────────────

function NavHome()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>; }
function NavMap()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/><line x1="9" y1="4" x2="9" y2="17"/><line x1="15" y1="7" x2="15" y2="20"/></svg>; }
function NavCards()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="16" height="13" rx="2"/><path d="M6 3h14a2 2 0 0 1 2 2v13"/></svg>; }
function NavConnect() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/><path d="M8 10v4a4 4 0 0 0 4 4h.5"/></svg>; }
function NavProfile() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>; }

// ── Data ─────────────────────────────────────────────────────────────────────

type Entry = { type: EntryType; title: string; sub: string; icon: React.ReactNode };

const ENTRIES: Entry[] = [
  { type: "uncaptured",   title: "A moment I never captured",  sub: "For a memory that stayed, even without a photo.",              icon: <IconPin /> },
  { type: "photo-object", title: "A photo or object I kept",   sub: "For something you kept, even if others may not understand why.", icon: <IconPhoto /> },
  { type: "guided",       title: "Let HALO guide me",          sub: "For when you don't know where to start.",                       icon: <IconSparkle /> },
];

const MAP_NODES = [
  { label: "A place I keep returning to",      pos: "top-[14%] left-[4%]" },
  { label: "The first meal that felt like home", pos: "top-[14%] right-[3%]" },
  { label: "Calling my mother after I arrived",  pos: "bottom-[25%] left-[3%]" },
  { label: "The night I almost gave up",         pos: "bottom-[10%] left-[22%]" },
  { label: "The day the city felt familiar",     pos: "bottom-[10%] right-[4%]" },
];

const NAV_TABS = [
  { label: "Home",        Icon: NavHome,    active: true  },
  { label: "Map",         Icon: NavMap,     active: false },
  { label: "Cards",       Icon: NavCards,   active: false },
  { label: "Connections", Icon: NavConnect, active: false },
  { label: "Profile",     Icon: NavProfile, active: false },
];

// ── Component ────────────────────────────────────────────────────────────────

export function HomeHero({ onPick }: { onPick: (type: EntryType) => void }) {
  return (
    <div className="hh-root">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hh-hero">

        {/* Background: floating cards + amber glow (pointer-events-none) */}
        <div aria-hidden className="hh-hero-bg pointer-events-none">
          <Image
            src="/assets/home-hero-bg.png"
            alt=""
            fill
            sizes="430px"
            className="object-cover object-right-top"
            priority
            unoptimized
          />
          {/* left-side readability gradient */}
          <div className="hh-hero-grad" />
        </div>

        {/* Top bar: wordmark + menu */}
        <div className="hh-topbar">
          <span className="hh-wordmark">HALO</span>
          <button type="button" aria-label="Menu" className="hh-menu-btn">
            <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
              <rect width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="5.5" width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="11" width="18" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* HALO sun mascot — decorative, right side */}
        <div aria-hidden className="hh-mascot pointer-events-none">
          <XiaomanAvatar size={68} mood="idle" />
        </div>

        {/* Real selectable headline text */}
        <div className="hh-copy">
          <h1 className="hh-h1">Hello.<br />I see your halo.</h1>
          <p className="hh-sub">Map the moments<br />that made you.</p>
          <p className="hh-body">
            Start with something you kept,<br />
            something you never captured,<br />
            or a gentle question from HALO.
          </p>
        </div>
      </section>

      {/* ── ENTRY CARDS ───────────────────────────────────────── */}
      <div className="hh-cards">
        {ENTRIES.map((e) => (
          <button
            key={e.type}
            type="button"
            onClick={() => onPick(e.type)}
            className="hh-card"
          >
            <span className="hh-card-icon-wrap">{e.icon}</span>
            <span className="hh-card-body">
              <span className="hh-card-title">{e.title}</span>
              <span className="hh-card-sub">{e.sub}</span>
            </span>
            <span className="hh-card-arrow">→</span>
          </button>
        ))}
      </div>

      {/* ── MAP PREVIEW PANEL ─────────────────────────────────── */}
      <section className="hh-map-panel">
        <p className="hh-map-eyebrow">YOUR MAP IS WAITING TO BE LIT</p>

        <div className="hh-map-visual">
          {/* real map image as base */}
          <Image
            src="/assets/home-map.png"
            alt="Memory map preview"
            fill
            sizes="390px"
            className="object-contain object-center"
            unoptimized
          />

          {/* surrounding memory nodes overlaid on map */}
          {MAP_NODES.map(({ label, pos }) => (
            <span key={label} className={`hh-map-node ${pos}`}>{label}</span>
          ))}

          {/* centre moment card */}
          <div className="hh-map-card">
            <div className="hh-map-card-thumb" />
            <div className="hh-map-card-info">
              <span className="hh-map-card-title">The First Morning<br />in Singapore</span>
              <span className="hh-map-card-tag">Starting Over</span>
              <span className="hh-map-card-dot">• First kept moment</span>
            </div>
          </div>
        </div>

        {/* zone labels */}
        <div className="hh-map-zones">
          <span>Belonging</span>
          <span>Things I Carried</span>
        </div>
      </section>

      {/* ── BOTTOM NAV ────────────────────────────────────────── */}
      <nav className="hh-nav" aria-label="Main navigation">
        {NAV_TABS.map(({ label, Icon, active }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`hh-nav-tab${active ? " hh-nav-tab--active" : ""}`}
          >
            <Icon />
            <span className="hh-nav-label">{label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
