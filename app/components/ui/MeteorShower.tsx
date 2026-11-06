import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/* Star field                                                          */
/* ------------------------------------------------------------------ */

/*
 * Seeded random numbers, so the star positions are identical on the server
 * and in the browser (Math.random would cause hydration mismatches).
 */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  x: string;
  y: string;
  scale: number; // 0..1, used to vary sparkle size
  dur: number; // twinkle duration in seconds
  delay: number; // negative, so twinkles are out of sync
  twinkle: boolean;
};

/** `twinkleEvery`: 0 = none twinkle, 1 = all twinkle, 3 = every third one. */
function makeStars(count: number, seed: number, twinkleEvery: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    const x = rand() * 100;
    const y = rand() * 100;
    const scale = rand();
    const dur = 3 + rand() * 4;
    const delay = -rand() * dur;
    return {
      x: `${x.toFixed(2)}%`,
      y: `${y.toFixed(2)}%`,
      scale,
      dur,
      delay,
      twinkle: twinkleEvery > 0 && i % twinkleEvery === 0,
    };
  });
}

/*
 * Three depth layers of dots: far = tiny, dim, still; near = bigger, brighter,
 * twinkling. `r` is the dot radius in px.
 */
const dotLayers = [
  { r: 0.7, opacity: 0.35, stars: makeStars(70, 11, 0) },
  { r: 1, opacity: 0.6, stars: makeStars(40, 23, 3) },
  { r: 1.5, opacity: 0.9, stars: makeStars(18, 37, 1) },
];

// A handful of larger four-point sparkles for the "real star" look.
const sparkles = makeStars(8, 53, 1);

function twinkleStyle(s: Star): CSSProperties | undefined {
  return s.twinkle
    ? { animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }
    : undefined;
}

/* ------------------------------------------------------------------ */
/* Meteors                                                             */
/* ------------------------------------------------------------------ */

/*
 * Three depth layers fake parallax:
 *   far  = short, thin, dim, slow
 *   mid  = in between
 *   near = long, thick, bright, fast
 * `dur` is seconds for one pass (lower = faster). A negative `delay` starts
 * the streak partway through its pass, so the sky is already busy on load.
 */
const meteors = [
  // far
  { top: "6%", w: 96, h: 1, dur: 17, delay: -4, peak: 0.3 },
  { top: "28%", w: 80, h: 1, dur: 19, delay: -11, peak: 0.25 },
  { top: "52%", w: 110, h: 1, dur: 15, delay: -7, peak: 0.3 },
  { top: "74%", w: 90, h: 1, dur: 18, delay: -14, peak: 0.25 },
  // mid
  { top: "16%", w: 150, h: 1.5, dur: 9, delay: -2, peak: 0.6 },
  { top: "44%", w: 160, h: 1.5, dur: 10, delay: -8, peak: 0.6 },
  { top: "60%", w: 140, h: 1.5, dur: 8, delay: -5, peak: 0.65 },
  { top: "36%", w: 170, h: 1.5, dur: 11, delay: -6, peak: 0.55 },
  // near
  { top: "4%", w: 260, h: 2, dur: 5, delay: -1, peak: 1 },
  { top: "33%", w: 300, h: 2, dur: 6, delay: -3, peak: 0.9 },
  { top: "58%", w: 240, h: 2, dur: 4.5, delay: -2, peak: 1 },
];

/**
 * Fills its nearest positioned ancestor (e.g. a `relative overflow-hidden`
 * section) with a star field and falling meteors. Place it before your
 * content and give the content `relative z-10` so it stays above the sky.
 */
export default function MeteorShower() {
  return (
    <>
      <style>{`
        @keyframes ryusei-streak {
          0%   { transform: rotate(25deg) translateX(-30vw); opacity: 0; }
          8%   { opacity: var(--peak); }
          92%  { opacity: var(--peak); }
          100% { transform: rotate(25deg) translateX(130vw); opacity: 0; }
        }
        @keyframes ryusei-twinkle {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.2; }
        }
        .ryusei-streak {
          animation-name: ryusei-streak;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        .ryusei-twinkle {
          animation-name: ryusei-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ryusei-streak { display: none; }
          .ryusei-twinkle { animation: none; }
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Stars: drawn first so the meteors pass in front of them */}
        <svg
          className="absolute inset-0 h-full w-full text-zinc-500 dark:text-zinc-100"
          fill="currentColor"
        >
          {dotLayers.map((layer, li) => (
            <g key={li} opacity={layer.opacity}>
              {layer.stars.map((s, i) => (
                <circle
                  key={i}
                  cx={s.x}
                  cy={s.y}
                  r={layer.r}
                  className={s.twinkle ? "ryusei-twinkle" : undefined}
                  style={twinkleStyle(s)}
                />
              ))}
            </g>
          ))}

          <g opacity={0.85}>
            {sparkles.map((s, i) => (
              <svg key={i} x={s.x} y={s.y} overflow="visible">
                <path
                  d="M0 -1Q0 0 1 0Q0 0 0 1Q0 0 -1 0Q0 0 0 -1Z"
                  transform={`scale(${(4 + s.scale * 4).toFixed(2)})`}
                  className="ryusei-twinkle"
                  style={twinkleStyle(s)}
                />
              </svg>
            ))}
          </g>
        </svg>

        {/* Meteors */}
        {meteors.map((m, i) => (
          <div
            key={i}
            className="ryusei-streak absolute left-0 rounded-full bg-gradient-to-r from-transparent via-sky-300/60 to-sky-50"
            style={
              {
                top: m.top,
                width: m.w,
                height: m.h,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
                "--peak": m.peak,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}