import { Package } from "lucide-react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    // Package icon for the logo:
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <div
          className="
          w-15 h-15
          rounded-2xl
          bg-zinc-900
          flex items-center justify-center
          shadow-[0_8px_30px_rgba(0,0,0,0.45)]
          border border-white/5
          bg-gradient-to-b
          from-zinc-800
          to-zinc-900
        "
        >
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl text-foreground mb-2">Reel Management app</h1>
      </div>

      <LoginForm />
    </div>
  );
}
