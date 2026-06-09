import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const characters = JSON.parse(
  readFileSync(join(__dirname, "data/characters.json"), "utf-8")
);

// Common abbreviations and nicknames mapped to canonical character names
const ALIASES = {
  "dhil": "Dan Heng • Imbibitor Lunae",
  "dan heng il": "Dan Heng • Imbibitor Lunae",
  "imbibitor lunae": "Dan Heng • Imbibitor Lunae",
  "sam": "Firefly",
  "stelle": "Trailblazer (Destruction)",
  "caelus": "Trailblazer (Destruction)",
  "trailblazer harmony": "Trailblazer (Harmony)",
  "harmony tb": "Trailblazer (Harmony)",
  "tb harmony": "Trailblazer (Harmony)",
  "trailblazer destruction": "Trailblazer (Destruction)",
  "trailblazer preservation": "Trailblazer (Preservation)",
  "march hunt": "March 7th (Hunt)",
  "hunt march": "March 7th (Hunt)",
  "topaz": "Topaz & Numby",
  "numby": "Topaz & Numby",
  "jing yuan": "Jing Yuan",
  "jy": "Jing Yuan",
  "silver wolf": "Silver Wolf",
  "sw": "Silver Wolf",
  "fu xuan": "Fu Xuan",
  "black swan": "Black Swan",
  "dan heng": "Dan Heng",
  "the herta": "The Herta",
  "dr ratio": "Dr. Ratio",
  "dr. ratio": "Dr. Ratio",
};

function getRelevantContext(messages) {
  const latest = [...messages].reverse().find((m) => m.role === "user");
  if (!latest) return "";

  const text = latest.content.toLowerCase();

  // Expand aliases into the text so name matching picks them up
  let expandedText = text;
  for (const [alias, canonicalName] of Object.entries(ALIASES)) {
    if (expandedText.includes(alias)) {
      expandedText += " " + canonicalName.toLowerCase();
    }
  }

  const matched = characters.filter((c) =>
    expandedText.includes(c.name.toLowerCase())
  );

  if (matched.length > 0) {
    // Also inject full entries for each matched character's listed teammates,
    // so Claude has data on newer characters it wasn't trained on.
    const matchedNames = new Set(matched.map((c) => c.name));
    const teammateNames = new Set(matched.flatMap((c) => c.teammates ?? []));
    const teammateEntries = characters.filter(
      (c) => !matchedNames.has(c.name) && teammateNames.has(c.name)
    );
    return formatCharacterContext([...matched, ...teammateEntries]);
  }

  return formatRosterSummary();
}

function formatCharacterContext(chars) {
  return chars
    .map((c) => {
      const lines = [
        `${c.name} | ${c.element} | ${c.path} | ${c.rarity}★ | ${c.role}`,
        `Kit: ${c.kit}`,
      ];
      if (c.relics?.length) lines.push(`Best Relics: ${c.relics.join(" / ")}`);
      if (c.planar?.length) lines.push(`Best Planar: ${c.planar.join(" / ")}`);
      if (c.teammates?.length)
        lines.push(`Best Teammates: ${c.teammates.join(", ")}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

function formatRosterSummary() {
  const byPath = {};
  for (const c of characters) {
    if (!byPath[c.path]) byPath[c.path] = [];
    byPath[c.path].push(c.name);
  }
  return Object.entries(byPath)
    .map(([path, names]) => `${path}: ${names.join(", ")}`)
    .join("\n");
}

const BASE_SYSTEM_PROMPT =
  "You are an HSR team-building advisor. Help players optimize their team compositions and relic builds. Explain things clearly for average players.";

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  const context = getRelevantContext(messages);
  const system = context
    ? `${BASE_SYSTEM_PROMPT}\n\nHere is current data for the characters mentioned:\n${context}`
    : `${BASE_SYSTEM_PROMPT}\n\nFull current roster by path:\n${formatRosterSummary()}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    const data = await response.json();
    res.json({ reply: data.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
