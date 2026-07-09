import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, Loader2, Mail, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/email.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkAI" },
      {
        name: "description",
        content: "Generate professional emails in Formal, Friendly, or Persuasive tones.",
      },
    ],
  }),
  component: EmailGeneratorPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";
type Length = "Short" | "Medium" | "Long";

function EmailGeneratorPage() {
  const generate = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [length, setLength] = useState<Length>("Medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Recipient and purpose are required");
      return;
    }
    setLoading(true);
    try {
      const res = await generate({
        data: { recipient, purpose, keyPoints, tone, length },
      });
      setOutput(res.email);
      toast.success("Email generated");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
          <Mail className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">
            Structured inputs → polished professional email.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email details</CardTitle>
            <CardDescription>Fill in the fields, choose a tone, and generate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Jane Smith, Marketing Manager"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Subject / Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request a meeting to discuss Q3 campaign"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points (optional)</Label>
              <Textarea
                id="points"
                rows={5}
                placeholder="- Available Tue/Wed afternoon&#10;- Prefer 30 minute slot&#10;- Include product team"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
              Generate email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <CardTitle>Generated email</CardTitle>
                <CardDescription>Edit freely before sending.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copy}
                disabled={!output}
                className="shrink-0"
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={20}
              placeholder="Your generated email will appear here..."
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
