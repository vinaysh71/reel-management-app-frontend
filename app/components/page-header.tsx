import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type PageHeaderProps = {
  title: string;
  description?: string;
  // extra actions per page (e.g. filters, export button)
  children?: ReactNode;
  // primary action like "Add Reel"
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
};

export default function PageHeader({
  title,
  description,
  children,
  primaryAction,
  className,
}: PageHeaderProps) {
  const handlePrimaryClick = () => {
    if (primaryAction?.onClick) primaryAction.onClick();
  };
  return (
    <header className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {children}
          {primaryAction ? (
            primaryAction.href ? (
              <Button asChild>
                <a href={primaryAction.href}>{primaryAction.label}</a>
              </Button>
            ) : (
              <Button onClick={handlePrimaryClick}>
                {primaryAction.label}
              </Button>
            )
          ) : null}
        </div>
      </div>

      <Separator />
    </header>
  );
}
