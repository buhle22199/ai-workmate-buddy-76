import { createFileRoute } from "@tanstack/react-router";
import { ReviewsWidget } from "@/components/reviews-widget";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "User Reviews — WorkAI" },
      { name: "description", content: "Rate your experience with the WorkAI assistant." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">User Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Help us improve. Your feedback is stored only in your browser.
        </p>
      </div>
      <ReviewsWidget />
    </div>
  );
}
