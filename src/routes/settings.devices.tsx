import { createFileRoute } from "@tanstack/react-router";
import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import { SectionHeader } from "@/components/settings/SectionHeader";
import { TrustCard, TrustSummary } from "@/components/settings/TrustCard";
import { useWallet } from "@/lib/wallet-store";

export const Route = createFileRoute("/settings/devices")({
  head: () => ({
    meta: [
      { title: "الأجهزة — Winter Wolf" },
      { name: "description", content: "إدارة الأجهزة المتصلة بمحفظتك: توثيق أو حظر." },
      { property: "og:title", content: "الأجهزة — Winter Wolf" },
      { property: "og:description", content: "إدارة الأجهزة المتصلة بمحفظتك: توثيق أو حظر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DevicesPage,
});

const icons = { phone: Smartphone, laptop: Laptop, tablet: Tablet, desktop: Monitor };

function DevicesPage() {
  const { devices, deviceAction } = useWallet();
  return (
    <>
      <SectionHeader title="الأجهزة" description="الأجهزة التي سجّلت الدخول إلى محفظتك. وثّق ما تعرفه واحظر ما لا تعرفه." />
      <TrustSummary items={devices} />
      <div className="grid gap-4 md:grid-cols-2">
        {devices.map((d) => {
          const Icon = icons[d.kind];
          return (
            <TrustCard
              key={d.id}
              icon={<Icon />}
              title={d.name}
              subtitle={d.os}
              status={d.status}
              current={d.current}
              meta={[
                { label: "الموقع", value: d.location },
                { label: "آخر نشاط", value: d.lastActive },
              ]}
              onAction={(a) => deviceAction(d.id, a)}
            />
          );
        })}
      </div>
    </>
  );
}
