import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type ChatBody = { messages?: unknown };

const SYSTEM_PROMPT = `You are the AI Workplace Productivity Assistant — a strict, professional workplace helper.

Rules:
- Answer ONLY workplace/productivity related questions (email drafting, meeting prep, time management, professional communication, project planning, workplace etiquette, business writing, tools, career growth).
- If the user asks something off-topic (personal, medical, legal advice, entertainment, etc.), politely decline and steer them back to workplace tasks.
- Keep answers concise and structured. Use short bullets or numbered steps where useful.
- ALWAYS end every response with a "References:" section listing sources. If your answer is from general knowledge and no external source applies, write exactly:
References: General workplace knowledge — no external source cited.
- Otherwise list concrete references (framework names, standards, book titles, or reputable organizations). Never fabricate URLs.
- Never store or ask for personal credentials.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatBody;
        if (!Array.isArray(body.messages)) {
          return new Response("Messages required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("openai/gpt-5.5");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
        });
      },
    },
  },
});
