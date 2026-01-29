const API_URL = process.env.CEREBRAS_API_URL || "https://api.cerebras.ai/v1/chat/completions";
const MODEL = process.env.CEREBRAS_MODEL || "llama3.1-8b";

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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing CEREBRAS_API_KEY in environment." });
    return;
  }

  try {
    const rawBody = await parseBody(req);
    const payload = rawBody ? JSON.parse(rawBody) : {};
    const messages = Array.isArray(payload.messages) ? payload.messages : [];

    const upstream = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
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

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data?.error || "Upstream error" });
      return;
    }

    const reply = data?.choices?.[0]?.message?.content || "";
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Server error while contacting Cerebras." });
  }
};
