// Renders the hero flythrough: node tools/hero-video/render.mjs [outDir] [fps] [seconds]
// Needs Playwright's Chromium and an ffmpeg binary (FFMPEG env, or ffmpeg on PATH).
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.env.ROOT || process.cwd();
const out = process.argv[2] || "tools/hero-video/out";
const FPS = Number(process.argv[3] || 30), SECONDS = Number(process.argv[4] || 24);
await mkdir(`${out}/frames`, { recursive: true });

const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json" };
const server = createServer(async (req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  try { res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream"); res.end(await readFile(file)); }
  catch { res.statusCode = 404; res.end(); }
});
await new Promise((r) => server.listen(3199, r));

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => console.error("page error:", e));
page.on("console", (m) => m.type() === "error" && console.error("console:", m.text()));
await page.goto("http://localhost:3199/tools/hero-video/scene.html");
await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
const total = FPS * SECONDS;
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  await page.evaluate((t) => window.renderFrame(t), i / FPS);
  await page.screenshot({ path: `${out}/frames/f${String(i).padStart(4, "0")}.jpg`, type: "jpeg", quality: 92, clip: { x: 0, y: 0, width: 1280, height: 720 } });
  if (i % 60 === 0) console.log(`frame ${i}/${total} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
server.close();

const ffmpeg = process.env.FFMPEG || "ffmpeg";
const common = ["-y", "-framerate", String(FPS), "-i", `${out}/frames/f%04d.jpg`];
execFileSync(ffmpeg, [...common, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", `${out}/hero-flythrough.mp4`], { stdio: "inherit" });
execFileSync(ffmpeg, [...common, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34", "-row-mt", "1", "-an", `${out}/hero-flythrough.webm`], { stdio: "inherit" });
execFileSync(ffmpeg, ["-y", "-i", `${out}/frames/f${String(Math.round(FPS * 20.5)).padStart(4, "0")}.jpg`, "-q:v", "3", `${out}/hero-poster.jpg`], { stdio: "inherit" });
console.log("done", existsSync(`${out}/hero-flythrough.mp4`));
