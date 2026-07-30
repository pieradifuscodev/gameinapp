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
    <div className="bg-[#16161A] rounded-2xl p-6 shadow-2xl border border-[#222226]">
      {error && (
        <div className="bg-red-500/10 text-red-400 text-xs font-semibold p-3 rounded-xl mb-4 border border-red-500/20 flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <Label className="text-[#8E8E93] uppercase tracking-wide text-xs font-black">Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mario@example.com"
            className="h-12 bg-[#0C0C0E] border-[#222226] rounded-xl px-4 text-white placeholder:text-[#8E8E93] focus-visible:ring-[#CCFF00] focus-visible:border-[#CCFF00] shadow-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#8E8E93] uppercase tracking-wide text-xs font-black">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea una password"
              className="h-12 bg-[#0C0C0E] border-[#222226] rounded-xl pl-4 pr-10 text-white placeholder:text-[#8E8E93] focus-visible:ring-[#CCFF00] focus-visible:border-[#CCFF00] shadow-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[#8E8E93] uppercase tracking-wide text-xs font-black">Conferma Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ripeti la password"
            className={`h-12 bg-[#0C0C0E] border rounded-xl px-4 text-white placeholder:text-[#8E8E93] shadow-none ${
              confirmPassword && password !== confirmPassword 
              ? "border-red-500 focus-visible:ring-red-500" 
              : "border-[#222226] focus-visible:ring-[#CCFF00] focus-visible:border-[#CCFF00]"
            }`}
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-[10px] text-red-500 mt-1 font-semibold">Le password non coincidono</p>
          )}
        </div>

        {/* Checkbox Termini */}
        <div className="flex flex-col gap-3 mt-2 bg-[#0C0C0E] p-4 rounded-xl border border-[#222226]">
          <div className="flex items-start gap-2.5">
            <Checkbox 
              id="terms" 
              checked={acceptTerms} 
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              className="mt-0.5 border-[#222226] text-black data-[state=checked]:bg-[#CCFF00] data-[state=checked]:border-[#CCFF00]" 
            />
            <Label htmlFor="terms" className="text-xs text-[#8E8E93] leading-tight font-normal">
              Accetto i <a href="#" className="text-[#CCFF00] hover:underline font-bold">Termini e Condizioni</a> del servizio
            </Label>
          </div>
          <div className="flex items-start gap-2.5">
            <Checkbox 
              id="privacy" 
              checked={acceptPrivacy} 
              onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
              className="mt-0.5 border-[#222226] text-black data-[state=checked]:bg-[#CCFF00] data-[state=checked]:border-[#CCFF00]" 
            />
            <Label htmlFor="privacy" className="text-xs text-[#8E8E93] leading-tight font-normal">
              Ho letto e accetto la <a href="#" className="text-[#CCFF00] hover:underline font-bold">Privacy Policy</a>
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || password !== confirmPassword || !acceptTerms || !acceptPrivacy}
          className="h-12 w-full rounded-xl text-black font-black uppercase tracking-wider text-xs shadow-md mt-2 transition-transform active:scale-[0.98] bg-[#CCFF00] hover:opacity-90 disabled:opacity-50 disabled:bg-[#222226] disabled:text-[#8E8E93]"
        >
          {loading ? "Creazione in corso..." : "Registrati e Continua"}
        </Button>
      </form>
    </div>
  );
}
