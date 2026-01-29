const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = process.cwd();
const API_URL = process.env.CEREBRAS_API_URL || "https://api.cerebras.ai/v1/chat/completions";
const API_KEY = process.env.CEREBRAS_API_KEY;
const MODEL = process.env.CEREBRAS_MODEL || "llama3.1-8b";
const HAS_FETCH = typeof fetch === "function";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const sendText = (res, statusCode, text) => {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
};

const resolvePath = (urlPath) => {
  const safePath = path.resolve(ROOT_DIR, `.${urlPath}`);
  if (!safePath.toLowerCase().startsWith(ROOT_DIR.toLowerCase())) {
    return null;
  }
  return safePath;
};

const resolveRequestPath = (reqUrl) => {
  try {
    const parsed = new URL(reqUrl, "http://localhost");
    return parsed.pathname || "/";
  } catch (error) {
    return reqUrl || "/";
  }
};

const serveStatic = (req, res, requestPath) => {
  const urlPath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = resolvePath(urlPath);

  if (!filePath) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendText(res, 404, "Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const requestCerebras = async (payload) => {
  if (HAS_FETCH) {
    const upstream = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    let data = {};
    try {
      data = await upstream.json();
    } catch (error) {
      data = {};
    }

    return { status: upstream.status, ok: upstream.ok, data };
  }

  const url = new URL(API_URL);
  const body = JSON.stringify(payload);
  const requester = url.protocol === "http:" ? http : https;

  return new Promise((resolve, reject) => {
    const req = requester.request(
      {
        method: "POST",
        hostname: url.hostname,
        port: url.port || (url.protocol === "http:" ? 80 : 443),
        path: `${url.pathname}${url.search}`,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${API_KEY}`
        }
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          let data = {};
          try {
            data = rawData ? JSON.parse(rawData) : {};
          } catch (error) {
            data = { error: "Invalid JSON from Cerebras." };
          }
          const status = res.statusCode || 500;
          resolve({ status, ok: status >= 200 && status < 300, data });
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

const handleApi = async (req, res) => {
  if (!API_KEY) {
    sendJson(res, 500, { error: "Missing CEREBRAS_API_KEY in environment." });
    return;
  }

  try {
    const rawBody = await parseBody(req);
    const payload = rawBody ? JSON.parse(rawBody) : {};
    const messages = Array.isArray(payload.messages) ? payload.messages : [];

    const upstream = await requestCerebras({
      model: MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 512
    });

    if (!upstream.ok) {
      sendJson(res, upstream.status, { error: upstream.data?.error || "Upstream error" });
      return;
    }

    const reply = upstream.data?.choices?.[0]?.message?.content || "";
    sendJson(res, 200, { reply });
  } catch (error) {
    sendJson(res, 500, { error: "Server error while contacting Cerebras." });
  }
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendText(res, 400, "Bad Request");
    return;
  }

  const requestPath = resolveRequestPath(req.url);

  if (requestPath.startsWith("/api/cerebras")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === "POST") {
      await handleApi(req, res);
      return;
    }

    if (req.method === "GET") {
      sendJson(res, 200, { status: "ok", message: "Use POST /api/cerebras for chat requests." });
      return;
    }

    sendText(res, 405, "Method Not Allowed");
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendText(res, 405, "Method Not Allowed");
    return;
  }

  serveStatic(req, res, requestPath);
});

server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
