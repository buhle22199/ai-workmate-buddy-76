import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Loader2, Wand2, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { summarizeNotes, type MeetingSummary } from "@/lib/summarize.functions";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkAI" },
      {
        name: "description",
        content: "Summarize meeting notes and extract action items, decisions, and deadlines.",
      },
    ],
  }),
  component: SummarizerPage,
});

type EditableSummary = {
  summary: string;
  actionItems: { task: string; owner: string; deadline: string }[];
  decisions: string[];
  deadlines: string[];
};

function toEditable(s: MeetingSummary): EditableSummary {
  return {
    summary: s.summary,
    actionItems: s.actionItems.map((a) => ({
      task: a.task,
      owner: a.owner ?? "",
      deadline: a.deadline ?? "",
    })),
    decisions: s.decisions,
    deadlines: s.deadlines,
  };
}

function SummarizerPage() {
  const summarize = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<EditableSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (notes.trim().length < 10) {
      toast.error("Please paste more meeting notes");
      return;
    }
    setLoading(true);
    try {
      const res = await summarize({ data: { notes } });
      setResult(toEditable(res));
      toast.success("Summary ready", {
        description: `${res.actionItems.length} action item${res.actionItems.length === 1 ? "" : "s"} • ${res.decisions.length} decision${res.decisions.length === 1 ? "" : "s"}`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to summarize";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    if (!result) return;
    const text = `SUMMARY
${result.summary}

ACTION ITEMS
${result.actionItems.map((a) => `- ${a.task}${a.owner ? ` (${a.owner})` : ""}${a.deadline ? ` — ${a.deadline}` : ""}`).join("\n")}

DECISIONS
${result.decisions.map((d) => `- ${d}`).join("\n")}

DEADLINES
${result.deadlines.map((d) => `- ${d}`).join("\n")}`;
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">Meeting Notes Summarizer</h1>
          <p className="text-sm text-muted-foreground">
            Extract summary, action items, decisions, and deadlines.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Paste meeting notes</CardTitle>
            <CardDescription>Raw notes, transcript, or bullet points.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={18}
              placeholder="Paste your meeting notes here..."
              className="text-sm"
            />
            <Button
              onClick={run}
              disabled={loading}
              className="w-full bg-gradient-primary shadow-glow"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Summarize
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <CardTitle>Structured summary</CardTitle>
                <CardDescription>All fields are editable.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAll}
                disabled={!result}
                className="shrink-0"
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {!result && (
              <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                Your summary will appear here.
              </div>
            )}
            {result && (
              <>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Textarea
                    rows={4}
                    value={result.summary}
                    onChange={(e) => setResult({ ...result, summary: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Action items</Label>
                  {result.actionItems.length === 0 && (
                    <p className="text-xs text-muted-foreground">None extracted.</p>
                  )}
                  <div className="space-y-2">
                    {result.actionItems.map((a, i) => (
                      <div
                        key={i}
                        className="grid gap-2 rounded-md border border-border/60 bg-secondary/40 p-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
                      >
                        <Input
                          value={a.task}
                          placeholder="Task"
                          onChange={(e) => {
                            const next = [...result.actionItems];
                            next[i] = { ...a, task: e.target.value };
                            setResult({ ...result, actionItems: next });
                          }}
                        />
                        <Input
                          value={a.owner}
                          placeholder="Owner"
                          onChange={(e) => {
                            const next = [...result.actionItems];
                            next[i] = { ...a, owner: e.target.value };
                            setResult({ ...result, actionItems: next });
                          }}
                        />
                        <Input
                          value={a.deadline}
                          placeholder="Deadline"
                          onChange={(e) => {
                            const next = [...result.actionItems];
                            next[i] = { ...a, deadline: e.target.value };
                            setResult({ ...result, actionItems: next });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Decisions</Label>
                  <Textarea
                    rows={3}
                    value={result.decisions.join("\n")}
                    onChange={(e) =>
                      setResult({
                        ...result,
                        decisions: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="One decision per line"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Deadlines</Label>
                  <Textarea
                    rows={3}
                    value={result.deadlines.join("\n")}
                    onChange={(e) =>
                      setResult({
                        ...result,
                        deadlines: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="One deadline per line"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
