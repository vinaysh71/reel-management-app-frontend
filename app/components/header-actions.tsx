// components/header-actions.tsx
"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function HeaderActions() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid mismatch between server and client
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

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
    </div>
  );
}
