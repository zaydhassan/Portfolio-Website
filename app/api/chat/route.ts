import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt, localAnswer } from "@/lib/twin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 12; // keep the last N turns of history
const MAX_CONTENT = 2000; // chars per message
const MAX_TOTAL = 24000; // chars across the whole conversation

function sanitize(input: string) {
  return input.slice(0, MAX_CONTENT);
}

function validate(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object") return null;
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;

  let total = 0;
  const cleaned: ChatMessage[] = [];
  for (const m of messages) {
    if (!m || typeof m !== "object") return null;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.trim().length === 0) return null;
    const c = sanitize(content);
    total += c.length;
    if (total > MAX_TOTAL) break;
    cleaned.push({ role, content: c });
  }
  if (cleaned.length === 0) return null;
  // Last message must be from the user.
  if (cleaned[cleaned.length - 1].role !== "user") return null;
  return cleaned;
}

/** Convert our message list into Gemini's `contents` format. */
function toGeminiContents(messages: ChatMessage[]) {
  // Trim to the last MAX_MESSAGES turns, but always keep the final user turn.
  const trimmed = messages.slice(-MAX_MESSAGES);
  return trimmed.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

function sse(delta: string) {
  return `data: ${JSON.stringify({ delta })}\n\n`;
}

/** Split text into small chunks for a streamed feel (regex-free, target-safe). */
function chunkText(text: string, size = 6): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out.length ? out : [text];
}

const DONE = "data: [DONE]\n\n";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = validate(body);
  if (!messages) {
    return new Response(
      JSON.stringify({ error: "Send a non-empty `messages` array ending with a user turn." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const lastUser = messages[messages.length - 1].content;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(sse(text)));

      // ── Fallback: no API key configured → answer locally ──────────────
      if (!GEMINI_API_KEY) {
        try {
          // Stream the local answer in small chunks for a live feel.
          const answer = localAnswer(lastUser);
          for (const t of chunkText(answer)) {
            send(t);
          }
        } catch (err) {
          console.error("chat local fallback error:", err);
          send("I'm having trouble right now — please email me at zaydthirteen@gmail.com.");
        }
        controller.enqueue(encoder.encode(DONE));
        controller.close();
        return;
      }

      // ── Live: stream from Gemini ──────────────────────────────────────
      try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const response = await ai.models.generateContentStream({
          model: GEMINI_MODEL,
          contents: toGeminiContents(messages),
          config: {
            systemInstruction: buildSystemPrompt(),
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 600,
          },
        });

        let produced = 0;
        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            produced += text.length;
            send(text);
          }
          if (produced > MAX_TOTAL) break;
        }
        if (produced === 0) {
          send(localAnswer(lastUser));
        }
      } catch (err) {
        console.error("chat gemini error:", err);
        // Graceful degradation: answer from local knowledge.
        try {
          const answer = localAnswer(lastUser);
          for (const t of chunkText(answer)) send(t);
        } catch {
          send("I'm having trouble right now — please email me at zaydthirteen@gmail.com.");
        }
      }

      controller.enqueue(encoder.encode(DONE));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}