import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const SRC = path.resolve("public/assets/originals");
const OUT = path.resolve("public/assets");

const targets = [
  { file: "hero.png",   maxWidth: 1600, webpQ: 78, jpgQ: 80 },
  { file: "beppu.png",  maxWidth: 1200, webpQ: 76, jpgQ: 78 },
  { file: "oita.png",   maxWidth: 1200, webpQ: 76, jpgQ: 78 },
  { file: "future.png", maxWidth: 1200, webpQ: 76, jpgQ: 78 },
];

const fmt = (n) => (n / 1024).toFixed(1) + " KB";

for (const t of targets) {
  const src = path.join(SRC, t.file);
  const base = path.basename(t.file, path.extname(t.file));
  const webpOut = path.join(OUT, `${base}.webp`);
  const jpgOut  = path.join(OUT, `${base}.jpg`);

  const meta = await sharp(src).metadata();
  const before = (await fs.stat(src)).size;

  await sharp(src)
    .rotate()
    .resize({ width: Math.min(t.maxWidth, meta.width), withoutEnlargement: true })
    .webp({ quality: t.webpQ, effort: 6 })
    .toFile(webpOut);

  await sharp(src)
    .rotate()
    .resize({ width: Math.min(t.maxWidth, meta.width), withoutEnlargement: true })
    .jpeg({ quality: t.jpgQ, mozjpeg: true, progressive: true })
    .toFile(jpgOut);

  const afterW = (await fs.stat(webpOut)).size;
  const afterJ = (await fs.stat(jpgOut)).size;

  console.log(
    `${t.file.padEnd(12)}  ${meta.width}x${meta.height} ${fmt(before).padStart(9)}  →  ` +
    `webp ${fmt(afterW).padStart(9)}  jpg ${fmt(afterJ).padStart(9)}`
  );
}
