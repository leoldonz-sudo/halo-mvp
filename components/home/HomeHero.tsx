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

// ── Data ─────────────────────────────────────────────────────────────────────

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

// ── Memory Map — pure HTML/SVG component ─────────────────────────────────────
// viewBox: 320 × 290 (matches the container's intended rendered size in px)
// All node and card positions are defined in these coordinates.
// The SVG is absolutely positioned behind all HTML nodes so lines appear under chips.

/*
  Layout grid (320 × 290):
  ┌─────────────────────────────────────┐
  │ [tl chip]            [tr chip]      │
  │                                     │
  │          [centre card]              │
  │                                     │
  │ [ml chip]                           │
  │            [bl chip]  [br chip]     │
  └─────────────────────────────────────┘
*/

// node chip anchor points (top-left corner of chip, for absolute CSS)
const NODES = [
  { key: "tl", label: "A place I keep\nreturning to",        top:  14, left:   6, cx:  66, cy:  30 },
  { key: "tr", label: "The first meal\nthat felt like home", top:  14, right:  6, cx: 248, cy:  30 },
  { key: "ml", label: "Calling my mother\nafter I arrived",  top: 124, left:   6, cx:  66, cy: 140 },
  { key: "bl", label: "The night I\nalmost gave up",         top: 224, left:  18, cx:  78, cy: 240 },
  { key: "br", label: "The day the city\nfelt familiar",     top: 224, right:  6, cx: 248, cy: 240 },
] as const;

// centre card geometry (used by SVG paths and the HTML card absolutely)
const CARD = { top: 104, left: 88, w: 144, h: 80 };

// SVG connection lines: each is a quadratic bezier from card-edge to node centre
const LINES = [
  // card top-centre → tl node centre
  { d: `M ${CARD.left + CARD.w * 0.3},${CARD.top} Q ${CARD.left - 10},${CARD.top - 36} 66,30` },
  // card top-centre → tr node centre
  { d: `M ${CARD.left + CARD.w * 0.7},${CARD.top} Q ${CARD.left + CARD.w + 10},${CARD.top - 36} 248,30` },
  // card left-centre → ml node centre
  { d: `M ${CARD.left},${CARD.top + CARD.h * 0.5} Q ${CARD.left - 30},${CARD.top + CARD.h * 0.5} 66,140` },
  // card bottom-left → bl node centre
  { d: `M ${CARD.left + CARD.w * 0.3},${CARD.top + CARD.h} Q ${CARD.left - 10},${CARD.top + CARD.h + 36} 78,240` },
  // card bottom-right → br node centre
  { d: `M ${CARD.left + CARD.w * 0.7},${CARD.top + CARD.h} Q ${CARD.left + CARD.w + 10},${CARD.top + CARD.h + 36} 248,240` },
];

// dot positions: one at each node centre + one at each card-edge start
const CARD_DOTS = [
  { x: CARD.left + CARD.w * 0.3,  y: CARD.top },
  { x: CARD.left + CARD.w * 0.7,  y: CARD.top },
  { x: CARD.left,                  y: CARD.top + CARD.h * 0.5 },
  { x: CARD.left + CARD.w * 0.3,  y: CARD.top + CARD.h },
  { x: CARD.left + CARD.w * 0.7,  y: CARD.top + CARD.h },
];

function MemoryMap() {
  return (
    <div
      aria-hidden
      style={{ position: "relative", width: "100%", height: 290, userSelect: "none" }}
    >
      {/* ── SVG connection lines (behind all HTML elements) ── */}
      <svg
        viewBox="0 0 320 290"
        preserveAspectRatio="none"
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      >
        {/* amber connection paths */}
        {LINES.map((l, i) => (
          <path key={i} d={l.d} fill="none" stroke="#c9a05a" strokeWidth="1.2" strokeDasharray="0" opacity="0.55" />
        ))}
        {/* dots at card border exits */}
        {CARD_DOTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#c9a05a" opacity="0.7" />
        ))}
        {/* dots at node centres */}
        {NODES.map((n) => (
          <circle key={n.key} cx={n.cx} cy={n.cy} r="3" fill="#c9a05a" opacity="0.7" />
        ))}
      </svg>

      {/* ── Centre moment card ── */}
      <div
        style={{
          position: "absolute",
          top: CARD.top,
          left: "50%",
          transform: "translateX(-50%)",
          width: CARD.w,
          display: "flex",
          gap: 8,
          background: "#fbfaf6",
          border: "1px solid #d8cbb8",
          borderRadius: 10,
          padding: "8px 10px",
          boxShadow: "0 3px 14px rgba(0,0,0,0.09)",
          zIndex: 2,
        }}
      >
        {/* thumbnail placeholder */}
        <div style={{ flexShrink: 0, width: 44, height: 52, borderRadius: 6, background: "#ede8de", border: "1px solid #d8cbb8" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "#1a1814", lineHeight: 1.25, display: "block" }}>
            The First Morning<br />in Singapore
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#9b5443", background: "rgba(155,84,67,0.10)", borderRadius: 4, padding: "1px 5px", width: "fit-content", letterSpacing: "0.03em" }}>
            Starting Over
          </span>
          <span style={{ fontSize: 9, color: "#a8a29b", marginTop: 1 }}>
            • First kept moment
          </span>
        </div>
      </div>

      {/* ── Surrounding node chips ── */}
      {NODES.map((n) => {
        const style: React.CSSProperties = {
          position: "absolute",
          top: n.top,
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "rgba(251,250,246,0.92)",
          border: "1px solid #d8cbb8",
          borderRadius: 20,
          padding: "4px 9px",
          fontSize: 10,
          color: "#5a554c",
          lineHeight: 1.3,
          whiteSpace: "pre-line",
          zIndex: 2,
          maxWidth: 118,
        };
        if ("right" in n) {
          style.right = (n as { right: number }).right;
        } else {
          style.left = (n as { left: number }).left;
        }
        return (
          <span key={n.key} style={style}>{n.label}</span>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function HomeHero({ onPick }: { onPick: (type: EntryType) => void }) {
  return (
    <div className="hh-root">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hh-hero">

        {/* Background: floating cards + baked-in HALO orb. pointer-events-none. */}
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
          {/* readability gradient on the left so text stays clear */}
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

        {/* Real selectable headline — no extra mascot overlay (baked into bg image) */}
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

      {/* ── MAP PREVIEW — pure HTML/SVG, no screenshot ─────────── */}
      <section className="hh-map-panel">
        <p className="hh-map-eyebrow">YOUR MAP IS WAITING TO BE LIT</p>

        {/* Real component: SVG lines + HTML text chips */}
        <MemoryMap />

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
