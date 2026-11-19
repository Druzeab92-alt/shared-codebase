import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SettingsNav } from "@/components/settings/SettingsNav";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — Winter Wolf" },
      { name: "description", content: "إعدادات الملف الشخصي والمظهر والأمان في Winter Wolf." },
      { property: "og:title", content: "الإعدادات — Winter Wolf" },
      { property: "og:description", content: "إعدادات الملف الشخصي والمظهر والأمان في Winter Wolf." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsLayout,
});

function SettingsLayout() {
  return (
    <>
      <SettingsNav />
      <div className="mx-auto max-w-6xl px-4 py-8 pb-24">
        <Outlet />
      </div>
    </>
  );
}
