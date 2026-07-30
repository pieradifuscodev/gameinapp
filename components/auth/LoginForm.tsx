"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="bg-[#16161A] rounded-2xl border border-[#222226] p-6 shadow-2xl">
      {error && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded-xl flex gap-2 items-center mb-5 border border-red-500/20 text-xs font-semibold">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label className="text-[#8E8E93] uppercase tracking-wide text-xs font-black">Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario.rossi@example.com"
            className="h-12 bg-[#0C0C0E] border-[#222226] rounded-xl px-4 text-white placeholder:text-[#8E8E93] focus-visible:ring-[#CCFF00] focus-visible:border-[#CCFF00] shadow-none"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-[#8E8E93] uppercase tracking-wide text-xs font-black">Password</Label>
            <Link href="/forgot-password" className="text-[11px] font-black uppercase tracking-wider text-[#CCFF00] hover:underline">
              Password dimenticata?
            </Link>
          </div>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 bg-[#0C0C0E] border-[#222226] rounded-xl px-4 text-white placeholder:text-[#8E8E93] focus-visible:ring-[#CCFF00] focus-visible:border-[#CCFF00] shadow-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl font-black uppercase tracking-wider text-xs shadow-md mt-2 transition-all active:scale-[0.98] bg-[#CCFF00] text-black hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Accesso in corso..." : "Accedi"}
        </Button>
      </form>
    </div>
  );
}
