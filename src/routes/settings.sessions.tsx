import { createFileRoute } from "@tanstack/react-router";
import { Globe, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/settings/SectionHeader";
import { TrustCard, TrustSummary } from "@/components/settings/TrustCard";
import { useWallet } from "@/lib/wallet-store";

export const Route = createFileRoute("/settings/sessions")({
  head: () => ({
    meta: [
      { title: "الجلسات — Winter Wolf" },
      { name: "description", content: "الجلسات النشطة في محفظتك مع خيارات التوثيق والحظر." },
      { property: "og:title", content: "الجلسات — Winter Wolf" },
      { property: "og:description", content: "الجلسات النشطة في محفظتك مع خيارات التوثيق والحظر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SessionsPage,
});

function SessionsPage() {
  const { sessions, sessionAction } = useWallet();
  const others = sessions.filter((s) => !s.current && s.status !== "blocked");
  return (
    <>
      <SectionHeader
        title="الجلسات"
        description="كل جلسة دخول نشطة. احظر أي جلسة مشبوهة فوراً."
        action={
          <Button
            variant="soft-destructive"
            disabled={others.length === 0}
            onClick={() => {
              others.forEach((s) => sessionAction(s.id, "block"));
              toast.error("تم حظر كل الجلسات الأخرى");
            }}
          >
            <LogOut />
            حظر كل الجلسات الأخرى
          </Button>
        }
      />
      <TrustSummary items={sessions} />
      <div className="grid gap-4 md:grid-cols-2">
        {sessions.map((s) => (
          <TrustCard
            key={s.id}
            icon={<Globe />}
            title={s.browser}
            subtitle={s.device}
            status={s.status}
            current={s.current}
            meta={[
              { label: "عنوان IP", value: s.ip },
              { label: "الموقع", value: s.location },
              { label: "بدأت", value: s.startedAt },
            ]}
            onAction={(a) => sessionAction(s.id, a)}
          />
        ))}
      </div>
    </>
  );
}
