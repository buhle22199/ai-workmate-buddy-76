import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

type Review = { id: string; name: string; rating: number; comment: string; at: number };

const KEY = "workai-reviews-v1";

function load(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

export function ReviewsWidget({ compact = false }: { compact?: boolean }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setReviews(load());
  }, []);

  const avg =
    reviews.length === 0 ? 0 : reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  const submit = () => {
    if (!comment.trim()) {
      toast.error("Please add a comment");
      return;
    }
    const next: Review = {
      id: crypto.randomUUID(),
      name: name.trim() || "Anonymous",
      rating,
      comment: comment.trim(),
      at: Date.now(),
    };
    const updated = [next, ...reviews].slice(0, 50);
    setReviews(updated);
    window.localStorage.setItem(KEY, JSON.stringify(updated));
    setName("");
    setComment("");
    setRating(5);
    toast.success("Thanks for your feedback!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <CardTitle>User Reviews</CardTitle>
            <CardDescription>
              Rate your experience. Stored locally in your browser only.
            </CardDescription>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-display text-2xl font-bold text-primary">
              {avg.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 rounded-lg border border-border/60 bg-secondary/40 p-4">
          <Input
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
          />
          <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
              >
                <Star
                  className={`h-6 w-6 transition ${
                    n <= (hover || rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={3}
          />
          <Button onClick={submit} className="w-full sm:w-auto">
            Submit review
          </Button>
        </div>

        {reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.slice(0, compact ? 3 : 10).map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-border/60 bg-card/60 p-3"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3.5 w-3.5 ${
                          n <= r.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
