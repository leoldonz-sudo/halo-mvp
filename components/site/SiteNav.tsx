"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`site-nav${scrolled ? " site-nav--scrolled" : ""}`}>
      <Image
        src="/halo-logo.png"
        alt="HALO"
        width={72}
        height={28}
        className="site-nav__logo"
        priority
      />
      <div className="site-nav__links">
        <a href="#how-it-works" className="site-nav__link">How it works</a>
        <a href="#memory-map" className="site-nav__link">Memory Map</a>
        <a href="#share-a-moment" className="site-nav__link">Share a moment</a>
      </div>
      <Link href="/demo/start" className="site-nav__cta">
        Try HALO →
      </Link>
    </nav>
  );
}
