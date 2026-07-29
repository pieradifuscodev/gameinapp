"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <main className="min-h-screen flex flex-col justify-center px-6 py-12 bg-slate-50 items-center text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-2">Token Mancante</h1>
        <p className="text-slate-500 mb-6">Il link di reset non è valido o è incompleto.</p>
        <Link href="/login" className="text-primary font-bold hover:underline">Torna al Login</Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }
    if (password.length < 8) {
      toast.error("La password deve essere di almeno 8 caratteri");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      toast.success("Password aggiornata con successo!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      toast.error(err.message || "Errore durante il reset della password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-12 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nuova Password</h1>
          <p className="text-slate-500 mt-1 text-sm">Inserisci la tua nuova password.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎉</div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Password Aggiornata!</h2>
              <p className="text-slate-500 text-sm">Verrai reindirizzato al login tra pochi secondi...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Nuova Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] font-medium outline-none focus:border-slate-400 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Conferma Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] font-medium outline-none focus:border-slate-400 focus:bg-white transition-all"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-12 mt-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Aggiorna Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-slate-400" size={32} /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
