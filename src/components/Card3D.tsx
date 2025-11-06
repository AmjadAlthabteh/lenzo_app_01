"use client";

import { useRef, useState } from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function Card3D({ className = "", children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("perspective(1000px)");

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1; // -1..1
    const py = (y / rect.height) * 2 - 1; // -1..1
    const rx = (-py * 6).toFixed(2);
    const ry = (px * 8).toFixed(2);
    setTransform(`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`);
  };

  const onLeave = () => setTransform("perspective(1000px)");

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative will-change-transform transition-transform duration-150 ease-out ${className}`}
      style={{ transform }}
    >
      {/* glow sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          boxShadow:
            "0 0 40px color(from var(--accent-mid) srgb r g b / 0.15), 0 0 24px color(from var(--accent-start) srgb r g b / 0.12)",
        }}
      />
      {children}
    </div>
  );
}

