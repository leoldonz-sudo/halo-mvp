"use client";

import Image from "next/image";

export type XiaomanMood = "idle" | "thinking" | "generating";

type Props = {
  size?: number;
  mood?: XiaomanMood;
  className?: string;
  priority?: boolean;
};

/**
 * 小满的视觉化身。三层叠加：
 * - halo-glow-outer：常驻柔光晕
 * - halo-glow-inner：呼吸高光（mood 影响节奏）
 * - generating 模式额外加一圈缓慢旋转的金边
 */
export function XiaomanAvatar({
  size = 96,
  mood = "idle",
  className,
  priority,
}: Props) {
  const wrapperStyle = { width: size, height: size };

  return (
    <div
      className={`xm-avatar xm-mood-${mood} ${className ?? ""}`}
      style={wrapperStyle}
      aria-hidden="true"
    >
      <span className="xm-glow xm-glow-outer" />
      <span className="xm-glow xm-glow-inner" />
      {mood === "generating" ? (
        <span className="xm-glow xm-glow-ring" />
      ) : null}
      <Image
        src="/xiaoman.png?v=3"
        alt="小满"
        fill
        sizes={`${size}px`}
        className="xm-face"
        priority={priority}
        unoptimized
      />
    </div>
  );
}
