import { mkdir, rename } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const inputRoot = join(root, "New Product assets");

const assets = [
  {
    input: "SaladMoatar",
    output: join("sauces", "herb-dressing"),
  },
  {
    input: "باقالی پخته",
    output: join("canned", "broad-beans"),
  },
  {
    input: "Olive in ChilliSauce550",
    output: join("sauces", "olive-chili"),
  },
  {
    input: "dijonaise",
    output: join("sauces", "dijonnaise-squeeze"),
  },
];

async function encodeVideo(input, output) {
  const temporary = `${output}.tmp.mp4`;
  await new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, [
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", input,
      "-map", "0:v:0", "-an",
      "-vf", "fps=24,scale=720:-2:flags=lanczos",
      "-c:v", "libx264", "-profile:v", "high", "-crf", "18", "-preset", "slow",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-map_metadata", "-1",
      temporary,
    ], { stdio: ["ignore", "inherit", "inherit"] });

    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`)));
  });
  await rename(temporary, output);
}

for (const asset of assets) {
  const outputBase = join(root, "public", "media", asset.output);
  await mkdir(dirname(outputBase), { recursive: true });

  await sharp(join(inputRoot, `${asset.input}.png`))
    .resize({ width: 1080, withoutEnlargement: true })
    // 95 keeps fine label text visually intact while avoiding multi-megabyte PNGs.
    .webp({ quality: 95, smartSubsample: true, effort: 6 })
    .toFile(`${outputBase}-poster.webp`);

  await encodeVideo(join(inputRoot, `${asset.input}.mp4`), `${outputBase}.mp4`);
  console.log(`✓ ${asset.output}`);
}
