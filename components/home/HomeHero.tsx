"use client";

import Image from "next/image";
import type { EntryType } from "@/lib/types";
import { XiaomanAvatar } from "@/components/XiaomanAvatar";

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

// ── Memory Map Teaser — pure dot constellation ───────────────────────────────

function MapTeaser() {
  const G = "#c9a05a";
  // [cx, cy, r, opacity]
  const dots: [number, number, number, number][] = [
    [28,  18, 2.2, 0.50],
    [72,  52, 1.6, 0.36],
    [118, 14, 2.0, 0.46],
    [162, 56, 1.4, 0.30],
    [205, 20, 2.2, 0.50],
    [248, 50, 1.6, 0.36],
    [58,  70, 1.4, 0.28],
    [148, 72, 1.8, 0.40],
    [238, 70, 1.4, 0.28],
    [280, 52, 1.6, 0.34],
  ];
  // Xiaoman node at top-right corner (index 10 in edges)
  const XM = [316, 14] as const;
  const edges: [number, number][] = [
    [0,1],[1,2],[0,2],[2,4],[3,4],[3,1],[1,6],[6,7],[7,8],[5,8],[4,5],[8,9],[9,10],[4,10],
  ];

  return (
    <div className="hs-teaser">
      <p className="hs-teaser-label">YOUR MAP IS TAKING SHAPE</p>
      <div className="hs-dotmap">
        <svg viewBox="0 0 334 84" width="100%" style={{ display: "block" }} aria-hidden>
          {edges.map(([a, b], i) => {
            const [x1, y1] = a === 10 ? XM : dots[a];
            const [x2, y2] = b === 10 ? XM : dots[b];
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={G} strokeWidth="0.65" opacity="0.25" />;
          })}
          {dots.map(([cx, cy, r, op], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={G} opacity={op} />
          ))}
          <circle cx={XM[0]} cy={XM[1]} r="15" fill={G} opacity="0.07" />
          <circle cx={XM[0]} cy={XM[1]} r="10" fill={G} opacity="0.10" />
        </svg>
        <div className="hs-dotmap-avatar">
          <XiaomanAvatar size={28} mood="idle" />
        </div>
      </div>
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

          {/* Hero copy — spans wider so headline sits near the orb */}
          <div className="hs-copy">
            <h1 className="hs-h1">Hello,<br />I see your halo.</h1>
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
