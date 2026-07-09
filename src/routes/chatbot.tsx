import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useMemo } from "react";
import { Bot, Send, Loader2, User, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — WorkAI" },
      {
        name: "description",
        content: "Strict AI workplace assistant that cites references on every answer.",
      },
    ],
  }),
  component: ChatbotPage,
});

function ChatbotPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const { messages, sendMessage, status, setMessages } = useChat({
    id: sessionId,
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    inputRef.current?.focus();
  }, [sessionId, status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  };

  const newChat = () => {
    setMessages([]);
    setSessionId(crypto.randomUUID());
    setInput("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col px-4 py-6">
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-primary shadow-glow">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl font-bold">AI Workplace Chatbot</h1>
            <p className="truncate text-sm text-muted-foreground">
              Strictly workplace topics. Every reply cites references.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={newChat} className="shrink-0">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New chat
        </Button>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col">
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.length === 0 && (
              <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                <div>
                  <Bot className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p>Ask me anything about workplace productivity.</p>
                  <p className="mt-1 text-xs">
                    e.g. "How do I prepare for a performance review?"
                  </p>
                </div>
              </div>
            )}
            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{text}</div>
                  </div>
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="inline h-3.5 w-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-border/60 pt-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask a workplace question..."
              rows={2}
              className="min-h-0 flex-1 resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={submit}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="shrink-0 bg-gradient-primary shadow-glow"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
