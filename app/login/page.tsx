"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
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
    <main className="min-h-screen flex flex-col justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0060FD 0%, #003db3 100%)" }}
    >
      {/* Blob Sfondo */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full animate-blob"
        style={{ background: "rgba(255,255,255,0.2)", filter: "blur(40px)" }}
      />
      <div
        className="absolute top-1/3 -right-20 w-80 h-80 rounded-full animate-blob animation-delay-2000"
        style={{ background: "rgba(255,255,255,0.15)", filter: "blur(50px)" }}
      />
      <div
        className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full animate-blob animation-delay-4000"
        style={{ background: "rgba(255,255,255,0.18)", filter: "blur(40px)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full animate-blob animation-delay-2000"
        style={{ background: "rgba(100,180,255,0.15)", filter: "blur(60px)" }}
      />

      {/* Card Form */}
      <div className="w-full max-w-md mx-auto relative z-10">

        {/* Logo + Titolo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
              <img src="/assets/logo.png" alt="Logo" width={64} height={64} className="object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white drop-shadow-sm tracking-tight">Bentornato!</h1>
          <p className="text-white/80 mt-1 text-sm font-medium">Accedi per gestire i tuoi eventi sportivi.</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl border border-white/25 p-6 shadow-2xl">
          {error && (
            <div className="bg-red-500/20 text-white p-3 rounded-xl flex gap-2 items-center mb-5 border border-red-300/30 text-sm backdrop-blur-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mario.rossi@example.com"
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-colors backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-colors backdrop-blur-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg mt-2 transition-all active:scale-[0.98] ${
                loading
                  ? "bg-white/30 text-white/60 cursor-not-allowed"
                  : "bg-white text-[#0060FD] hover:bg-white/90 hover:shadow-xl"
              }`}
            >
              {loading ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/80 font-medium mt-6">
          Non hai ancora un account?{" "}
          <Link href="/register" className="font-bold text-white hover:underline underline-offset-2">
            Registrati ora
          </Link>
        </p>
      </div>
    </main>
  );
}
