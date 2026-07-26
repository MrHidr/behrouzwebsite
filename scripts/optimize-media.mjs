// Optimizes the raw hero/product assets into web-ready files under public/media.
// Run with: npm run optimize:media
//
// public/media is organized by category:
//   site/        - logo, hero, about, loader texture, generic assets
//   sauces/      - ketchups, mayo, dressings, dips
//   canned/      - canned foods
//   pickles/     - pickles (ترشی)
//   gherkin/     - pickled cucumbers (خیارشور)
//   lime-juice/  - lime juices (آبلیمو)
//   jam/         - jams (مربا)
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mediaRoot = join(root, "public", "media");
for (const dir of ["site", "sauces", "canned", "pickles", "gherkin", "lime-juice", "jam"]) {
  mkdirSync(join(mediaRoot, dir), { recursive: true });
}
const out = (category, file) => join(mediaRoot, category, file);

const VIDEO = join(root, "video.mp4");
// About-section product image (transparent PNG). Drop the source next to the repo
// root as about-products.png to regenerate; otherwise the existing webp is kept.
const ABOUT_IMG = join(root, "about-products.png");

const mb = (p) => (existsSync(p) ? (statSync(p).size / 1e6).toFixed(2) + " MB" : "—");
function run(args, label) {
  process.stdout.write(`\n▶ ${label}\n`);
  try {
    execFileSync(ffmpegPath, ["-y", "-hide_banner", "-loglevel", "error", ...args], {
      stdio: ["ignore", "inherit", "inherit"],
    });
    return true;
  } catch (e) {
    console.warn(`  ⚠ skipped (${label}): ${e.message.split("\n")[0]}`);
    return false;
  }
}

// Re-encodes a raw AI-rendered product clip (832x1104, ~11 Mb/s, no audio) into
// a 720-wide portrait H.264 hover video + a poster (first frame), matching the
// treatment used for the original ketchup splash videos.
function processProductClip(input, category, name, sizes) {
  const outputs = [];
  if (!existsSync(input)) return outputs;

  run([
    "-i", input, "-an",
    "-vf", "scale=720:-2:flags=lanczos,fps=24",
    "-c:v", "libx264", "-profile:v", "high", "-crf", "26", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    out(category, `${name}.mp4`),
  ], `${category}/${name}.mp4 (720w H.264, from ${sizes})`);

  run([
    "-i", input, "-frames:v", "1",
    "-vf", "scale=720:-2:flags=lanczos",
    "-quality", "82",
    out(category, `${name}-poster.webp`),
  ], `${category}/${name}-poster.webp`);

  outputs.push(`${category}/${name}.mp4`, `${category}/${name}-poster.webp`);
  return outputs;
}

// ---- 1. About-section product image -> alpha webp (desktop + mobile) ----
// Transparent bottles. This ffmpeg build only keeps alpha in lossless webp, so we
// use lossless here rather than lossy.
if (existsSync(ABOUT_IMG)) {
  run(["-i", ABOUT_IMG, "-vf", "scale=1136:-1:flags=lanczos", "-c:v", "libwebp", "-lossless", "1", "-compression_level", "6", out("site", "about-products.webp")], "site/about-products.webp (1136w, alpha)");
  run(["-i", ABOUT_IMG, "-vf", "scale=720:-1:flags=lanczos", "-c:v", "libwebp", "-lossless", "1", "-compression_level", "6", out("site", "about-products-mobile.webp")], "site/about-products-mobile.webp (720w, alpha)");
}

// ---- 2. Loop video: seamless "boomerang". ----
if (existsSync(VIDEO)) {
  // We bake forward + reversed frames into ONE file, so the browser can loop it
  // natively (loop attribute) with no JS reverse-seeking — which stalls on long-GOP
  // video. Sequence 0→end→0 tiles seamlessly, giving a true ping-pong with no stutter.
  // 1080p, AV1 → VP9 → H.264 ladder; browser downloads only the first it can decode.
  const BOOMERANG =
    "[0:v]scale=-2:1080:flags=lanczos,fps=30,setpts=PTS-STARTPTS,split[a][b];" +
    "[b]reverse[r];[a][r]concat=n=2:v=1,format=yuv420p[v]";

  // AV1 (smallest at a given quality; slower to encode).
  run([
    "-i", VIDEO, "-an",
    "-filter_complex", BOOMERANG, "-map", "[v]",
    "-c:v", "libsvtav1", "-crf", "30", "-preset", "6", "-svtav1-params", "tune=0",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    out("site", "hero-loop.av1.mp4"),
  ], "site/hero-loop.av1.mp4 (1080p AV1 boomerang)");

  // VP9 (broad support, good efficiency).
  run([
    "-i", VIDEO, "-an",
    "-filter_complex", BOOMERANG, "-map", "[v]",
    "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-row-mt", "1",
    out("site", "hero-loop.webm"),
  ], "site/hero-loop.webm (1080p VP9 boomerang)");

  // H.264 universal fallback.
  run([
    "-i", VIDEO, "-an",
    "-filter_complex", BOOMERANG, "-map", "[v]",
    "-c:v", "libx264", "-profile:v", "high", "-crf", "21", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    out("site", "hero-loop.mp4"),
  ], "site/hero-loop.mp4 (1080p H.264 boomerang)");

  // ---- Poster (first frame) ----
  run(["-i", VIDEO, "-frames:v", "1", "-vf", "scale=1920:-2:flags=lanczos", "-quality", "82", out("site", "hero-poster.webp")], "site/hero-poster.webp");
}

// ---- 3. Canned-food hover videos (product cards, same treatment as ketchups) ----
// Source clips are already a portrait ~0.75 aspect (832x1104), so a straight
// 720-wide scale matches the 720x956 ketchup splash videos exactly — no crop needed.
const CANNED_SRC_DIR = join(root, "products videos", "Videos");
const CANNED_VIDEOS = [
  { src: "Mixed_Vegetables.mp4", out: "mixed-vegetables" },
  { src: "Broad_Beans.mp4", out: "broad-beans" },
  { src: "Lentils.mp4", out: "lentils" },
  { src: "Green_Peas.mp4", out: "green-peas" },
  { src: "Golden_Chickpeas.mp4", out: "golden-chickpeas" },
  // NOTE: this clip is mislabeled upstream — it's actually eggplant footage,
  // not pinto beans, so it's mapped to the eggplant-stew product instead.
  { src: "Pinto_Beans.mp4", out: "eggplant" },
];

// ---- 4. Archived per-product clips (Persian-named exports covering sauces,
// pickles, gherkins, lime juices, and jams). Same treatment/pipeline as #3,
// just fanned out across every category folder in one pass.
const ARCHIVE_SRC_DIR = join(root, "products videos", "archiveVideos");
const ARCHIVE_VIDEOS = [
  // -- sauces: dressings & dips --
  { src: "دیجونیز - خردل.mp4", category: "sauces", out: "dijonnaise" },
  { src: "سس هزار جزیره.mp4", category: "sauces", out: "thousand-island" },
  { src: "سس مایونزچیلی.mp4", category: "sauces", out: "chili-mayo" },
  { src: "سس سزار.mp4", category: "sauces", out: "caesar" },
  { src: "سس فرانسوی.mp4", category: "sauces", out: "french" },
  { src: "خیار و سیر.mp4", category: "sauces", out: "tzatziki" },
  { src: "مایونز کم چربی.mp4", category: "sauces", out: "low-fat-mayo" },
  { src: "سس ماست.mp4", category: "sauces", out: "yogonnaise" },
  { src: "مایوپینو.mp4", category: "sauces", out: "mayopino" },
  { src: "سس ساندویچ.mp4", category: "sauces", out: "sandwich" },
  { src: "سس سالاد با سبزی معطر.mp4", category: "sauces", out: "herb-dressing" },
  { src: "زیتون در سس چیلی بزرگ.mp4", category: "sauces", out: "olive-chili" },
  { src: "زیتون در سس چیلی کوچک.mp4", category: "sauces", out: "olive-chili-small" },
  { src: "سس چیلی - پوره فلفل تند.mp4", category: "sauces", out: "chili-sauce" },
  // -- sauces: mayonnaise, one clip per retail size --
  { src: "سس مایونز ۲۴۰.mp4", category: "sauces", out: "mayo-240" },
  { src: "سس مایونز ۳۳۰ - فشاری.mp4", category: "sauces", out: "mayo-330" },
  { src: "سس مایونز ۴۸۵.mp4", category: "sauces", out: "mayo-485" },
  { src: "سس مایونز ۹۰۰.mp4", category: "sauces", out: "mayo-900" },
  { src: "سس مایونز ۱۴۱۰.mp4", category: "sauces", out: "mayo-1410" },
  { src: "سس مایونز ۱۸۰۰.mp4", category: "sauces", out: "mayo-1800" },
  // -- pickles --
  { src: "ترشی بندری.mp4", category: "pickles", out: "bandari" },
  { src: "ترشی لیته.mp4", category: "pickles", out: "liteh" },
  { src: "ترشی مخلوط.mp4", category: "pickles", out: "mix" },
  { src: "ترشی هفت بیجار.mp4", category: "pickles", out: "chopped-mix" },
  { src: "هالاپینو بزرگ.mp4", category: "pickles", out: "jalapeno" },
  { src: "هالاپینو کوچک.mp4", category: "pickles", out: "jalapeno-small" },
  // -- pickled cucumbers (gherkin) --
  { src: "خیارشور درجه یک.mp4", category: "gherkin", out: "grade-1" },
  { src: "خیارشور سوپر ویژه.mp4", category: "gherkin", out: "super-selected" },
  { src: "خیارشور ممتاز.mp4", category: "gherkin", out: "special" },
  { src: "خیارشور ویژه.mp4", category: "gherkin", out: "selected" },
  // -- canned foods --
  { src: "ذرت شیرین.mp4", category: "canned", out: "corns" },
  { src: "لوبیا با قارچ.mp4", category: "canned", out: "beans-mushroom" },
  { src: "لوبیا چیتی تند.mp4", category: "canned", out: "beans-chili" },
  { src: "لوبیا چیتی.mp4", category: "canned", out: "beans-tomato" },
  { src: "مایه لازانیا.mp4", category: "canned", out: "lasagna-sauce" },
  // -- lime juices --
  { src: "آب لیمو بزرگ.mp4", category: "lime-juice", out: "lime-large" },
  { src: "آبلیمو کوچک.mp4", category: "lime-juice", out: "lime-small" },
  // -- jams (existing flavors get a hover video; the rest are new to the catalog) --
  { src: "مربا توت فرنگی.mp4", category: "jam", out: "strawberry-jam" },
  { src: "مربا هویج.mp4", category: "jam", out: "carrot-jam" },
  { src: "مربا تمشک.mp4", category: "jam", out: "raspberry-jam" },
  { src: "مربا آلبالو.mp4", category: "jam", out: "sour-cherry-jam" },
  { src: "مربا بالنگ.mp4", category: "jam", out: "citron-jam" },
  { src: "مربا به.mp4", category: "jam", out: "quince-jam" },
  { src: "مربا بهارنارنج.mp4", category: "jam", out: "bitter-orange-jam" },
  { src: "مربا گل محمدی.mp4", category: "jam", out: "rose-jam" },
  { src: "مربا گیلاس.mp4", category: "jam", out: "cherry-jam" },
  { src: "مربای انجیر.mp4", category: "jam", out: "fig-jam" },
  { src: "مربای سیب و دارچین.mp4", category: "jam", out: "apple-cinnamon-jam" },
  { src: "مربای شاتوت.mp4", category: "jam", out: "mulberry-jam" },
];

const producedOutputs = [];
for (const { src, out: name } of CANNED_VIDEOS) {
  producedOutputs.push(...processProductClip(join(CANNED_SRC_DIR, src), "canned", name, src));
}
for (const { src, category, out: name } of ARCHIVE_VIDEOS) {
  producedOutputs.push(...processProductClip(join(ARCHIVE_SRC_DIR, src), category, name, src));
}

console.log("\n── Output sizes ──");
for (const f of ["site/hero-loop.av1.mp4", "site/hero-loop.webm", "site/hero-loop.mp4", "site/hero-poster.webp", ...producedOutputs]) {
  console.log(`  ${f.padEnd(40)} ${mb(join(mediaRoot, f))}`);
}
console.log("\n✅ media optimization done");
