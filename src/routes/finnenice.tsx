import { createFileRoute } from "@tanstack/react-router";
import { HomeNav } from "@/components/home/HomeNav";

export const Route = createFileRoute("/finnenice")({
  head: () => ({ meta: [
    { title: "Finnenice — Winter Wolf" },
    { name: "description", content: "صفحة Finnenice في محفظة Winter Wolf." },
    { property: "og:title", content: "Finnenice — Winter Wolf" },
    { property: "og:description", content: "صفحة Finnenice في محفظة Winter Wolf." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: FinnenicePage,
});

function FinnenicePage() {
  return <><HomeNav /><div className="mx-auto max-w-6xl px-4 py-8 pb-24"><h1 className="text-2xl font-semibold sm:text-3xl">Finnenice</h1></div></>;
}