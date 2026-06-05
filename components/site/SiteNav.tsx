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
      <Link href="/demo" className="site-nav__cta">
        Try the demo →
      </Link>
    </nav>
  );
}
