"use client";

import { useCMSContent } from "@/components/cms/CMSContentProvider";

/** Generic 3-item cluster placement inside the disc (left / centre-forward /
 *  right), reused for every scene category. `width` is deliberately generous
 *  (not "fit the whole product") — every real photo has a different aspect
 *  ratio (a squat can vs. a tall, narrow lime-juice bottle), so instead of
 *  shrinking tall ones down to fit we size everything by the SAME width and
 *  let the circular mask crop whatever runs past the top/bottom. That keeps
 *  every product reading at a consistent, confident size inside the disc. */
const CLUSTER = [
  { left: 30, width: 58, rotate: -8, z: 10 },
  { left: 50, width: 70, rotate: 0, z: 30 },
  { left: 70, width: 58, rotate: 8, z: 20 },
];

/** Mix a hex colour toward white by `amt` (0–1) → opaque `rgb()`. */
function lighten(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * amt);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/**
 * Category button visual: a radial-colour disc with the category's products
 * masked INSIDE it — like a circular product-photo badge, not free-floating
 * art. The outer circle is `overflow-hidden`, so nothing can spill past the
 * disc edge and break the surrounding layout; hovering just lifts the
 * products a touch inside that mask via the `--lift` var, and gently pops
 * the disc itself. Must live inside a `.group` (the wrapping <Link>).
 */
export function CategoryCircle({
  slug,
  color,
  buttonImage,
}: {
  slug: string;
  color: string;
  buttonImage?: string;
}) {
  const { categoryScenes } = useCMSContent();
  const scene = categoryScenes[slug];
  const products = buttonImage ? null : scene?.products?.slice(0, 3);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-full [--lift:0px] group-hover:[--lift:-6%]">
      {/* the coloured disc */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-smooth group-hover:scale-[1.05]"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${lighten(color, 0.34)} 0%, ${color} 74%)`,
          boxShadow: `inset 0 -6px 14px rgba(0,0,0,0.16), 0 10px 22px ${color}33`,
        }}
      />

      {/* products masked inside the disc */}
      {buttonImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={buttonImage}
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 h-[102%] w-auto max-w-none select-none object-contain transition-transform duration-500 ease-smooth"
          style={{ transform: "translate(-50%, calc(-50% + var(--lift)))" }}
          draggable={false}
        />
      ) : products ? (
        products.map((p, i) => {
          const c = CLUSTER[i] ?? CLUSTER[1];
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={p.src}
              alt=""
              className="pointer-events-none absolute top-1/2 w-auto select-none object-contain transition-transform duration-500 ease-smooth"
              style={{
                left: `${c.left}%`,
                width: `${c.width}%`,
                transform: `translate(-50%, calc(-50% + var(--lift))) rotate(${c.rotate}deg)`,
                zIndex: c.z,
              }}
              draggable={false}
            />
          );
        })
      ) : (
        // no product art yet — a soft frosted spot keeps the disc from looking empty
        <div className="absolute inset-[30%] rounded-full bg-white/25 blur-[1px]" />
      )}
    </div>
  );
}
