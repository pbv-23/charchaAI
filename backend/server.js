import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs-extra";
import path from "path";
import pRetry from "p-retry";
import cors from "cors";
import { fileURLToPath } from "url"; // For __dirname in ESM
import dotenv from "dotenv"; // For .env support

// Load .env vars
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const TOPICS_FILE = path.join(__dirname, "topics.json");
const KIALO_URL =
  "https://www.kialo-edu.com/debate-topics-and-argumentative-essay-topics";

// OpenRouter setup - Free tier at openrouter.ai (signup for API key: sk-or-...)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || null;
const OPENROUTER_MODEL = "mistralai/mistral-small-3.1-24b-instruct:free"; // Switched to stable, low-latency instruct model (less rate-limited)
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const app = express();

// ✅ Enable CORS for all origins
app.use(cors({ origin: "*" }));

// ✅ Add this: Parse JSON bodies (missing middleware causing req.body undefined)
app.use(express.json());

// Helper: fetch page with retry
async function fetchPage(url) {
  return await pRetry(
    async () => {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "DebateTopicsBot/1.0 (+https://yourproject.example)",
          Accept: "text/html,application/xhtml+xml",
        },
        timeout: 20000,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    },
    { retries: 3 }
  );
}

// Parse HTML to extract topics
function parseTopicsFromHtml(html) {
  const $ = cheerio.load(html);
  const candidates = new Set();

  // Collect from common text containers
  $("a, li, h1, h2, h3, h4, [class*='topic'], [class*='card'], [id*='topic']").each(
    (i, el) => {
      const t = $(el).text().trim();
      if (t && t.length > 6 && t.length < 200) candidates.add(normalize(t));
    }
  );

  return Array.from(candidates)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length >= 10 && s.length <= 200);
}

function normalize(text) {
  return text.replace(/^\d+\.\s*/, "").replace(/\n+/g, " ").trim();
}

// Scrape topics and save to JSON
async function scrapeAndSave() {
  console.log("Fetching page:", KIALO_URL);
  const html = await fetchPage(KIALO_URL);
  console.log("Parsing HTML...");
  let topics = parseTopicsFromHtml(html);

  // Split multi-topic paragraphs
  const expanded = [];
  topics.forEach((t) => {
    if (t.includes("\n")) t.split("\n").forEach((x) => expanded.push(x.trim()));
    else if (t.includes(" • ")) t.split(" • ").forEach((x) => expanded.push(x.trim()));
    else expanded.push(t);
  });

  topics = Array.from(new Set(expanded.map((s) => s.trim()))).filter(Boolean);
  topics = topics.filter((s) => s.split(" ").length >= 2); // simple filter

  console.log(`Found ${topics.length} candidate topics. Saving to ${TOPICS_FILE}`);
  await fs.writeJson(TOPICS_FILE, topics, { spaces: 2 });
  return topics;
}

// ✅ /topics endpoint
app.get("/topics", async (req, res) => {
  try {
    const force = req.query.force === "1";
    const exists = await fs.pathExists(TOPICS_FILE);
    let topics;

    if (!exists || force) {
      topics = await scrapeAndSave();
    } else {
      topics = await fs.readJson(TOPICS_FILE);
    }

    const limit = parseInt(req.query.limit || "0", 10);
    if (limit > 0) res.json(topics.slice(0, limit));
    else res.json(topics);
  } catch (err) {
    console.error("Error in /topics:", err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// ✅ /rescrape endpoint
app.get("/rescrape", async (req, res) => {
  try {
    const topics = await scrapeAndSave();
    res.json({ ok: true, count: topics.length });
  } catch (err) {
    console.error("Rescrape failed:", err);
    res.status(500).json({ error: "rescrape failed" });
  }
});

// Simple fallback generator (rule-based, no API) - Enhanced with topic/humanMsg placeholders for more relevance
function generateFallbackReply(topic, humanMsg, aiStance) {
  // Extract keywords for dynamic replies
  const topicKey = topic.split(" ").slice(-2).join(" "); // Last words as key aspect
  const humanKey = humanMsg.split(" ").slice(0, 2).join(" "); // First words as key from human

  const supports = [
    `Spot on! Your take on ${humanKey} really underscores why ${topicKey} is a game-changer—think of the ripple effects across society.`,
    `I couldn't agree more. Extending your point, ${topic} could transform ${humanKey} in ways we haven't even imagined yet.`,
    `Excellent insight. This bolsters the case for ${topic}, especially when paired with real-world examples like ${humanKey}.`
  ];
  const opposes = [
    `Fair point, but it glosses over the pitfalls of ${topicKey}, such as the risks tied to ${humanKey} that we've seen backfire before.`,
    `Intriguing, yet ${topic} often amplifies issues like ${humanKey} rather than solving them—history is full of such cautionary tales.`,
    `While compelling, your argument on ${humanKey} misses how ${topic} could exacerbate inequalities. A more balanced approach might be wiser.`
  ];

  const templates = aiStance === "Support" ? supports : opposes;
  return templates[Math.floor(Math.random() * templates.length)];
}

// ✅ New /debate-reply endpoint
app.post("/debate-reply", async (req, res) => {
  try {
    const { topic, humanMsg, aiStance } = req.body;

    if (!topic || !humanMsg || !aiStance) {
      return res.status(400).json({ error: "Missing required fields: topic, humanMsg, aiStance" });
    }

    // Check for API key
    if (!OPENROUTER_API_KEY) {
      const fallback = generateFallbackReply(topic, humanMsg, aiStance);
      return res.json({ reply: fallback, warning: "No API key set - using fallback" });
    }

    // Craft a debate-specific prompt for the AI model
    const stanceWord = aiStance === "Support" ? "supporting" : "opposing";
    const prompt = `You are an expert debater ${stanceWord} the topic: "${topic}". 
The human argues: "${humanMsg}".
Provide a concise, witty counter-argument or supporting point in 1-2 sentences, staying in character as a real-time debater. Keep it engaging and persuasive.`;

    // Call OpenRouter API (OpenAI-compatible) with retry for rate limits
    const orResponse = await pRetry(
      async () => {
        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200, // Increased for richer debate replies
            temperature: 0.8, // Creativity for debate flair
          }),
        });

        // ✅ Enhanced: Always log error details for debugging
        if (!response.ok) {
          const errorText = await response.text();
          console.log("API Error Details:", errorText);  // Log even non-429 errors
          if (response.status === 429) {
            throw new Error(`Rate limited: ${errorText}`); // Retry on 429
          }
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // ✅ Debug log: API status
        console.log("API Call Status:", response.status);

        return response;
      },
      {
        retries: 5, // Increased from 3 for longer rate limit windows
        minTimeout: 5000, // 5s base delay (exponential: 5s, 10s, 20s, 40s, 80s)
        factor: 2, // Exponential backoff (default, but explicit)
        onFailedAttempt: (error) => {
          console.log(`Retry attempt failed: ${error.message}`);
        },
      }
    );

    const data = await orResponse.json();

    // ✅ Debug log: Full response
    console.log("Full API Response:", JSON.stringify(data, null, 2));

    let aiReply = data.choices?.[0]?.message?.content?.trim() || "";

    // ✅ Debug log: Raw reply
    console.log("Raw AI Reply Before Cleanup:", JSON.stringify(aiReply));

    // Clean up and ensure it's not empty
    aiReply = aiReply.replace(/^\-+\s*/, "").replace(/\n+/g, " ").trim();

    // ✅ Debug log: Cleaned length
    console.log("Cleaned AI Reply Length:", aiReply.length);

    if (!aiReply || aiReply.length < 20) {  // Bumped threshold to 20 for leniency
      console.log("Reply too short - falling back");
      const fallback = generateFallbackReply(topic, humanMsg, aiStance);
      aiReply = fallback;
    }

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("Error in /debate-reply:", err);
    // ✅ Fix: Safely access req.body or use defaults
    const safeBody = req.body || {};
    const fallback = generateFallbackReply(safeBody.topic || "unknown", safeBody.humanMsg || "unknown", safeBody.aiStance || "Support");
    res.status(500).json({ reply: fallback, warning: "Server error - using fallback" });
  }
});

// ✅ Bonus: /check-models endpoint (lists available free models)
app.get("/check-models", async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(400).json({ error: "API key required" });
    }
    const isFree = req.query.free === "1";
    const url = `${OPENROUTER_API_URL.replace('/chat/completions', '/models')}${isFree ? '?free=true' : ''}`;
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}` },
    });
    const data = await response.json();
    // Filter to free/instruct models if needed
    const freeModels = data.data?.filter(m => m.id.endsWith(':free') && m.id.includes('instruct')) || [];
    res.json({ total: data.data?.length || 0, freeInstructExamples: freeModels.slice(0, 5) });
  } catch (err) {
    console.error("Error in /check-models:", err);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});
// ✅ New: AI Judges and Declares Winner
app.post("/judge", async (req, res) => {
  try {
    const { topic, messages, humanStance, aiStance } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No debate messages to judge." });
    }

    const debateSummary = messages
      .map((m) => `${m.sender}: ${m.text}`)
      .join("\n");

const prompt = `
You are an impartial debate judge.

Topic: "${topic}"
Human stance: ${humanStance}
AI stance: ${aiStance}

Debate transcript:
${transcript}

Evaluate the debate and respond **only in strict JSON** with this exact format:
{
  "humanScore": number (0-10),
  "aiScore": number (0-10),
  "winner": "Human" or "AI",
  "reason": "Brief explanation"
}

Do NOT include any extra text outside of JSON.
`;


    let reply;
    if (!OPENROUTER_API_KEY) {
      // Simple fallback if no API key
      const randomWinner = Math.random() < 0.5 ? "Human" : "AI";
      return res.json({
        winner: randomWinner,
        reason: "Fallback judgment based on equal arguments.",
        warning: "No API key - random fallback",
      });
    }

    const orResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await orResponse.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // Extract JSON safely
    const match = raw.match(/\{[\s\S]*\}/);
    let parsed;
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      parsed = { winner: "AI", reason: "Couldn't parse response properly." };
    }

    res.json(parsed);
  } catch (err) {
    console.error("Judging error:", err);
    res.status(500).json({
      winner: "Error",
      reason: "Server error during judging.",
    });
  }
});
app.post("/analyze-score", async (req, res) => {
  const { topic, messages, humanStance, aiStance } = req.body;
  const response = await fetch("http://localhost:5000/judge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, messages, humanStance, aiStance }),
  });
  const data = await response.json();
  res.json(data);
});
app.post("/judge", async (req, res) => {
  try {
    const { topic, messages, humanStance, aiStance } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No debate messages to judge." });
    }

    const transcript = messages.map(m => `${m.sender}: ${m.text}`).join("\n");

    const prompt = `
You are an impartial debate judge.

Topic: "${topic}"
Human stance: ${humanStance}
AI stance: ${aiStance}

Debate transcript:
${transcript}

Evaluate the debate and respond **only** in valid JSON like:
{
  "humanScore": number (0–10),
  "aiScore": number (0–10),
  "winner": "Human" or "AI",
  "reason": "Brief reason"
}
`;

    // 🧩 If no OpenRouter API key, return random fallback
    if (!process.env.OPENROUTER_API_KEY) {
      const humanScore = Number((Math.random() * 4 + 6).toFixed(1));
      const aiScore = Number((Math.random() * 4 + 6).toFixed(1));
      const winner = aiScore > humanScore ? "AI" : "Human";
      return res.json({
        humanScore,
        aiScore,
        winner,
        reason: "Fallback random scoring (no API key)."
      });
    }

    // ✅ Send to OpenRouter or other AI model
    const response = await fetch(process.env.OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";
    console.log("Raw judge response:", raw);

    // 🧠 Extract JSON safely
    const match = raw.match(/\{[\s\S]*\}/);
    let result = {};
    if (match) {
      try {
        result = JSON.parse(match[0]);
      } catch {
        result = {};
      }
    }

    // 🛠️ Guarantee numeric scores
    result.humanScore = Number(result.humanScore ?? (Math.random() * 3 + 6).toFixed(1));
    result.aiScore = Number(result.aiScore ?? (Math.random() * 3 + 6).toFixed(1));
    result.winner = result.winner ?? (result.aiScore > result.humanScore ? "AI" : "Human");
    result.reason = result.reason ?? "Could not parse model response fully.";

    console.log("Final judged result:", result);
    res.json(result);

  } catch (err) {
    console.error("Judging error:", err);
    res.status(500).json({
      humanScore: 0,
      aiScore: 0,
      winner: "Error",
      reason: "Server error during judging."
    });
  }
});

// Serve static JSON
app.use("/static", express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Endpoints: /topics  /rescrape  /static/topics.json  /debate-reply /check-models`);
  console.log(`For AI replies: Set OPENROUTER_API_KEY in .env (free signup at openrouter.ai)`);
  console.log("Loaded API Key:", process.env.OPENROUTER_API_KEY ? "YES (length: " + process.env.OPENROUTER_API_KEY.length + ")" : "NO");
  console.log("Using Model:", OPENROUTER_MODEL); // New log for model confirmation
});