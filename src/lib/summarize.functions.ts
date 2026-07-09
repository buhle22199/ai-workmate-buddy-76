import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  notes: z.string().min(10).max(20000),
});

const OutputSchema = z.object({
  summary: z.string(),
  actionItems: z.array(
    z.object({
      task: z.string(),
      owner: z.string().nullable(),
      deadline: z.string().nullable(),
    }),
  ),
  decisions: z.array(z.string()),
  deadlines: z.array(z.string()),
});

export type MeetingSummary = z.infer<typeof OutputSchema>;

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<MeetingSummary> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key, { structuredOutputs: true });
    const model = gateway("openai/gpt-5.5");

    const prompt = `Summarize the meeting notes below. Extract:
- A concise executive summary (2-4 sentences).
- Action items with owner and deadline when mentioned (null if not).
- Key decisions.
- All deadlines mentioned.

Meeting notes:
"""
${data.notes}
"""`;

    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: OutputSchema }),
        prompt,
      });
      return output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return {
          summary: (error.text ?? "Could not parse summary.").slice(0, 1000),
          actionItems: [],
          decisions: [],
          deadlines: [],
        };
      }
      throw error;
    }
  });
