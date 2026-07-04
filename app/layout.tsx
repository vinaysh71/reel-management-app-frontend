// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Sidebar from "./components/side-bar";
import { ThemeProvider } from "./components/theme-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
