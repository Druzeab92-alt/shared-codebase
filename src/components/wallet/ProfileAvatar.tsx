import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/wallet-data";

export function ProfileAvatar({ profile, className }: { profile: Profile; className?: string }) {
  const initials = profile.name
    .replace(/·/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-primary font-display text-sm font-semibold text-primary-foreground ring-2 ring-background",
        className,
      )}
    >
      {profile.avatar ? (
        <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
