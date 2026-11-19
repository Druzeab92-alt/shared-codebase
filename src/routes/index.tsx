import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الرئيسية — Winter Wolf" },
      { name: "description", content: "الصفحة الرئيسية لمحفظة Winter Wolf." },
      { property: "og:title", content: "الرئيسية — Winter Wolf" },
      { property: "og:description", content: "الصفحة الرئيسية لمحفظة Winter Wolf." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Intentionally empty for now — content comes later.
function Index() {
  return (
    <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4">
      <h1 className="sr-only">الرئيسية</h1>
    </div>
  );
}
