#!/usr/bin/env node
/**
 * Minimal static file server for Playwright tests.
 * Serves files from the project root with correct content types.
 */
import http from "node:http";
import { parse } from "node:url";
import { createReadStream, statSync, existsSync } from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = process.cwd();

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8",
};

function resolvePath(requestUrl) {
    const { pathname = "/" } = parse(requestUrl);
    let filePath = decodeURIComponent(pathname);
    if (filePath.endsWith("/")) {
        filePath += "index.html";
    }
    const resolved = path.join(ROOT, filePath);
    if (!resolved.startsWith(ROOT)) {
        return null;
    }
    return resolved;
}

const server = http.createServer((req, res) => {
    const targetPath = resolvePath(req.url || "/");
    if (!targetPath || !existsSync(targetPath)) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
    }

    let stats;
    try {
        stats = statSync(targetPath);
    } catch {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal server error");
        return;
    }

    const filePath = stats.isDirectory() ? path.join(targetPath, "index.html") : targetPath;
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    const stream = createReadStream(filePath);
    stream.on("error", () => {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal server error");
    });
    stream.pipe(res);
});

server.listen(PORT, HOST, () => {
    console.log(`Static server running at http://${HOST}:${PORT}`);
});
