import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  recipient: z.string().min(1).max(200),
  purpose: z.string().min(1).max(500),
  keyPoints: z.string().max(3000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Short", "Medium", "Long"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("openai/gpt-5.5");

    const system = `You are an expert email writer. Write a complete, ready-to-send professional email.
- Use the requested tone precisely.
- Include a subject line prefixed with "Subject: " on the first line.
- Then a greeting, body, and closing.
- Do not add commentary, markdown, or code fences. Output ONLY the email text.`;

    const prompt = `Recipient: ${data.recipient}
Purpose/Subject: ${data.purpose}
Key points: ${data.keyPoints || "(none provided — infer reasonable content)"}
Tone: ${data.tone}
Length: ${data.length}`;

    const { text } = await generateText({
      model,
      system,
      prompt,
    });

    return { email: text.trim() };
  });
