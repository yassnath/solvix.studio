import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.CEREBRAS_API_URL || "https://api.cerebras.ai/v1/chat/completions";
  const model = env.CEREBRAS_MODEL || "llama3.1-8b";

  return {
    plugins: [
      react(),
      {
        name: "cerebras-local-proxy",
        configureServer(server) {
          server.middlewares.use("/api/cerebras", async (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

            if (req.method === "OPTIONS") {
              res.statusCode = 204;
              res.end();
              return;
            }

            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end("Method Not Allowed");
              return;
            }

            const apiKey = env.CEREBRAS_API_KEY || process.env.CEREBRAS_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Missing CEREBRAS_API_KEY in environment." }));
              return;
            }

            try {
              const rawBody = await parseBody(req);
              const payload = rawBody ? JSON.parse(rawBody) : {};
              const messages = Array.isArray(payload.messages) ? payload.messages : [];

              const upstream = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                  model,
                  messages,
                  temperature: 0.4,
                  max_tokens: 512
                })
              });

              let data = {};
              try {
                data = await upstream.json();
              } catch (error) {
                data = {};
              }

              res.statusCode = upstream.status;
              res.setHeader("Content-Type", "application/json");

              if (!upstream.ok) {
                res.end(JSON.stringify({ error: data?.error || "Upstream error" }));
                return;
              }

              const reply = data?.choices?.[0]?.message?.content || "";
              res.end(JSON.stringify({ reply }));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Server error while contacting Cerebras." }));
            }
          });
        }
      }
    ]
  };
});
