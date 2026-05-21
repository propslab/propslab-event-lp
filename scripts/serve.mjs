import http from "node:http";
import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "public");
const PORT = Number(process.env.PORT || 5173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico":  "image/x-icon",
  ".xml":  "application/xml; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let rel = url === "/" ? "/index.html" : url;
    let abs = path.join(ROOT, rel);
    if (!abs.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }

    let stat;
    try { stat = await fs.stat(abs); }
    catch {
      // Serve 404.html to mimic Cloudflare Workers `not_found_handling: "404-page"`
      const fallback = path.join(ROOT, "404.html");
      try {
        stat = await fs.stat(fallback);
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Content-Length": stat.size });
        createReadStream(fallback).pipe(res); return;
      } catch {
        res.writeHead(404).end("Not Found: " + rel); return;
      }
    }
    if (stat.isDirectory()) {
      abs = path.join(abs, "index.html");
      try { stat = await fs.stat(abs); } catch { res.writeHead(404).end("Not Found"); return; }
    }
    const ext = path.extname(abs).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-store",
    });
    createReadStream(abs).pipe(res);
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
});

server.listen(PORT, () => {
  console.log(`\n  Props Lab Event LP - local preview`);
  console.log(`  ──────────────────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}/`);
  console.log(`  Stop:    Ctrl+C\n`);
});
