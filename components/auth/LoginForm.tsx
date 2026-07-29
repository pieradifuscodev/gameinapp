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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl flex gap-2 items-center mb-5 border border-red-100 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label className="text-slate-700 font-bold">Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario.rossi@example.com"
            className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary shadow-none"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-slate-700 font-bold">Password</Label>
            <Link href="/forgot-password" className="text-[12px] font-bold text-primary hover:underline">
              Password dimenticata?
            </Link>
          </div>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary shadow-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`h-12 w-full rounded-xl font-bold text-base shadow-sm mt-2 transition-all active:scale-[0.98] ${
            loading
              ? "bg-slate-100 text-slate-400"
              : "bg-primary text-white hover:bg-primary/90 hover:shadow-md"
          }`}
        >
          {loading ? "Accesso in corso..." : "Accedi"}
        </Button>
      </form>
    </div>
  );
}
