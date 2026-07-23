"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function RegisterForm() {
  const router = useRouter();
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100 flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <Label className="text-slate-700 font-bold">Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario@example.com"
            className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary shadow-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-700 font-bold">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea una password"
              className="h-12 bg-slate-50 border-slate-200 rounded-xl pl-4 pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary shadow-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-700 font-bold">Conferma Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ripeti la password"
            className={`h-12 bg-slate-50 border rounded-xl px-4 text-slate-900 placeholder:text-slate-400 shadow-none ${
              confirmPassword && password !== confirmPassword 
              ? "border-red-300 focus-visible:ring-red-500" 
              : "border-slate-200 focus-visible:ring-primary focus-visible:border-primary"
            }`}
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-[10px] text-red-500 mt-1 font-medium">Le password non coincidono</p>
          )}
        </div>

        {/* Checkbox Termini */}
        <div className="flex flex-col gap-3 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-start gap-2.5">
            <Checkbox 
              id="terms" 
              checked={acceptTerms} 
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              className="mt-0.5 border-slate-300 text-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <Label htmlFor="terms" className="text-xs text-slate-600 leading-tight font-normal">
              Accetto i <a href="#" className="text-primary hover:underline font-bold">Termini e Condizioni</a> del servizio
            </Label>
          </div>
          <div className="flex items-start gap-2.5">
            <Checkbox 
              id="privacy" 
              checked={acceptPrivacy} 
              onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
              className="mt-0.5 border-slate-300 text-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <Label htmlFor="privacy" className="text-xs text-slate-600 leading-tight font-normal">
              Ho letto e accetto la <a href="#" className="text-primary hover:underline font-bold">Privacy Policy</a>
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || password !== confirmPassword || !acceptTerms || !acceptPrivacy}
          className={`h-12 w-full rounded-xl text-white font-bold text-base shadow-sm mt-2 transition-transform active:scale-[0.98] ${
            loading || password !== confirmPassword || !acceptTerms || !acceptPrivacy
            ? "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200" 
            : "bg-primary hover:bg-primary/90 hover:shadow-md"
          }`}
        >
          {loading ? "Creazione in corso..." : "Registrati e Continua"}
        </Button>
      </form>
    </div>
  );
}
