"use client";

import Image from "next/image";
import type { EntryType } from "@/lib/types";

// ── Icons ────────────────────────────────────────────────────────────────────

function IconPin() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
}
function IconPhoto() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function IconSparkle() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
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

// ── Compact map preview (pure HTML + SVG, no images) ─────────────────────────
//
// viewBox 320 × 160  |  container: 100% wide × 160px tall
//
// Centre card: left=88 top=40 w=144 h=70 → centre (160,75)
// 3 nodes (w=108 h=32):
//   tl left=4  top=4   cx=58  cy=20
//   tr left=208 top=4  cx=262 cy=20
//   bl left=4  top=120 cx=58  cy=136

const AMBER = "#c9a05a";

function MapPreview() {
  // Card border points → node centres
  const paths = [
    { d: "M 110,40 Q 84,28 58,20"   },   // top-left node
    { d: "M 210,40 Q 236,28 262,20" },   // top-right node
    { d: "M 110,110 Q 84,124 58,136" },  // bottom-left node
  ];
  const cardDots  = [{ x: 110, y: 40 }, { x: 210, y: 40 }, { x: 110, y: 110 }];
  const nodeDots  = [{ x: 58,  y: 20 }, { x: 262, y: 20 }, { x: 58,  y: 136 }];
  const nodeChips = [
    { label: "A place I keep\nreturning to",        left:   4, top:   4 },
    { label: "The first meal\nthat felt like home",  left: 208, top:   4 },
    { label: "The day the city\nfelt familiar",      left:   4, top:  120 },
  ];

  return (
    <div style={{ position: "relative", width: "100%", height: 160 }}>
      {/* SVG lines — z-index 0, behind all HTML */}
      <svg
        viewBox="0 0 320 160"
        preserveAspectRatio="none"
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      >
        {paths.map((p, i)     => <path key={i} d={p.d} fill="none" stroke={AMBER} strokeWidth="1.2" opacity="0.6" />)}
        {cardDots.map((d, i)  => <circle key={`c${i}`} cx={d.x} cy={d.y} r="3" fill={AMBER} opacity="0.7" />)}
        {nodeDots.map((d, i)  => <circle key={`n${i}`} cx={d.x} cy={d.y} r="3" fill={AMBER} opacity="0.7" />)}
      </svg>

      {/* Centre moment card */}
      <div style={{ position: "absolute", left: 88, top: 40, width: 144, height: 70, display: "flex", gap: 7, background: "#fbfaf6", border: "1px solid #d8cbb8", borderRadius: 9, padding: "7px 8px", boxShadow: "0 2px 12px rgba(0,0,0,0.10)", zIndex: 2 }}>
        <div style={{ flexShrink: 0, width: 40, height: 52, borderRadius: 6, background: "linear-gradient(145deg,#ede8de,#ddd8cd)", border: "1px solid #d0c9bc" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0, paddingTop: 1 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 11.5, color: "#1a1814", lineHeight: 1.25 }}>The First Morning<br />in Singapore</span>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: "#9b5443", background: "rgba(155,84,67,0.11)", borderRadius: 3, padding: "1px 5px", width: "fit-content" }}>Starting Over</span>
          <span style={{ fontSize: 8.5, color: "#a8a29b" }}>• First kept moment</span>
        </div>
      </div>

      {/* Node chips */}
      {nodeChips.map((n) => (
        <span key={n.label} style={{ position: "absolute", left: n.left, top: n.top, width: 108, display: "block", background: "rgba(251,250,246,0.95)", border: "1px solid #d8cbb8", borderRadius: 16, padding: "4px 8px", fontSize: 10, color: "#5a554c", lineHeight: 1.3, whiteSpace: "pre-line", zIndex: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>{n.label}</span>
      ))}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function HomeHero({ onPick }: { onPick: (type: EntryType) => void }) {
  return (
    <>
      {/*
        ONE full-screen container.
        Background image fills the entire screen behind everything.
        Content is a flex column overlaid on top.
      */}
      <div className="hs-screen">

        {/* ── LAYER 0: full-screen background ── */}
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
          {/* gradient keeps left text legible, fades toward bottom so cards sit clearly */}
          <div className="hs-bg-grad" />
        </div>

        {/* ── LAYER 1: all visible content, flex column ── */}
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

          {/* Hero headline — left-aligned, uppercase serif */}
          <div className="hs-copy">
            <h1 className="hs-h1">Hello.<br />I see your halo.</h1>
            <p className="hs-sub">Map the moments that made you.</p>
            <p className="hs-body">Start with something you kept,<br />something you never captured,<br />or a gentle question from HALO.</p>
          </div>

          {/* Flex spacer — pushes cards toward lower screen */}
          <div style={{ flex: 1, minHeight: 12 }} />

          {/* Three entry cards */}
          <div className="hs-cards">
            {ENTRIES.map((e) => (
              <button key={e.type} type="button" onClick={() => onPick(e.type)} className="hs-card">
                <span className="hs-card-icon">{e.icon}</span>
                <span className="hs-card-body">
                  <span className="hs-card-title">{e.title}</span>
                  <span className="hs-card-sub">{e.sub}</span>
                </span>
                <span className="hs-card-arrow">→</span>
              </button>
            ))}
          </div>

          {/* Compact map preview */}
          <div className="hs-map">
            <p className="hs-map-label">YOUR MAP IS WAITING TO BE LIT</p>
            <MapPreview />
            <div className="hs-map-zones">
              <span>BELONGING</span>
              <span>THINGS I CARRIED</span>
            </div>
          </div>

        </div>{/* /hs-content */}
      </div>{/* /hs-screen */}

      {/* ── LAYER 2: fixed bottom nav ── */}
      <nav className="hs-nav" aria-label="Main navigation">
        {NAV_TABS.map(({ label, Icon, active }) => (
          <button key={label} type="button" aria-label={label} aria-current={active ? "page" : undefined} className={`hs-nav-tab${active ? " hs-nav-tab--active" : ""}`}>
            <Icon />
            <span className="hs-nav-label">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
