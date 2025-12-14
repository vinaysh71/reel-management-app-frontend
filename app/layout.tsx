// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Sidebar from "./components/side-bar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
    <body>
      <Sidebar>
        {children}
      </Sidebar> 
      </body>
    </html>
  );
}
