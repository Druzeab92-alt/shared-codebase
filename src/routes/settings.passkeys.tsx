import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint, KeyRound } from "lucide-react";
import { SectionHeader } from "@/components/settings/SectionHeader";
import { TrustCard, TrustSummary } from "@/components/settings/TrustCard";
import { useWallet } from "@/lib/wallet-store";

export const Route = createFileRoute("/settings/passkeys")({
  head: () => ({
    meta: [
      { title: "مفاتيح المرور — Winter Wolf" },
      { name: "description", content: "إدارة مفاتيح المرور (Passkeys): توثيق وحظر وتجديد." },
      { property: "og:title", content: "مفاتيح المرور — Winter Wolf" },
      { property: "og:description", content: "إدارة مفاتيح المرور (Passkeys): توثيق وحظر وتجديد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PasskeysPage,
});

function PasskeysPage() {
  const { passkeys, passkeyAction, renewPasskey } = useWallet();
  return (
    <>
      <SectionHeader title="مفاتيح المرور" description="مفاتيح Passkey تتيح الدخول دون كلمة سر. جدّد المفاتيح القديمة باستمرار." />
      <TrustSummary items={passkeys} />
      <div className="grid gap-4 md:grid-cols-2">
        {passkeys.map((k) => (
          <TrustCard
            key={k.id}
            icon={k.authenticator.includes("مفتاح") ? <KeyRound /> : <Fingerprint />}
            title={k.name}
            subtitle={k.authenticator}
            status={k.status}
            meta={[
              { label: "تاريخ الإنشاء", value: k.createdAt },
              { label: "آخر استخدام", value: k.lastUsed },
            ]}
            onAction={(a) => passkeyAction(k.id, a)}
            onRenew={() => renewPasskey(k.id)}
          />
        ))}
      </div>
    </>
  );
}
