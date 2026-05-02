// components/app-sidebar-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export function AppSidebarLink({ href, label, icon: Icon }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href; // or pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:text-primary",
        isActive && "bg-primary/10 text-primary"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </Link>
  );
}
