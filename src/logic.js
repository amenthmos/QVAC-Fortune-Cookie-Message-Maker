// QVAC Fortune Cookie Message Maker — core logic.
// completion() writes a short fortune-cookie-style message, optionally
// themed around a mood/topic the user supplies. Theme is optional; a blank
// theme produces a random general fortune.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  if (text.length > 200) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

const GENERIC_FORTUNES = [
  "A great opportunity will present itself to you this week.",
  "Your hard work is about to pay off in an unexpected way.",
  "Someone you least expect will bring you good news soon.",
  "The path ahead is clearer than you think — trust your instincts.",
  "A small act of kindness will come back to you tenfold.",
  "Patience will reveal an answer that rushing could not.",
];

function fallback(theme) {
  if (theme && theme.trim().length > 0) {
    return `When it comes to ${theme.trim()}, the best is still ahead of you.`;
  }
  return GENERIC_FORTUNES[Math.floor(Math.random() * GENERIC_FORTUNES.length)];
}

function stripWrap(text) {
  return text
    .trim()
    .replace(/^here'?s[^:\n]*:\s*/i, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
}

export async function generate(modelId, theme) {
  const themeLine = theme && theme.length > 0 ? `Theme: ${theme}` : "Theme: (none, surprise me)";

  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You write short, wise, fortune-cookie-style messages (1 sentence, upbeat and a little mysterious). " +
          "If a theme is given, weave it in naturally. If no theme is given, write a general fortune. " +
          "Reply with ONLY the fortune, no preamble, no explanation, no quotation marks.",
      },
      { role: "user", content: "Theme: career" },
      { role: "assistant", content: "A bold decision at work will open a door you didn't know existed." },
      { role: "user", content: "Theme: (none, surprise me)" },
      { role: "assistant", content: "Good fortune favors those who take the first step today." },
      { role: "user", content: themeLine },
    ],
    stream: true,
    completionOpts: { temperature: 0.9, maxTokens: 60 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = stripWrap(text);

  const fortune = looksUnusable(text) ? fallback(theme) : text;
  return { fortune };
}
