"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Activity, Building2 } from "lucide-react";
import { BlobBanner } from "@/components/ui/BlobBanner";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"SPORTIVO" | "ORGANIZZATORE">("SPORTIVO");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    if (!acceptTerms || !acceptPrivacy) {
      setError("Devi accettare Termini e Privacy per continuare.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registrazione fallita");
      }

      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        throw new Error("Account creato ma login automatico fallito. Riprova dalla pagina di login.");
      }

      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe overflow-hidden">
      <div className="flex-1 px-5 pt-10 pb-6 z-10 overflow-y-auto">
        
        <BlobBanner 
          title="Crea il tuo Account"
          subtitle="Inizia subito a usare l'app"
          variant="primary"
          showLogo={true}
          className="mb-6"
        />

        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Dati Base */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mario@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0060FD] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crea una password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0060FD] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Conferma Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ripeti la password"
                className={`w-full bg-gray-50 border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  confirmPassword && password !== confirmPassword 
                  ? "border-red-300 focus:ring-red-500" 
                  : "border-gray-200 focus:ring-[#0060FD] focus:bg-white"
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-red-500 mt-1 font-medium">Le password non coincidono</p>
              )}
            </div>

            {/* Checkbox Termini */}
            <div className="flex flex-col gap-2 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <label className="flex items-start gap-2 text-[11px] text-gray-600">
                <input 
                  type="checkbox" 
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-[#0060FD] focus:ring-[#0060FD]" 
                />
                <span>Accetto i <a href="#" className="text-[#0060FD] hover:underline font-bold">Termini e Condizioni</a> del servizio</span>
              </label>
              <label className="flex items-start gap-2 text-[11px] text-gray-600">
                <input 
                  type="checkbox" 
                  required
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-[#0060FD] focus:ring-[#0060FD]" 
                />
                <span>Ho letto e accetto la <a href="#" className="text-[#0060FD] hover:underline font-bold">Privacy Policy</a></span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || password !== confirmPassword || !acceptTerms || !acceptPrivacy}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md mt-2 transition-transform active:scale-[0.98] ${
                loading || password !== confirmPassword || !acceptTerms || !acceptPrivacy
                ? "bg-[#0060FD]/50 cursor-not-allowed" 
                : "bg-[#0060FD] hover:bg-[#0050D0]"
              }`}
            >
              {loading ? "Creazione in corso..." : "Registrati e Continua"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Hai già un account?{" "}
          <Link href="/login" className="text-[#0060FD] font-bold hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
