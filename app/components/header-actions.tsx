// components/header-actions.tsx
"use client";

import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

export function HeaderActions() {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid hydration mismatch without synchronously updating state in an effect.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        {isDark ? (
          <Sun className="h-5 w-5" /> // currently dark → show Sun (go light)
        ) : (
          <Moon className="h-5 w-5" /> // currently light → show Moon (go dark)
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() =>
          signOut({
            callbackUrl: "/login",
          })
        }
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
