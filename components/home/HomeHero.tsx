"use client";

import Image from "next/image";
import type { EntryType } from "@/lib/types";

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

// ── Entry card data ───────────────────────────────────────────────────────────

type Entry = { type: EntryType; title: string; sub: string; icon: React.ReactNode };

const ENTRIES: Entry[] = [
  { type: "uncaptured",   title: "A moment I never captured",  sub: "For a memory that stayed, even without a photo.",              icon: <IconPin /> },
  { type: "photo-object", title: "A photo or object I kept",   sub: "For something you kept, even if others may not understand why.", icon: <IconPhoto /> },
  { type: "guided",       title: "Let HALO guide me",          sub: "For when you don't know where to start.",                       icon: <IconSparkle /> },
];

const NAV_TABS = [
  { label: "Home",        Icon: NavHome,    active: true  },
  { label: "Map",         Icon: NavMap,     active: false },
  { label: "Cards",       Icon: NavCards,   active: false },
  { label: "Connections", Icon: NavConnect, active: false },
  { label: "Profile",     Icon: NavProfile, active: false },
];

// ── Memory Map — pure HTML/SVG, no image ─────────────────────────────────────
//
// Layout coordinate system: viewBox "0 0 320 300"
// The container is 100% wide × 300px tall (position: relative).
// All nodes use `left` (never `right`) to avoid TS union issues.
//
//  Node positions (left, top, width=116, height=38):
//   tl: (4,   10)  → centre (62, 29)
//   tr: (200, 10)  → centre (258, 29)
//   ml: (4,  131)  → centre (62, 150)
//   bl: (10, 236)  → centre (68, 255)
//   br: (200,236)  → centre (258, 255)
//
//  Centre card: left=82, top=108, w=156, h=84 → centre (160,150)
//  Card connection points:
//   top-L:  (110, 108)   top-R:  (210, 108)
//   left-C: ( 82, 150)
//   bot-L:  (110, 192)   bot-R:  (210, 192)

const AMBER = "#c9a05a";
const DOT_R = 3.5;

type NodeDef = { key: string; label: string; left: number; top: number; cx: number; cy: number };

// 3-node compact layout — viewBox "0 0 320 240"
// Centre card: left=84, top=78, w=152, h=76 → centre (160,116)
const NODES: NodeDef[] = [
  { key: "tl", label: "A place I keep\nreturning to",        left:   4, top:  8,  cx:  59, cy: 25 },
  { key: "tr", label: "The first meal\nthat felt like home", left: 206, top:  8,  cx: 261, cy: 25 },
  { key: "br", label: "The day the city\nfelt familiar",     left: 206, top: 186, cx: 261, cy: 203 },
];

const PATHS = [
  { from: { x: 110, y:  78 }, to: { cx:  59, cy:  25 }, cp: { x:  84, y:  50 } },  // → tl
  { from: { x: 210, y:  78 }, to: { cx: 261, cy:  25 }, cp: { x: 236, y:  50 } },  // → tr
  { from: { x: 210, y: 154 }, to: { cx: 261, cy: 203 }, cp: { x: 236, y: 178 } },  // → br
];

function MemoryMap() {
  return (
    <div style={{ position: "relative", width: "100%", height: 240 }}>

      {/* ── SVG layer — always behind HTML elements ── */}
      <svg
        viewBox="0 0 320 240"
        preserveAspectRatio="none"
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 0,
        }}
      >
        {/* connection lines */}
        {PATHS.map((p, i) => (
          <path
            key={i}
            d={`M ${p.from.x},${p.from.y} Q ${p.cp.x},${p.cp.y} ${p.to.cx},${p.to.cy}`}
            fill="none"
            stroke={AMBER}
            strokeWidth="1.25"
            opacity="0.6"
          />
        ))}
        {/* dots at card border exit points */}
        {PATHS.map((p, i) => (
          <circle key={`cd-${i}`} cx={p.from.x} cy={p.from.y} r={DOT_R} fill={AMBER} opacity="0.75" />
        ))}
        {/* dots at node entry points */}
        {NODES.map((n) => (
          <circle key={`nd-${n.key}`} cx={n.cx} cy={n.cy} r={DOT_R} fill={AMBER} opacity="0.75" />
        ))}
      </svg>

      {/* ── Centre moment card ── */}
      <div style={{
        position: "absolute",
        left: 84, top: 78,
        width: 152, height: 76,
        display: "flex",
        gap: 8,
        background: "#fbfaf6",
        border: "1px solid #d8cbb8",
        borderRadius: 10,
        padding: "8px 10px",
        boxShadow: "0 3px 16px rgba(0,0,0,0.10)",
        zIndex: 2,
      }}>
        {/* thumbnail placeholder */}
        <div style={{
          flexShrink: 0, width: 48, height: 60,
          borderRadius: 7,
          background: "linear-gradient(145deg, #ede8de, #ddd8cd)",
          border: "1px solid #d0c9bc",
        }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0, paddingTop: 1 }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 12.5,
            color: "#1a1814",
            lineHeight: 1.25,
            display: "block",
          }}>
            The First Morning<br />in Singapore
          </span>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#9b5443",
            background: "rgba(155,84,67,0.11)",
            borderRadius: 4,
            padding: "1px 6px",
            width: "fit-content",
            letterSpacing: "0.02em",
          }}>
            Starting Over
          </span>
          <span style={{ fontSize: 9, color: "#a8a29b", lineHeight: 1.3 }}>
            • First kept moment
          </span>
        </div>
      </div>

      {/* ── Surrounding node chips ── */}
      {NODES.map((n) => (
        <span key={n.key} style={{
          position: "absolute",
          left: n.left,
          top: n.top,
          width: 116,
          display: "block",
          background: "rgba(251,250,246,0.95)",
          border: "1px solid #d8cbb8",
          borderRadius: 20,
          padding: "5px 10px",
          fontSize: 10.5,
          color: "#5a554c",
          lineHeight: 1.35,
          whiteSpace: "pre-line",
          zIndex: 2,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          {n.label}
        </span>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function HomeHero({ onPick }: { onPick: (type: EntryType) => void }) {
  return (
    <div className="hh-root">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hh-hero">
        {/* Background image: floating photo cards + baked-in HALO orb. pointer-events-none. */}
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
          {/* Left-side gradient keeps text readable against the bright image */}
          <div className="hh-hero-grad" />
        </div>

        {/* Top bar */}
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

        {/* Real selectable headline — no extra mascot overlay; orb is in the bg image */}
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

      {/* ── MAP PREVIEW — pure HTML + SVG, zero images ────────── */}
      <section className="hh-map-panel">
        <p className="hh-map-eyebrow">YOUR MAP IS WAITING TO BE LIT</p>

        {/* MemoryMap: all text is real HTML, all lines are SVG paths */}
        <MemoryMap />

        <div className="hh-map-zones">
          <span>BELONGING</span>
          <span>THINGS I CARRIED</span>
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
