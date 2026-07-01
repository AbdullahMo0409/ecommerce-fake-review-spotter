import React, { useEffect, useRef } from "react";

/**
 * Continuous, flowing dynamic gradient background (TypeScript-safe).
 * - Uses sums of sines (LFOs) for continuous motion of translate/scale/blur.
 * - Writes styles directly to DOM nodes via refs for smooth animation.
 *
 * Props:
 *  - speedMultiplier?: number  (default 1) — increase for faster motion during debugging.
 */

type LayerKey = "blue" | "green" | "orange" | "purple";

const LAYERS: Record<
  LayerKey,
  { color: string; baseX: number; baseY: number; size: number; baseBlur: number; baseScale: number }
> = {
  blue:   { color: "rgba(0,119,255,0.22)", baseX: -10, baseY: -8,  size: 1000, baseBlur: 140, baseScale: 1.02 },
  green:  { color: "rgba(0,255,156,0.24)", baseX: 18,  baseY: 18,  size: 950,  baseBlur: 140, baseScale: 1.03 },
  orange: { color: "rgba(255,111,97,0.16)",  baseX: -12, baseY: 28,  size: 800,  baseBlur: 120, baseScale: 1.01 },
  purple: { color: "rgba(106,17,203,0.14)",  baseX: 24,  baseY: -22, size: 600,  baseBlur: 100, baseScale: 1.04 },
};

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export default function DynamicBackground({ speedMultiplier = 1 }: { speedMultiplier?: number }) {
  const refs = {
    blue: useRef<HTMLDivElement | null>(null),
    green: useRef<HTMLDivElement | null>(null),
    orange: useRef<HTMLDivElement | null>(null),
    purple: useRef<HTMLDivElement | null>(null),
  };

  // per-layer LFO parameters (amplitudes, freqs, phases)
  const paramsRef = useRef<Record<
    LayerKey,
    {
      ax: number; ay: number;
      afreq1: number; afreq2: number; aphase1: number; aphase2: number;
      sAmp: number; sFreq: number; sPhase: number;
      blurAmp: number; blurFreq: number; blurPhase: number;
    }
  >>({
    blue:   { ax: 6,  ay: 6,  afreq1: 0.08, afreq2: 0.12, aphase1: 0.2, aphase2: 1.1, sAmp: 0.02, sFreq: 0.07, sPhase: 0.5, blurAmp: 12, blurFreq: 0.09, blurPhase: 0.9 },
    green:  { ax: 7,  ay: 5,  afreq1: 0.06, afreq2: 0.095, aphase1: 2.1, aphase2: 0.4, sAmp: 0.03, sFreq: 0.055, sPhase: 0.2, blurAmp: 10, blurFreq: 0.07, blurPhase: 0.4 },
    orange: { ax: 4,  ay: 7,  afreq1: 0.09, afreq2: 0.14, aphase1: 1.3, aphase2: 2.7, sAmp: 0.015, sFreq: 0.08, sPhase: 0.8, blurAmp: 10, blurFreq: 0.12, blurPhase: 0.6 },
    purple: { ax: 5,  ay: 5.5,afreq1: 0.05, afreq2: 0.11, aphase1: 0.7, aphase2: 1.9, sAmp: 0.025, sFreq: 0.06, sPhase: 0.3, blurAmp: 8, blurFreq: 0.05, blurPhase: 1.2 },
  });

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    let cancelled = false;

    // Respect user reduced-motion
    const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    function step(now: number) {
      if (cancelled) return;
      const t = ((now - start) / 1000) * speedMultiplier;

      (Object.keys(refs) as LayerKey[]).forEach((k) => {
        const el = refs[k].current;
        if (!el) return;

        const base = LAYERS[k];
        const p = paramsRef.current[k];

        const x =
          base.baseX +
          p.ax * Math.sin(p.afreq1 * t + p.aphase1) +
          (p.ax * 0.6) * Math.sin(p.afreq2 * t + p.aphase2);

        const y =
          base.baseY +
          p.ay * Math.cos(p.afreq1 * t + p.aphase2) +
          (p.ay * 0.7) * Math.sin(p.afreq2 * t + p.aphase1);

        const scale = base.baseScale + p.sAmp * Math.sin(p.sFreq * t + p.sPhase);
        const blur = clamp(base.baseBlur + p.blurAmp * Math.sin(p.blurFreq * t + p.blurPhase), 10, 260);

        el.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${scale})`;
        el.style.filter = `blur(${Math.round(blur)}px)`;
      });

      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [speedMultiplier]);

  const baseStyle = (k: LayerKey) => ({
    position: "absolute" as const,
    width: "140%",
    height: "140%",
    left: "-20%",
    top: "-20%",
    mixBlendMode: "screen" as const,
    pointerEvents: "none" as const,
    willChange: "transform, filter, opacity" as const,
    opacity: 0.9,
    background: `radial-gradient(circle ${LAYERS[k].size}px at 50% 50%, ${LAYERS[k].color}, transparent 50%)`,
  });

  return (
    <div className="absolute inset-0 -z-10 gradient-bg" aria-hidden style={{ backgroundColor: "var(--bg-dark)" }}>
      <div ref={refs.blue}   className="gradient-layer" style={baseStyle("blue")} />
      <div ref={refs.green}  className="gradient-layer" style={baseStyle("green")} />
      <div ref={refs.orange} className="gradient-layer" style={baseStyle("orange")} />
      <div ref={refs.purple} className="gradient-layer" style={baseStyle("purple")} />
    </div>
  );
}