// Builds decoder-friendly ping-pong product videos.
//
// Browsers cannot reliably play HTMLVideoElement with a negative playbackRate.
// Baking the reverse frames into the asset lets the browser decode both legs in
// its normal forward direction, which is substantially smoother on mobile.
//
// Run with: npm run optimize:product-loops
import { spawn } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mediaRoot = join(root, "public", "media");
const concurrency = 3;
const force = process.argv.includes("--force");

function findProductVideos(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "site" ? [] : findProductVideos(path);
    }
    return extname(entry.name) === ".mp4" && !entry.name.endsWith("-loop.mp4") ? [path] : [];
  });
}

const sources = findProductVideos(mediaRoot);

function loopPath(source) {
  return source.replace(/\.mp4$/i, "-loop.mp4");
}

function needsBuild(source) {
  if (force) return true;
  const output = loopPath(source);
  try {
    return statSync(output).mtimeMs < statSync(source).mtimeMs;
  } catch {
    return true;
  }
}

function build(source) {
  const output = loopPath(source);
  const label = relative(mediaRoot, output);
  const filter =
    "[0:v]fps=24,setpts=PTS-STARTPTS,split=2[forward][reverse_input];" +
    "[reverse_input]reverse,setpts=PTS-STARTPTS[reverse];" +
    "[forward][reverse]concat=n=2:v=1:a=0,format=yuv420p[video]";

  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, [
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", source, "-an",
      "-filter_complex", filter, "-map", "[video]",
      "-c:v", "libx264", "-profile:v", "high", "-crf", "20", "-preset", "slow",
      // A keyframe every second keeps the one frame-preserving hover-out jump
      // responsive without the large transfer-size cost of all-I video.
      "-g", "24", "-keyint_min", "24", "-sc_threshold", "0",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      output,
    ], { stdio: ["ignore", "inherit", "inherit"] });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        console.log(`  ✓ ${label}`);
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code} while building ${label}`));
      }
    });
  });
}

const queue = sources.filter(needsBuild);
console.log(`Building ${queue.length} of ${sources.length} product ping-pong videos…`);

let cursor = 0;
async function worker() {
  while (cursor < queue.length) {
    const source = queue[cursor++];
    await build(source);
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
console.log("✅ Product loop videos are ready");
