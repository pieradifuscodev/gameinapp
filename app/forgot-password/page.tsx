"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      toast.success("Ti abbiamo inviato un'email con il link di reset");
    } catch (err: any) {
      toast.error(err.message || "Qualcosa è andato storto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-12 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-md mx-auto relative z-10">
        <Link href="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Torna al Login
        </Link>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recupera Password</h1>
          <p className="text-slate-500 mt-1 text-sm">Inserisci la tua email per ricevere il link di reset.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✉️</div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Controlla la tua email</h2>
              <p className="text-slate-500 text-sm">Abbiamo inviato le istruzioni per reimpostare la tua password.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="mario.rossi@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] font-medium outline-none focus:border-slate-400 focus:bg-white transition-all"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-12 mt-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Invia Link di Reset"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
