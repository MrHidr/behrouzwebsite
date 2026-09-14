"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeDigits } from "@/lib/locale-digits";

export type AccessKind = 0 | 1 | 2;

// Simplified from Natural Earth 1:50m country geometry (CC0/public domain).
const IRAN_PATH = "M618.5 230.2L619.1 233.8L616 240.6L613 242L614.7 248.1L612.3 256.2L607.9 263L600.3 267.6L605.8 274.4L597.4 274.8L592.1 282.1L592.9 297.6L606.8 302.1L594.6 314.6L594.7 317.3L603.8 344.8L602.3 357.5L603.5 370.5L632 374.3L635.3 377.6L637.2 390.3L636.3 393.1L604.2 426.2L620.4 442.7L630.8 462.5L639.8 470.8L655.6 475.3L662.8 481.4L669.4 481.1L668.8 489.3L671.2 506.5L669.2 514.4L674.7 516L683.3 514.8L688 519.2L685.9 520.8L686.1 527.5L683.9 529L683 535.3L670.4 535.5L658.5 538.4L654.2 540.8L651.7 545.3L647.9 544.9L638.2 549.8L635.2 562.8L632.1 565.9L629.6 584.6L623.6 588L598.1 581.9L595.5 577.4L592.9 576.6L589.2 580.9L562.5 577.8L557 575.1L543.1 577.3L534.7 572.6L514.4 571.3L505.4 567.9L500.6 569.3L498.4 566.8L484.9 564.5L477 544.8L474.7 530.2L470.4 523.6L464.2 519.1L451.6 516.6L443.5 518.6L437.5 522.2L427.6 524.2L419.9 531.2L415.5 530.7L397.3 540.3L393.4 540.1L379.8 533.8L361.4 532.8L352.9 525.4L326.9 512.4L319.6 502.5L304.4 495.4L289.4 494L278.8 484.9L278.8 482L272.6 472L271.5 464.7L264.8 459.8L265.1 453.3L258.3 450.4L257.4 441.1L241.1 424L237.8 414.6L234.8 414.2L220.2 420.4L201.4 408.6L207.8 408.6L209.7 407.3L209 405.3L201.4 404.1L202.6 406L198.5 407.9L197.6 410.2L198.6 417.3L196.9 419.2L185.9 422.6L182.1 420.1L178.6 411.7L167.8 405.5L167.7 387.7L156.4 387.3L156.4 373.7L161.5 360.3L150.7 348.2L145.9 338.9L137.4 337.4L112.1 321.7L103.1 320.7L102 316.4L104.2 311.5L99.9 305.2L94.9 302.6L95.1 298.6L90.3 298.8L78.7 286.3L83.7 277.9L80.1 271.2L82.3 265.5L86.9 265.8L88.3 258.1L96.6 250.3L103.8 246.9L103.1 240.3L98.4 235L99.1 230.6L108.6 225L105 223.3L91.6 223.3L84.3 218L77.5 216.7L73.4 205.1L67 201.2L65.9 193.5L61.2 190L57.3 178.6L58.2 173.3L50.7 168.4L49.8 160.8L51.3 159L38.4 152.3L46.5 137.8L41.4 136.1L40.5 120.8L37 117.4L37.3 110.2L33.9 107.7L32 102.3L44.5 100.8L46.7 92.5L51.2 89L59 93L70 106.5L81.6 115L105 119.6L118.1 118.4L128.3 110.1L132.9 109L144.8 100.8L159.6 93.1L167.2 91.9L178.3 101.6L171.9 104.5L170.8 107L171.6 109.3L176.6 111.8L177.2 114.5L169 117.4L167.2 120.1L177.7 128.3L181.5 129.2L187.5 135.2L196.9 134.4L198.8 148.7L204.1 160.5L214 165.5L239.8 169.4L246.8 178.1L266.9 189.7L295.3 196.3L309.8 196.1L363.5 185.6L368.5 185.6L360.5 188.2L370.4 189.4L372.2 186.6L368.5 171.5L377.9 171.9L395.2 167.2L402 156.7L418.4 147.5L425.1 145.8L448.7 146.5L450.5 142.7L454.5 140.7L480.1 141.8L484 144.8L485.5 150.1L506.8 155L516.4 160.6L535.3 160L551.8 165.8L557 174.6L577.7 184.5L587.2 195.5L613.6 195.4L616.8 210.8L614.8 218L618.2 221.7L618.5 230.2ZM445.9 526.1L437.9 533.6L434.3 532.6L419.9 537.6L416 537.3L415.5 535.7L431.4 529.8L431.2 525.2L436.3 526.5L446.7 523.3L449 525.1L445.9 526.1Z";

export const ACCESS_POINTS: { name: { fa: string; en: string }; lon: number; lat: number; kind: AccessKind; dx?: number; dy?: number }[] = [
  { name: { fa: "تهران", en: "Tehran" }, lon: 51.39, lat: 35.69, kind: 0, dx: 7, dy: 6 }, { name: { fa: "البرز", en: "Alborz" }, lon: 50.99, lat: 35.84, kind: 0, dx: -8, dy: -6 },
  { name: { fa: "مازندران", en: "Mazandaran" }, lon: 53.06, lat: 36.56, kind: 0 }, { name: { fa: "مرکزی", en: "Markazi" }, lon: 49.69, lat: 34.09, kind: 0 },
  { name: { fa: "اصفهان", en: "Isfahan" }, lon: 51.67, lat: 32.65, kind: 0 }, { name: { fa: "فارس", en: "Fars" }, lon: 52.58, lat: 29.59, kind: 0 },
  { name: { fa: "خوزستان", en: "Khuzestan" }, lon: 48.68, lat: 31.32, kind: 0 }, { name: { fa: "خراسان رضوی", en: "Razavi Khorasan" }, lon: 59.61, lat: 36.3, kind: 0 },
  { name: { fa: "آذربایجان شرقی", en: "East Azerbaijan" }, lon: 46.29, lat: 38.08, kind: 1 }, { name: { fa: "آذربایجان غربی", en: "West Azerbaijan" }, lon: 45.07, lat: 37.55, kind: 1 },
  { name: { fa: "گیلان", en: "Gilan" }, lon: 49.59, lat: 37.28, kind: 1 }, { name: { fa: "همدان", en: "Hamedan" }, lon: 48.52, lat: 34.8, kind: 1 },
  { name: { fa: "قم", en: "Qom" }, lon: 50.88, lat: 34.64, kind: 1 }, { name: { fa: "قزوین", en: "Qazvin" }, lon: 50, lat: 36.27, kind: 1 },
  { name: { fa: "سمنان", en: "Semnan" }, lon: 53.39, lat: 35.58, kind: 1 }, { name: { fa: "خراسان شمالی", en: "North Khorasan" }, lon: 57.33, lat: 37.47, kind: 1 },
  { name: { fa: "خراسان جنوبی", en: "South Khorasan" }, lon: 59.22, lat: 32.86, kind: 1 },
  { name: { fa: "اردبیل", en: "Ardabil" }, lon: 48.29, lat: 38.25, kind: 2 }, { name: { fa: "زنجان", en: "Zanjan" }, lon: 48.48, lat: 36.67, kind: 2 },
  { name: { fa: "کردستان", en: "Kurdistan" }, lon: 47, lat: 35.31, kind: 2 }, { name: { fa: "کرمانشاه", en: "Kermanshah" }, lon: 47.06, lat: 34.31, kind: 2 },
  { name: { fa: "لرستان", en: "Lorestan" }, lon: 48.35, lat: 33.49, kind: 2 }, { name: { fa: "ایلام", en: "Ilam" }, lon: 46.42, lat: 33.64, kind: 2 },
  { name: { fa: "چهارمحال و بختیاری", en: "Chaharmahal and Bakhtiari" }, lon: 50.86, lat: 32.32, kind: 2 }, { name: { fa: "کهگیلویه و بویراحمد", en: "Kohgiluyeh and Boyer-Ahmad" }, lon: 51.59, lat: 30.67, kind: 2 },
  { name: { fa: "بوشهر", en: "Bushehr" }, lon: 50.84, lat: 28.92, kind: 2 }, { name: { fa: "یزد", en: "Yazd" }, lon: 54.37, lat: 31.9, kind: 2 },
  { name: { fa: "کرمان", en: "Kerman" }, lon: 57.08, lat: 30.28, kind: 2 }, { name: { fa: "هرمزگان", en: "Hormozgan" }, lon: 56.28, lat: 27.18, kind: 2 },
  { name: { fa: "گلستان", en: "Golestan" }, lon: 54.43, lat: 36.84, kind: 2 }, { name: { fa: "سیستان و بلوچستان", en: "Sistan and Baluchestan" }, lon: 60.86, lat: 29.5, kind: 2 },
];

const colors = ["#efaa32", "#55a978", "#f05a47"] as const;
// Tune these two values to quickly test the network density and visibility.
export const NETWORK_LINE_OPACITY = 0.42;
const NETWORK_CONNECTIONS_PER_POINT = 4;
const project = (lon: number, lat: number) => ({
  x: 32 + (lon - 44.0232421875) * 34.0214842464,
  y: 620 - 32 - (lat - 25.1020996094) * 34.0214842464,
});

const kindLabels = [
  { fa: "شعبه", en: "Branch" },
  { fa: "مرکز هیبرید", en: "Hybrid centre" },
  { fa: "نمایندگی", en: "Agency" },
] as const;

type PositionedPoint = (typeof ACCESS_POINTS)[number] & { x: number; y: number; index: number };

function buildNetworkEdges(points: PositionedPoint[]) {
  if (points.length < 2) return [];

  const seen = new Set<string>();
  // Every point selects its four nearest neighbours. Duplicate reverse edges
  // are removed so the network is dense without drawing the same route twice.
  return points.flatMap((point) =>
    points
      .filter((candidate) => candidate.index !== point.index)
      .map((candidate) => ({ candidate, distance: (candidate.x - point.x) ** 2 + (candidate.y - point.y) ** 2 }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, NETWORK_CONNECTIONS_PER_POINT)
      .flatMap(({ candidate }) => {
        const key = [point.index, candidate.index].sort((a, b) => a - b).join("-");
        if (seen.has(key)) return [];
        seen.add(key);
        return [{ from: point, to: candidate }];
      })
  );
}

export function IranAccessMap({ active }: { active: AccessKind | null }) {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  const positionedPoints: PositionedPoint[] = ACCESS_POINTS.map((point, index) => {
    const position = project(point.lon, point.lat);
    return { ...point, index, x: position.x + (point.dx ?? 0), y: position.y + (point.dy ?? 0) };
  });
  const visiblePoints = active === null ? positionedPoints : positionedPoints.filter((point) => point.kind === active);
  const edges = buildNetworkEdges(visiblePoints);
  const hoveredPoint = hovered === null ? null : positionedPoints[hovered];

  return (
    <div className="relative min-h-[390px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0d2c57] p-3 sm:min-h-[500px] sm:rounded-[32px] sm:p-6 lg:min-h-[590px]">
      <div className="absolute inset-0 opacity-[.09]" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
      <svg viewBox="0 0 720 620" className="relative mx-auto w-full max-w-[720px]" role="img" aria-label={locale === "en" ? "Behrouz distribution access map across Iran" : "نقشه نقاط دسترسی شبکه پخش بهروز در ایران"}>
        <defs>
          <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity=".22" /></filter>
          <linearGradient id="network-flow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#efaa32" />
            <stop offset=".52" stopColor="#ffffff" />
            <stop offset="1" stopColor="#55a978" />
          </linearGradient>
        </defs>
        <path d={IRAN_PATH} fill="#f6f3ec" stroke="rgba(255,255,255,.55)" strokeWidth="2" filter="url(#map-shadow)" />
        <g aria-hidden="true">
          {edges.map((edge, index) => (
            <motion.line
              key={`${edge.from.index}-${edge.to.index}`}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke="url(#network-flow)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="5 8"
              opacity={NETWORK_LINE_OPACITY}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: NETWORK_LINE_OPACITY, strokeDashoffset: reduceMotion ? 0 : -26 }}
              transition={{ pathLength: { duration: .55, delay: Math.min(index * .018, .32) }, opacity: { duration: .3 }, strokeDashoffset: { duration: 2.8, repeat: reduceMotion ? 0 : Infinity, ease: "linear" } }}
            />
          ))}
        </g>
        {positionedPoints.map((point, index) => {
          const selected = active === null || active === point.kind;
          const visibleIndex = visiblePoints.findIndex((visiblePoint) => visiblePoint.index === point.index);
          return <g
            key={`${point.name.en}-${index}`}
            role="button"
            tabIndex={selected ? 0 : -1}
            aria-label={`${localizeDigits(visibleIndex + 1, locale)}، ${point.name[locale]}، ${kindLabels[point.kind][locale]}`}
            onMouseEnter={() => selected && setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => selected && setHovered(index)}
            onBlur={() => setHovered(null)}
            className={selected ? "cursor-help outline-none" : "pointer-events-none"}
          >
            {selected && <circle cx={point.x} cy={point.y} r="16" fill="transparent" />}
            {selected && <motion.circle cx={point.x} cy={point.y} r="14" fill={colors[point.kind]} opacity=".18" initial={{ scale: .8 }} animate={{ scale: reduceMotion ? 1 : [0.82, 1.25, 0.82] }} transition={{ duration: 3, repeat: reduceMotion ? 0 : Infinity, delay: index * .035 }} />}
            <motion.circle cx={point.x} cy={point.y} fill={colors[point.kind]} stroke="#fff" animate={{ r: selected ? 9 : 3, opacity: selected ? 1 : .2, strokeWidth: selected ? 1.8 : 1 }} transition={{ duration: .25 }} />
            {selected && <text x={point.x} y={point.y + 2.8} textAnchor="middle" className={font} fontSize="7.6" fontWeight="900" fill="#071b3b" pointerEvents="none">{localizeDigits(visibleIndex + 1, locale)}</text>}
          </g>;
        })}
        {hoveredPoint && (
          <g className="pointer-events-none hidden lg:block" transform={`translate(${hoveredPoint.x} ${hoveredPoint.y - 17})`}>
            <rect x="-61" y="-29" width="122" height="25" rx="8" fill="#071b3b" stroke="rgba(255,255,255,.22)" />
            <path d="M-5 -4L0 2L5 -4Z" fill="#071b3b" />
            <text x="0" y="-13" textAnchor="middle" direction={locale === "fa" ? "rtl" : "ltr"} className={font} fontSize="10" fontWeight="800" fill="#fff">
              {hoveredPoint.name[locale]} · {kindLabels[hoveredPoint.kind][locale]}
            </text>
          </g>
        )}
      </svg>
      <span className={`${font} absolute end-5 top-5 rounded-full bg-[#071b3b]/70 px-3 py-2 text-[10px] font-black text-white/45 backdrop-blur`}>
        {active === null
          ? (locale === "en" ? "Nationwide access" : `دسترسی در ${localizeDigits("31", locale)} استان`)
          : kindLabels[active][locale]}
      </span>
    </div>
  );
}
